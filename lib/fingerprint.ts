// ZkFingerprint агентын протокол (docs/CLIENT_GUIDE.md) ба UX төлвийн логик.
// React-аас хамааралгүй цэвэр функцууд: event -> төлөв (reducer), төлөв -> дэлгэц (deriveStatus).

// ENROLL_SUCCESS-ийн template-ийг хадгалах backend endpoint (NEXT_PUBLIC_API_URL-ийн дараах зам).
export const FINGER_ENROLL_PATH =
  process.env.NEXT_PUBLIC_FINGER_ENROLL_PATH || '/prisoner-code-auth/finger-enroll';

// Уншигч бүртгэлтэй эсэхийг шалгах backend endpoint (зөвхөн UX; жинхэнэ шалгалт login дээр)
export const FINGER_DEVICE_CHECK_PATH = '/finger-device/check';

// Хурууны хээ уншигчийн програмын (ZkFingerprintSetup zip) хувилбар
export const FINGER_AGENT_LATEST_PATH = '/finger-agent/latest';
export const FINGER_AGENT_DOWNLOAD_PATH = '/finger-agent/download';
export const FINGER_AGENT_UPLOAD_PATH = '/finger-agent/upload';

export interface AgentRelease {
  version: string;
  fileName: string;
  fileSize: number;
  sha256: string;
  createdDate: string;
}

// "1.1.0.0" хэлбэрийн хувилбарыг харьцуулна: a < b бол сөрөг, тэнцүү бол 0
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff) return diff;
  }
  return 0;
}

// Агентын хувилбар (мессеж бүрийн version) байршуулсан хамгийн сүүлийнхээс хуучин эсэх
export function isAgentOutdated(agentVersion: string, release: AgentRelease | null): boolean {
  return !!release && !!agentVersion && compareVersions(agentVersion, release.version) < 0;
}

export interface AgentMessage {
  eventType: string;
  payload: unknown; // Event бүрээр string эсвэл object (гарын авлага 8.1)
  version: string;
  serial: string; // Төхөөрөмжгүй үед ""
}

export interface DeviceInfo {
  serial: string;
  model: string;
  vendor: string;
  width: number;
  height: number;
}

export type EnrollState =
  | { phase: 'idle' }
  | {
      phase: 'running';
      count: number;
      total: number;
      retry: string | null; // DIFFERENT_FINGER | POOR_QUALITY
      own: boolean; // Энэ цонх эхлүүлсэн эсэх (гарын авлага 8.7)
      registerNum: string | null;
    }
  | { phase: 'success'; own: boolean; registerNum: string | null };

export interface FpError {
  code: string; // NO_DEVICE, UNKNOWN_COMMAND, MERGE_FAILED, DEVICE_LOST ...
  source: 'enroll' | 'command';
  // "Дахин оролдох" дарахад: бүртгэлийг дахин эхлүүлэх эсвэл төхөөрөмжийг дахин нээх
  retry: 'enroll' | 'open';
}

export interface DeviceRegistration {
  serial: string; // Аль serial-ын хариу вэ (DEVICE_INFO-ийн serial-тай тулгана)
  registered: boolean;
  enforced: boolean; // Backend бүртгэлгүй уншигчийг татгалзаж байгаа эсэх
}

export type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved' }
  | { status: 'failed'; reason: 'network' | 'unauthorized' | 'server'; message: string | null };

export interface FpState {
  agent: 'connecting' | 'online' | 'offline';
  version: string;
  usb: 'unknown' | 'connected' | 'disconnected';
  device: DeviceInfo | null;
  serial: string; // Сүүлд мэдэгдсэн serial. DISCONNECTED үед хоосон ирдэг тул дарж бичихгүй (8.6)
  finger: 'idle' | 'placed' | 'captured';
  image: string | null; // base64 PNG
  imageSerial: string; // Зургийг уншсан уншигчийн serial (login-д илгээнэ)
  registration: DeviceRegistration | null;
  enroll: EnrollState;
  pendingEnroll: { registerNum: string } | null; // CMD_ENROLL_START илгээгээд ENROLL_STARTED хүлээж байна
  error: FpError | null;
  save: SaveState;
}

