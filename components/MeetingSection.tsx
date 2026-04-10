'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function MeetingSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="empty-state">Өгөгдөл байхгүй</div>;
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Эхэлсэн огноо</th>
            <th>Дуусан огноо</th>
            <th>Уулзсан хүмүүс</th>
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
  );
}
