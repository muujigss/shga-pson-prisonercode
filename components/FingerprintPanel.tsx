'use client';

import type { ReactNode } from 'react';
import { Button, Spin } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DisconnectOutlined,
  DownloadOutlined,
  UsbOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useTranslation } from '@/context/LanguageContext';
import type { FingerprintController } from '@/lib/useFingerprint';
import { API_URL } from '@/lib/api';
import { AgentRelease, FINGER_AGENT_DOWNLOAD_PATH, isAgentOutdated } from '@/lib/fingerprint';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'error';

function FingerprintIcon() {
  return (
    <svg
      className="fp-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 8.5A8.5 8.5 0 0 1 12 3.5a8.5 8.5 0 0 1 7.2 4" />
      <path d="M6.5 18.5C5.6 16.6 5 14.5 5 12a7 7 0 0 1 14 0v1" />
      <path d="M9 20c-.7-1.5-1.5-3.5-1.5-7a4.5 4.5 0 0 1 9 0c0 2.8-.2 4.8-.8 6.8" />
      <path d="M12 13c0 3 .5 5.3 1.3 7.3" />
      <path d="M19 16.5c-.2 1.3-.5 2.4-.9 3.4" />
    </svg>
  );
}

interface Props {
  fp: FingerprintController;
  release?: AgentRelease | null; // Backend дээрх хамгийн сүүлийн програмын хувилбар
}