export type FpAction =
  | { type: 'socket_open' }
  | { type: 'socket_close' }
  | { type: 'message'; msg: AgentMessage }
  | { type: 'enroll_requested'; registerNum: string }
  | { type: 'cancel_requested' }
  | { type: 'dismiss' }
  | { type: 'clear_image' }
  | { type: 'device_checked'; registration: DeviceRegistration }
  | { type: 'save_start' }
  | { type: 'save_ok' }
  | { type: 'save_fail'; reason: 'network' | 'unauthorized' | 'server'; message: string | null };

// Эхний төлөв: юу ч мэдэхгүй. Бодит төлөв socket нээгдсэний дараах snapshot-оос гарна.
export const initialFpState: FpState = {
  agent: 'connecting',
  version: '',
  usb: 'unknown',
  device: null,
  serial: '',
  finger: 'idle',
  image: null,
  imageSerial: '',
  registration: null,
  enroll: { phase: 'idle' },
  pendingEnroll: null,
  error: null,
  save: { status: 'idle' },
};

const ENROLL_IDLE: EnrollState = { phase: 'idle' };
const SAVE_IDLE: SaveState = { status: 'idle' };

export function parseAgentMessage(data: unknown): AgentMessage | null {
  if (typeof data !== 'string') return null;
  try {
    const raw = JSON.parse(data);
    if (!raw || typeof raw.eventType !== 'string') return null;
    return {
      eventType: raw.eventType.toUpperCase(),
      payload: raw.payload ?? '',
      version: typeof raw.version === 'string' ? raw.version : '',
      serial: typeof raw.serial === 'string' ? raw.serial : '',
    };
  } catch {
    return null;
  }
}

function asObject(payload: unknown): Record<string, unknown> {
  if (payload && typeof payload === 'object') return payload as Record<string, unknown>;
  if (typeof payload === 'string' && payload.startsWith('{')) {
    try {
      return JSON.parse(payload);
    } catch {
      return {};
    }
  }
  return {};
}

function toNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Бүртгэл явагдаж буй гэж тооцох төлөв. STARTED ирээгүй байхад PROGRESS/RETRY ирж болно (дараалалд найдахгүй).
function runningEnroll(s: FpState) {
  if (s.enroll.phase === 'running') return s.enroll;
  return {
    phase: 'running' as const,
    count: 0,
    total: 3,
    retry: null,
    own: !!s.pendingEnroll,
    registerNum: s.pendingEnroll?.registerNum ?? null,
  };
}

// Амжилттай бүртгэлийн дэлгэцийг хадгалалт дуусаагүй эсвэл алдаатай үед орхихгүй.
function canLeaveSuccess(s: FpState) {
  return s.save.status !== 'saving' && s.save.status !== 'failed';
}

