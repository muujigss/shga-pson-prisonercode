'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/sockets';
import {
  FINGER_DEVICE_CHECK_PATH,
  FINGER_ENROLL_PATH,
  FpAction,
  FpState,
  canStartEnroll,
  deriveStatus,
  fingerprintReducer,
  initialFpState,
  parseAgentMessage,
  usableImage,
} from '@/lib/fingerprint';

interface EnrollPayload {
  registerNum: string;
  serial: string;
  template: string;
}

export function useFingerprint() {
  const [state, setState] = useState<FpState>(initialFpState);
  // Socket-ийн callback дотроос хамгийн сүүлийн төлвийг синхрон унших зорилготой
  const stateRef = useRef<FpState>(initialFpState);
  const lastPayloadRef = useRef<EnrollPayload | null>(null);
  const [checkTick, setCheckTick] = useState(0);

  const dispatch = useCallback((action: FpAction) => {
    const next = fingerprintReducer(stateRef.current, action);
    stateRef.current = next;
    setState(next);
    return next;
  }, []);

  const saveTemplate = useCallback(
    async (payload: EnrollPayload) => {
      lastPayloadRef.current = payload;
      dispatch({ type: 'save_start' });
      try {
        await api(FINGER_ENROLL_PATH, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        dispatch({ type: 'save_ok' });
      } catch (err) {
        console.log('finger enroll save error:', err);
        if (err instanceof TypeError) {
          dispatch({ type: 'save_fail', reason: 'network', message: null });
        } else if (err instanceof Error && err.message === 'Unauthorized') {
          dispatch({ type: 'save_fail', reason: 'unauthorized', message: null });
        } else {
          const message = err instanceof Error && err.message !== 'Request failed' ? err.message : null;
          dispatch({ type: 'save_fail', reason: 'server', message });
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const removeMessage = socket.addMessageListener((event) => {
      const msg = parseAgentMessage(event.data);
      if (!msg) return;
      const next = dispatch({ type: 'message', msg });

      // Зөвхөн энэ цонхноос эхлүүлсэн бүртгэлийг хадгална — бусад клиент ч ижил event авдаг (8.7)
      if (
        msg.eventType === 'ENROLL_SUCCESS' &&
        next.enroll.phase === 'success' &&
        next.enroll.own &&
        typeof msg.payload === 'string'
      ) {
        saveTemplate({
          registerNum: next.enroll.registerNum ?? '',
          // DISCONNECTED үеэс бусад мессеж бүрт serial байна. Хоосон бол сүүлд мэдэгдсэнийг авна (8.6)
          serial: msg.serial || next.serial,
          template: msg.payload,
        });
      }
    });
    const removeOpen = socket.addOpenListener(() => dispatch({ type: 'socket_open' }));
    const removeClose = socket.addCloseListener(() => dispatch({ type: 'socket_close' }));

    // Socket өмнө нь нээгдсэн бол (хуудас дахин mount болсон г.м.) snapshot өнгөрсөн тул дахин асууна.
    // Холбогдож байгаа бол snapshot өөрөө ирнэ.
    if (socket.state === 'open') {
      dispatch({ type: 'socket_open' });
      socket.send('CMD_STATUS');
    } else if (socket.state === 'closed') {
      dispatch({ type: 'socket_close' });
    }

    return () => {
      removeMessage();
      removeOpen();
      removeClose();
    };
  }, [dispatch, saveTemplate]);

  // Уншигч бүртгэлтэй эсэхийг backend-ээс асууна. Алдаа гарвал юу ч хаахгүй (login шийднэ).
  const deviceSerial = state.device?.serial ?? '';
  useEffect(() => {
    if (!deviceSerial) return;
    let cancelled = false;
    api(FINGER_DEVICE_CHECK_PATH, {
      method: 'POST',
      body: JSON.stringify({ serial: deviceSerial }),
    })
      .then((res) => {
        if (cancelled) return;
        dispatch({
          type: 'device_checked',
          registration: {
            serial: deviceSerial,
            registered: !!res?.registered,
            enforced: !!res?.enforced,
          },
        });
      })
      .catch((err) => console.log('finger device check error:', err));
    return () => {
      cancelled = true;
    };
  }, [deviceSerial, checkTick, dispatch]);

  const recheckDevice = useCallback(() => setCheckTick((n) => n + 1), []);

  const startEnroll = useCallback(
    (registerNum: string) => {
      const socket = getSocket();
      const subject = registerNum.trim();
      if (!socket || !subject || !canStartEnroll(deriveStatus(stateRef.current))) return;
      dispatch({ type: 'enroll_requested', registerNum: subject });
      socket.send('CMD_ENROLL_START');
    },
    [dispatch],
  );

  const cancelEnroll = useCallback(() => {
    dispatch({ type: 'cancel_requested' });
    getSocket()?.send('CMD_ENROLL_CANCEL');
  }, [dispatch]);

  const openDevice = useCallback(() => {
    getSocket()?.send('CMD_OPEN_DEVICE');
  }, []);

  // "Дахин оролдох": алдааны төрлөөс хамаарч бүртгэлийг дахин эхлүүлэх эсвэл төхөөрөмжийг дахин нээнэ
  const retry = useCallback(
    (registerNum: string) => {
      const error = stateRef.current.error;
      dispatch({ type: 'dismiss' });
      if (error?.retry === 'enroll' && registerNum.trim()) startEnroll(registerNum);
      else openDevice();
    },
    [dispatch, startEnroll, openDevice],
  );

  const retrySave = useCallback(() => {
    if (lastPayloadRef.current) saveTemplate(lastPayloadRef.current);
  }, [saveTemplate]);

  const dismiss = useCallback(() => dispatch({ type: 'dismiss' }), [dispatch]);
  const clearImage = useCallback(() => dispatch({ type: 'clear_image' }), [dispatch]);
  const reconnect = useCallback(() => getSocket()?.reconnectNow(), []);

  const status = deriveStatus(state);
  const image = usableImage(state, status);

  return {
    state,
    status,
    image,
    imageSerial: image ? state.imageSerial : '',
    canStartEnroll: canStartEnroll(status),
    startEnroll,
    cancelEnroll,
    openDevice,
    retry,
    retrySave,
    dismiss,
    clearImage,
    reconnect,
    recheckDevice,
  };
}

export type FingerprintController = ReturnType<typeof useFingerprint>;