export default function FingerprintPanel({ fp, release = null }: Props) {
  const { t } = useTranslation();
  const { state, status } = fp;
  const image = state.image ? (
    <img src={`data:image/png;base64,${state.image}`} alt={t('fingerprint.captured')} />
  ) : null;

  const errorText = (code: string) => {
    const key = `fingerprintError.${code}`;
    const text = t(key);
    return text === key ? code : text;
  };

  let tone: Tone = 'neutral';
  let visual: ReactNode = <FingerprintIcon />;
  let title = '';
  let hint: ReactNode = null;
  let actions: ReactNode = null;
  let progress: { count: number; total: number } | null = null;

  switch (status) {
    case 'CONNECTING':
      visual = <Spin />;
      title = t('fingerprint.connecting');
      break;

    case 'AGENT_OFFLINE':
      tone = 'warning';
      visual = <DisconnectOutlined />;
      title = t('fingerprint.agentOffline');
      hint = t('fingerprint.agentOfflineHint');
      actions = (
        <Button size="small" onClick={fp.reconnect}>
          {t('fingerprint.reconnectNow')}
        </Button>
      );
      break;

    case 'NO_DEVICE':
      tone = 'warning';
      visual = <UsbOutlined />;
      title = t('fingerprint.noDevice');
      hint = t('fingerprint.noDeviceHint');
      actions = (
        <Button size="small" onClick={fp.openDevice}>
          {t('fingerprint.checkDevice')}
        </Button>
      );
      break;

    case 'PREPARING':
      visual = <Spin />;
      title = t('fingerprint.preparing');
      actions = (
        <Button size="small" onClick={fp.openDevice}>
          {t('fingerprint.checkDevice')}
        </Button>
      );
      break;

    case 'UNREGISTERED_DEVICE':
      tone = 'warning';
      visual = <WarningOutlined />;
      title = t('fingerprint.unregistered');
      hint = (
        <>
          {t('fingerprint.unregisteredHint')}
          <br />
          <span className="fp-serial">Serial: {state.device?.serial}</span>
        </>
      );
      actions = (
        <Button size="small" onClick={fp.recheckDevice}>
          {t('fingerprint.checkDevice')}
        </Button>
      );
      break;

    case 'READY':
      tone = 'primary';
      visual = image ?? <FingerprintIcon />;
      title = image ? t('fingerprint.readyAgain') : t('fingerprint.ready');
      break;

    case 'READING':
      tone = 'primary';
      visual = (
        <>
          {image}
          <div className="fp-visual-overlay">
            <Spin />
          </div>
        </>
      );
      title = t('fingerprint.reading');
      break;

    case 'CAPTURED':
      tone = 'success';
      visual = image;
      title = t('fingerprint.captured');
      hint = t('fingerprint.capturedHint');
      break;

    case 'ENROLLING':
    case 'ENROLL_RETRY': {
      const enroll = state.enroll.phase === 'running' ? state.enroll : null;
      progress = { count: enroll?.count ?? 0, total: enroll?.total ?? 3 };
      const reading = state.finger === 'placed';
      visual = (
        <>
          {image ?? <FingerprintIcon />}
          {(reading || !enroll) && (
            <div className="fp-visual-overlay">
              <Spin />
            </div>
          )}
        </>
      );
      if (status === 'ENROLL_RETRY') {
        tone = 'warning';
        title =
          enroll?.retry === 'DIFFERENT_FINGER'
            ? t('fingerprint.retryDifferentFinger')
            : enroll?.retry === 'POOR_QUALITY'
              ? t('fingerprint.retryPoorQuality')
              : t('fingerprint.retryOther');
      } else {
        tone = 'primary';
        title = !enroll
          ? t('fingerprint.enrollStarting')
          : reading
            ? t('fingerprint.reading')
            : progress.count > 0
              ? t('fingerprint.enrollPlaceAgain')
              : t('fingerprint.enrollPlace');
      }
      hint = (
        <>
          {t('fingerprint.enrollTitle')} {progress.count}/{progress.total}
          {enroll && !enroll.own && (
            <>
              <br />
              {t('fingerprint.enrollForeign')}
            </>
          )}
        </>
      );
      actions = (
        <Button size="small" onClick={fp.cancelEnroll}>
          {t('fingerprint.cancel')}
        </Button>
      );
      break;
    }

    case 'ENROLL_SUCCESS': {
      const own = state.enroll.phase === 'success' && state.enroll.own;
      const save = state.save;
      tone = 'success';
      visual = <CheckCircleFilled />;
      title = t('fingerprint.success');
      if (!own) {
        hint = t('fingerprint.successForeign');
      } else if (save.status === 'saving') {
        hint = (
          <>
            <Spin size="small" /> {t('fingerprint.saving')}
          </>
        );
      } else if (save.status === 'saved') {
        hint = t('fingerprint.saved');
      } else if (save.status === 'failed') {
        const reasonText =
          save.reason === 'network'
            ? t('fingerprint.saveNetworkError')
            : save.reason === 'unauthorized'
              ? t('fingerprint.saveUnauthorized')
              : save.message;
        hint = (
          <span className="fp-hint-error">
            {t('fingerprint.saveFailed')}
            {reasonText ? `: ${reasonText}` : ''}
          </span>
        );
      }
      if (own && save.status === 'failed') {
        actions = (
          <>
            <Button size="small" type="primary" onClick={fp.retrySave}>
              {t('fingerprint.resend')}
            </Button>
            <Button size="small" onClick={fp.dismiss}>
              {t('fingerprint.close')}
            </Button>
          </>
        );
      } else if (!own || save.status === 'saved') {
        actions = (
          <Button size="small" onClick={fp.dismiss}>
            {t('fingerprint.done')}
          </Button>
        );
      }
      break;
    }

    case 'ERROR': {
      const error = state.error;
      tone = 'error';
      visual = <CloseCircleFilled />;
      title = error?.source === 'enroll' ? t('fingerprint.enrollFailed') : t('fingerprint.errorTitle');
      hint = error ? errorText(error.code) : null;
      actions = (
        <>
          <Button size="small" type="primary" danger onClick={() => fp.retry('')}>
            {t('fingerprint.retry')}
          </Button>
          <Button size="small" onClick={fp.dismiss}>
            {t('fingerprint.close')}
          </Button>
        </>
      );
      break;
    }
  }

  return (
    <div className="fp-panel">
      <div className={`fp-visual fp-tone-${tone}`}>{visual}</div>
      <div className="fp-status" role="status" aria-live="polite">
        <div className={`fp-title fp-title-${tone}`}>{title}</div>
        {hint && <div className="fp-hint">{hint}</div>}
      </div>
      {progress && (
        <div
          className="fp-dots"
          aria-label={`${t('fingerprint.enrollTitle')} ${progress.count}/${progress.total}`}
        >
          {Array.from({ length: progress.total }, (_, i) => (
            <span key={i} className={i < progress.count ? 'fp-dot is-done' : 'fp-dot'} />
          ))}
        </div>
      )}
      {actions && <div className="fp-actions">{actions}</div>}
      {state.agent === 'online' && release && isAgentOutdated(state.version, release) && (
        <div className="fp-update" role="note">
          <div className="fp-update-title">{t('fingerprint.updateTitle')}</div>
          <div className="fp-update-versions">
            {t('fingerprint.updateCurrent')}: {state.version} · {t('fingerprint.updateLatest')}: {release.version}
          </div>
          <Button size="small" icon={<DownloadOutlined />} href={`${API_URL}${FINGER_AGENT_DOWNLOAD_PATH}`}>
            {t('fingerprint.updateDownload')}
          </Button>
        </div>
      )}
    </div>
  );
}
