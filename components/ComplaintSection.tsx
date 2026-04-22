'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';
import { FileTextOutlined } from '@ant-design/icons';

export default function ComplaintSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, tDynamic } = useTranslation();

  useEffect(() => {
    api('/prisoner-code-auth/complaints')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!data || data.length === 0) {
    return <div className="empty-state">{t('complaint.noData')}</div>;
  }

  return (
    <div>
      <div className="section-title">
        <FileTextOutlined className="section-title-icon" />
        <span>{t('complaint.title')}</span>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>{t('complaint.index')}</th>
              <th>{t('complaint.group')}</th>
              <th>{t('complaint.type')}</th>
              <th>{t('complaint.organization')}</th>
              <th>{t('complaint.date')}</th>
              <th>{t('complaint.status')}</th>
              <th>{t('complaint.responseDate')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={row.PRISONER_COMPLAINT_ID || i}>
                <td>{i + 1}</td>
                <td>{row.COMPLAINT_GROUP_NAME ? tDynamic('complaintGroup', row.COMPLAINT_GROUP_NAME, row.COMPLAINT_GROUP_NAME) : '—'}</td>
                <td>{row.COMPLAINT_TYPE_NAME ? tDynamic('complaintType', row.COMPLAINT_TYPE_NAME, row.COMPLAINT_TYPE_NAME) : '—'}</td>
                <td>{row.ORGANIZATION || '—'}</td>
                <td>{row.COMPLAINT_DATE || '—'}</td>
                <td>
                  <span className={`status-badge ${
                    row.WFM_STATUS_NAME?.includes('шийд') ? 'completed' :
                    row.WFM_STATUS_NAME?.includes('хүлээ') ? 'pending' : 'active'
                  }`}>
                    {row.WFM_STATUS_NAME ? tDynamic('status', row.WFM_STATUS_NAME, row.WFM_STATUS_NAME) : '—'}
                  </span>
                </td>
                <td>{row.RESPONSE_DATE || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