function applyEvent(prev: FpState, msg: AgentMessage): FpState {
  const s: FpState = {
    ...prev,
    agent: 'online',
    version: msg.version || prev.version,
    serial: msg.serial || prev.serial,
  };
  const payload = msg.payload;

  switch (msg.eventType) {
    case 'CONNECTED':
      return s;

    case 'USB_STATUS':
      if (payload === 'CONNECTED') return { ...s, usb: 'connected' };
      if (payload === 'DISCONNECTED') {
        return {
          ...s,
          usb: 'disconnected',
          device: null,
          finger: 'idle',
          image: null,
          enroll: s.enroll.phase === 'running' ? ENROLL_IDLE : s.enroll,
          pendingEnroll: null,
        };
      }
      return s;

    case 'DEVICE_INFO': {
      const info = asObject(payload);
      const device: DeviceInfo = {
        serial: String(info.serial ?? ''),
        model: String(info.model ?? ''),
        vendor: String(info.vendor ?? ''),
        width: toNumber(info.width, 0),
        height: toNumber(info.height, 0),
      };
      return { ...s, usb: 'connected', device, serial: device.serial || s.serial };
    }

    case 'FINGER_PLACED': {
      let enroll = s.enroll;
      if (enroll.phase === 'running') enroll = { ...enroll, retry: null };
      else if (enroll.phase === 'success' && canLeaveSuccess(s)) enroll = ENROLL_IDLE;
      return { ...s, finger: 'placed', error: null, enroll };
    }

    case 'FINGER_IMAGE':
      if (typeof payload !== 'string' || !payload) return s;
      return { ...s, finger: 'captured', image: payload, imageSerial: msg.serial || s.serial };

    case 'FINGER_REMOVED':
      // Зургийг үлдээнэ (5-р хэсэг, төлөв 6)
      return { ...s, finger: 'idle' };

    case 'ENROLL_STARTED': {
      const total = toNumber(asObject(payload).total, 3);
      // Snapshot дахин ирэхэд явж буй бүртгэлийн count, эзэмшлийг алдагдуулахгүй
      if (s.enroll.phase === 'running') return { ...s, enroll: { ...s.enroll, total } };
      // Шинэ бүртгэлд өмнөх уншилтын зургийг харуулахгүй
      return {
        ...s,
        image: null,
        enroll: { ...runningEnroll(s), total },
        pendingEnroll: null,
        error: null,
        save: SAVE_IDLE,
      };
    }

    case 'ENROLL_PROGRESS': {
      const p = asObject(payload);
      const base = runningEnroll(s);
      return {
        ...s,
        enroll: {
          ...base,
          count: toNumber(p.count, base.count),
          total: toNumber(p.total, base.total),
          retry: null,
        },
        pendingEnroll: null,
        error: null,
      };
    }

    case 'ENROLL_RETRY': {
      const p = asObject(payload);
      const base = runningEnroll(s);
      return {
        ...s,
        enroll: {
          ...base,
          count: toNumber(p.count, base.count),
          total: toNumber(p.total, base.total),
          retry: String(p.reason || 'POOR_QUALITY'),
        },
        pendingEnroll: null,
        error: null,
      };
    }

    case 'ENROLL_SUCCESS': {
      const base = runningEnroll(s);
      return {
        ...s,
        enroll: { phase: 'success', own: base.own, registerNum: base.registerNum },
        pendingEnroll: null,
        error: null,
        save: SAVE_IDLE,
      };
    }

    case 'ENROLL_FAILED': {
      const code = String(asObject(payload).reason || 'UNKNOWN');
      return {
        ...s,
        enroll: ENROLL_IDLE,
        pendingEnroll: null,
        error: { code, source: 'enroll', retry: code === 'NO_DEVICE' ? 'open' : 'enroll' },
      };
    }

    case 'ENROLL_CANCELLED':
      return {
        ...s,
        enroll: s.enroll.phase === 'running' ? ENROLL_IDLE : s.enroll,
        pendingEnroll: null,
      };

    case 'ERROR': {
      const p = asObject(payload);
      const code = String(p.code || 'UNKNOWN');
      const isEnrollCommand = String(p.command || '').toUpperCase() === 'CMD_ENROLL_START';
      return {
        ...s,
        pendingEnroll: isEnrollCommand ? null : s.pendingEnroll,
        error: {
          code,
          source: 'command',
          retry: isEnrollCommand && code !== 'NO_DEVICE' ? 'enroll' : 'open',
        },
      };
    }

    default:
      return s;
  }
}

