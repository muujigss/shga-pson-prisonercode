'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function OffenceSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="empty-state">Өгөгдөл байхгүй</div>;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 60 }}>№</th>
            <th>Зөрчил гаргасан огноо</th>
            <th>Зөрчлийн төрөл</th>
            <th>Арга хэмжээний төрөл</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i}>
              <td>{row.ROW_NUM || i + 1}</td>
              <td>{row.OFFENCE_DATE || '—'}</td>
              <td>{row.OFFENCE_TYPE_NAME || '—'}</td>
              <td>{row.OFFENCE_ACTION_TYPE_NAME || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
