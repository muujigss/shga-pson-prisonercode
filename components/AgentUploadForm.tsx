'use client';

import { useState } from 'react';
import { Button, Input } from 'antd';
import { CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { sha256 } from '@noble/hashes/sha2.js';
import { hmac } from '@noble/hashes/hmac.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';
import { useTranslation } from '@/context/LanguageContext';
import { API_URL } from '@/lib/api';
import {
  FINGER_AGENT_DOWNLOAD_PATH,
  FINGER_AGENT_UPLOAD_PATH,
  compareVersions,
} from '@/lib/fingerprint';
import { useAgentRelease } from '@/lib/useAgentRelease';

const VERSION_PATTERN = /^\d{1,5}(\.\d{1,5}){1,3}$/;

// WebCrypto биш: хөтөч түүнийг HTTP (дотоод сүлжээний IP) дээр хаадаг.
// Нууц үг сүлжээгээр дамжихгүй — зөвхөн HMAC гарын үсэг илгээгдэнэ.
async function sha256Hex(file: File) {
  return bytesToHex(sha256(new Uint8Array(await file.arrayBuffer())));
}

// Backend-тэй ижил: hex(HMAC-SHA256(secret, `${timestamp}.upload.${version}.${sha256}`))
function signUpload(secret: string, timestamp: string, version: string, fileSha256: string) {
  return bytesToHex(hmac(sha256, utf8ToBytes(secret), utf8ToBytes(`${timestamp}.upload.${version}.${fileSha256}`)));
}

export default function AgentUploadForm() {
  const { t } = useTranslation();
  const { release, refresh } = useAgentRelease();
  const [version, setVersion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileSha, setFileSha] = useState('');
  const [secret, setSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const trimmedVersion = version.trim();
  const notNewer =
    !!release && VERSION_PATTERN.test(trimmedVersion) && compareVersions(trimmedVersion, release.version) <= 0;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    setFile(next);
    setFileSha('');
    setResult(null);
    if (next) setFileSha(await sha256Hex(next));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (!VERSION_PATTERN.test(trimmedVersion)) return setResult({ ok: false, text: t('agentUpload.errVersion') });
    if (!file) return setResult({ ok: false, text: t('agentUpload.errFile') });
    if (!secret) return setResult({ ok: false, text: t('agentUpload.errSecret') });

    setBusy(true);
    try {
      const fileSha256 = fileSha || (await sha256Hex(file));
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = signUpload(secret, timestamp, trimmedVersion, fileSha256);
      const form = new FormData();
      form.append('version', trimmedVersion);
      form.append('file', file, file.name);
      const res = await fetch(`${API_URL}${FINGER_AGENT_UPLOAD_PATH}`, {
        method: 'POST',
        headers: { 'X-Timestamp': timestamp, 'X-Signature': signature },
        body: form,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || t('agentUpload.errUpload'));
      setResult({ ok: true, text: data?.alreadyUploaded ? t('agentUpload.already') : t('agentUpload.success') });
      setSecret('');
      refresh();
    } catch (err) {
      const text = err instanceof TypeError ? t('agentUpload.errNetwork') : (err as Error).message;
      setResult({ ok: false, text });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card agent-upload-card" onSubmit={onSubmit}>
        <div className="login-icon">
          <CloudUploadOutlined />
        </div>
        <h2 className="login-title">{t('agentUpload.title')}</h2>
        <p className="login-subtitle">{t('agentUpload.subtitle')}</p>

        <section className="au-current">
          <div className="au-label">{t('agentUpload.current')}</div>
          {release ? (
            <>
              <div className="au-version">{release.version}</div>
              <dl className="au-meta">
                <dt>{t('agentUpload.uploadedAt')}</dt>
                <dd>{new Date(release.createdDate).toLocaleString('mn-MN')}</dd>
                <dt>{t('agentUpload.size')}</dt>
                <dd>{(release.fileSize / 1024 / 1024).toFixed(1)} MB</dd>
                <dt>SHA-256</dt>
                <dd className="au-hash">{release.sha256}</dd>
              </dl>
              <Button size="small" icon={<DownloadOutlined />} href={`${API_URL}${FINGER_AGENT_DOWNLOAD_PATH}`}>
                {t('agentUpload.download')}
              </Button>
            </>
          ) : (
            <div className="au-empty">{t('agentUpload.none')}</div>
          )}
        </section>

        <label className="au-field" htmlFor="au-version">
          <span className="au-label">{t('agentUpload.version')}</span>
          <Input
            id="au-version"
            size="large"
            value={version}
            placeholder={t('agentUpload.versionPlaceholder')}
            onChange={(e) => setVersion(e.target.value)}
            autoComplete="off"
          />
          <span className={notNewer ? 'au-hint au-hint-warn' : 'au-hint'}>
            {notNewer ? t('agentUpload.notNewer') : t('agentUpload.versionHint')}
          </span>
        </label>

        <label className="au-field" htmlFor="au-file">
          <span className="au-label">{t('agentUpload.file')}</span>
          <input id="au-file" className="au-file" type="file" accept=".zip,application/zip" onChange={onFileChange} />
          {fileSha && <span className="au-hint au-hash">SHA-256: {fileSha}</span>}
        </label>

        <label className="au-field" htmlFor="au-secret">
          <span className="au-label">{t('agentUpload.secret')}</span>
          <Input.Password
            id="au-secret"
            size="large"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoComplete="off"
          />
        </label>

        {result && (
          <div className={result.ok ? 'au-result au-result-ok' : 'login-error'} role="status">
            {result.text}
          </div>
        )}

        <button type="submit" className="login-btn" disabled={busy}>
          {busy ? t('agentUpload.submitting') : t('agentUpload.submit')}
        </button>
      </form>
    </div>
  );
}
