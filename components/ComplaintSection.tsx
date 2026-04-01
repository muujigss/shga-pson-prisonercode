'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileTextOutlined } from '@ant-design/icons';

export default function ComplaintSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <div className="empty-state">Өгөгдөл байхгүй</div>;
  }

  return (
    <div>
      <div className="section-title">
        <FileTextOutlined className="section-title-icon" />
        <span>Гомдол</span>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>№</th>
              <th>Гомдлын бүлэг</th>
              <th>Гомдлын төрөл</th>
              <th>Байгууллага</th>
              <th>Гомдлын огноо</th>
              <th>Төлөв</th>
              <th>Хариу өгсөн</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr key={row.PRISONER_COMPLAINT_ID || i}>
                <td>{i + 1}</td>
                <td>{row.COMPLAINT_GROUP_NAME || '—'}</td>
                <td>{row.COMPLAINT_TYPE_NAME || '—'}</td>
                <td>{row.ORGANIZATION || '—'}</td>
                <td>{row.COMPLAINT_DATE || '—'}</td>
                <td>
                  <span className={`status-badge ${
                    row.WFM_STATUS_NAME?.includes('шийд') ? 'completed' :
                    row.WFM_STATUS_NAME?.includes('хүлээ') ? 'pending' : 'active'
                  }`}>
                    {row.WFM_STATUS_NAME || '—'}
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
