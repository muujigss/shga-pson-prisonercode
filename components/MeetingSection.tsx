'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AuditOutlined } from '@ant-design/icons';

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
    <div>
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

      <div className="legal-section" style={{ marginTop: 16 }}>
        <div className="legal-header">
          <AuditOutlined className="legal-icon" />
          <div>
            <h3>Уулзалт, холбоо барих эрхийн хуулийн зохицуулалт</h3>
          </div>
        </div>

        <div className="legal-content">
          <strong>Зүйл 198.3 Нээлттэй хорих анги - Энгийн зэрэглэл</strong>
          <br /><br />
          Нээлттэй хорих ангийн энгийн зэрэглэлд ял эдэлж байгаа хоригдол 30 хоногт нэг удаа удаан хугацааны уулзалт хийж болох бөгөөд түр хугацааны уулзалт хийх, захидал илгээх, илгээмж авах, утсаар ярих тоог хязгаарлахгүй.
          <br /><br />
          <strong>Зүйл 198.4 Нээлттэй хорих анги - Тусгай зэрэглэл</strong>
          <br /><br />
          Нээлттэй хорих ангийн тусгай зэрэглэлд ял эдэлж байгаа хоригдол 7 хоногт нэг удаа түр, 45 хоногт нэг удаа удаан хугацааны уулзалт хийж, 7 хоногт нэг удаа илгээмж авч, нэг удаа утсаар ярьж болох бөгөөд захидал илгээх тоог хязгаарлахгүй.
          <br /><br />
          <strong>Зүйл 199.4 Хаалттай хорих анги - Энгийн зэрэглэл</strong>
          <br /><br />
          Хаалттай хорих ангийн энгийн зэрэглэлд ял эдэлж байгаа хоригдол нь 60 хоногт нэг удаа түр, 90 хоногт нэг удаа удаан хугацааны уулзалт хийж, 30 хоногт нэг удаа илгээмж авч, нэг удаа утсаар ярьж болно.
        </div>
      </div>
    </div>
  );
}