export function fingerprintReducer(s: FpState, action: FpAction): FpState {
  switch (action.type) {
    case 'socket_open':
    case 'socket_close':
      // Агенттай холбоо шинэчлэгдэхэд төхөөрөмжийн мэдээлэл хуучирна. Нээгдвэл snapshot дахин ирнэ.
      // Амжилттай бүртгэлийг (хадгалалтын үр дүнтэй нь) үлдээнэ — хадгалалт агентаас хамаарахгүй.
      return {
        ...s,
        agent: action.type === 'socket_open' ? 'online' : 'offline',
        usb: 'unknown',
        device: null,
        finger: 'idle',
        image: null,
        enroll: s.enroll.phase === 'success' ? s.enroll : ENROLL_IDLE,
        pendingEnroll: null,
        error: null,
      };

    case 'message':
      return applyEvent(s, action.msg);

    case 'enroll_requested':
      return {
        ...s,
        pendingEnroll: { registerNum: action.registerNum },
        enroll: s.enroll.phase === 'running' ? s.enroll : ENROLL_IDLE,
        error: null,
        save: SAVE_IDLE,
      };

    case 'cancel_requested':
      // Бүртгэл явж байвал ENROLL_CANCELLED event-ээр л төлөв солигдоно
      return { ...s, pendingEnroll: null };

    case 'dismiss':
      return {
        ...s,
        error: null,
        enroll: s.enroll.phase === 'success' && canLeaveSuccess(s) ? ENROLL_IDLE : s.enroll,
        save: s.enroll.phase === 'success' && canLeaveSuccess(s) ? SAVE_IDLE : s.save,
      };

    case 'clear_image':
      return { ...s, image: null, finger: s.finger === 'captured' ? 'idle' : s.finger };

    case 'device_checked':
      return { ...s, registration: action.registration };

    case 'save_start':
      return { ...s, save: { status: 'saving' } };
    case 'save_ok':
      return { ...s, save: { status: 'saved' } };
    case 'save_fail':
      return { ...s, save: { status: 'failed', reason: action.reason, message: action.message } };

    default:
      return s;
  }
}

// Гарын авлагын 5-р хэсгийн UX төлвүүд. Дэлгэц нэг л төлөв харуулна.
export type FpStatus =
  | 'CONNECTING' // Агент эсвэл snapshot хүлээж байна
  | 'AGENT_OFFLINE' // 1
  | 'NO_DEVICE' // 2
  | 'PREPARING' // USB залгагдсан, DEVICE_INFO хүлээж байна
  | 'UNREGISTERED_DEVICE' // Backend шалгалт идэвхтэй, энэ уншигч бүртгэлгүй
  | 'READY' // 3, 6 (хуруу авсны дараа)
  | 'READING' // 4
  | 'CAPTURED' // 5
  | 'ENROLLING' // 7
  | 'ENROLL_RETRY' // 8
  | 'ENROLL_SUCCESS' // 9
  | 'ERROR'; // 10

export function deriveStatus(s: FpState): FpStatus {
  if (s.agent === 'offline') return 'AGENT_OFFLINE';
  if (s.agent === 'connecting' || s.usb === 'unknown') return 'CONNECTING';
  if (s.usb === 'disconnected') return 'NO_DEVICE';
  if (s.enroll.phase === 'success') return 'ENROLL_SUCCESS';
  if (s.error) return 'ERROR';
  if (s.enroll.phase === 'running') return s.enroll.retry ? 'ENROLL_RETRY' : 'ENROLLING';
  if (s.pendingEnroll) return 'ENROLLING';
  if (!s.device) return 'PREPARING';
  if (isUnregisteredDevice(s)) return 'UNREGISTERED_DEVICE';
  if (s.finger === 'placed') return 'READING';
  if (s.finger === 'captured') return 'CAPTURED';
  return 'READY';
}

// Backend шалгалт идэвхгүй эсвэл хариу ирээгүй бол хаахгүй — эцсийн шийдвэрийг login гаргана
function isUnregisteredDevice(s: FpState): boolean {
  const r = s.registration;
  return !!r && !!s.device && r.serial === s.device.serial && r.enforced && !r.registered;
}

// Нэвтрэхэд ашиглаж болох зураг: уншилт дууссан, бүртгэл явагдаагүй үед л
export function usableImage(s: FpState, status: FpStatus): string | null {
  return status === 'READY' || status === 'CAPTURED' || status === 'ENROLL_SUCCESS' ? s.image : null;
}

// Бүртгэл эхлүүлэх боломжтой эсэх: төхөөрөмж бэлэн, өөр бүртгэл явагдаагүй (8.7)
export function canStartEnroll(status: FpStatus): boolean {
  return status === 'READY' || status === 'CAPTURED';
}
