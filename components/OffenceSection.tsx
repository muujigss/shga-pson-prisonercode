'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';

export default function OffenceSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, tDynamic } = useTranslation();

  useEffect(() => {
    api('/prisoner-code-auth/offences')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!data || data.length === 0) {
    return <div className="empty-state">{t('offence.noData')}</div>;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 60 }}>{t('offence.index')}</th>
            <th>{t('offence.date')}</th>
            <th>{t('offence.type')}</th>
            <th>{t('offence.action')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i}>
              <td>{row.ROW_NUM || i + 1}</td>
              <td>{row.OFFENCE_DATE || '—'}</td>
              <td>{row.OFFENCE_TYPE_NAME ? tDynamic('offenceType', row.OFFENCE_TYPE_NAME, row.OFFENCE_TYPE_NAME) : '—'}</td>
              <td>{row.OFFENCE_ACTION_TYPE_NAME ? tDynamic('offenceActionType', row.OFFENCE_ACTION_TYPE_NAME, row.OFFENCE_ACTION_TYPE_NAME) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
