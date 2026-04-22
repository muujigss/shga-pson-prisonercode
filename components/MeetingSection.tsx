'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';
import { AuditOutlined } from '@ant-design/icons';

export default function MeetingSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    api('/prisoner-code-auth/meetings')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!data) {
    return <div className="empty-state">{t('meeting.noData')}</div>;
  }

  return (
    <div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('meeting.startDate')}</th>
              <th>{t('meeting.endDate')}</th>
              <th>{t('meeting.participants')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.MEETING_BEGIN_DATE || '—'}</td>
              <td>{data.MEETING_END_DATE || '—'}</td>
              <td>{data.PARTICIPANTS || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="legal-section" style={{ marginTop: 16 }}>
        <div className="legal-header">
          <AuditOutlined className="legal-icon" />
          <div>
            <h3>{t('meeting.legalTitle')}</h3>
          </div>
        </div>

        <div className="legal-content">
          <strong>{t('meeting.article198_3_title')}</strong>
          <br /><br />
          {t('meeting.article198_3_text')}
          <br /><br />
          <strong>{t('meeting.article198_4_title')}</strong>
          <br /><br />
          {t('meeting.article198_4_text')}
          <br /><br />
          <strong>{t('meeting.article199_4_title')}</strong>
          <br /><br />
          {t('meeting.article199_4_text')}
        </div>
      </div>
    </div>
  );
}

