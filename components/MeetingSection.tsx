'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TeamOutlined, ClockCircleOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';

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
      <div className="section-title">
        <TeamOutlined className="section-title-icon" />
        <span>Эргэлт уулзалт (сүүлийн)</span>
      </div>

      <div className="content-card">
        <div className="info-cards-grid">
          <div className="info-card">
            <div className="info-card-icon blue"><ClockCircleOutlined /></div>
            <div className="info-card-label">Эхэлсэн огноо</div>
            <div className="info-card-value">{data.MEETING_BEGIN_DATE || '—'}</div>
          </div>

          <div className="info-card">
            <div className="info-card-icon green"><ClockCircleOutlined /></div>
            <div className="info-card-label">Дуусан огноо</div>
            <div className="info-card-value">{data.MEETING_END_DATE || '—'}</div>
          </div>

          <div className="info-card">
            <div className="info-card-icon orange"><UserOutlined /></div>
            <div className="info-card-label">Зөвшөөрсөн албан хаагч</div>
            <div className="info-card-value">{data.EMPLOYEE_NAME || '—'}</div>
          </div>
        </div>

        {data.PARTICIPANTS && (
          <div style={{ marginTop: 20 }}>
            <div className="health-label">Уулзсан хүмүүс</div>
            <div className="health-value">{data.PARTICIPANTS}</div>
          </div>
        )}

        {data.DESCRIPTION && (
          <div style={{ marginTop: 16 }}>
            <div className="health-label">Тэмдэглэл</div>
            <div className="health-value">{data.DESCRIPTION}</div>
          </div>
        )}

        <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          Бүртгэсэн: {data.CREATED_DATE || '—'}
        </div>
      </div>

      {/* Meeting rights legal text */}
      <div className="legal-section" style={{ marginTop: 16 }}>
        <div className="legal-header">
          <FileTextOutlined className="legal-icon" />
          <div>
            <h3>Уулзалт, холбоо барих эрхийн хуулийн зохицуулалт</h3>
          </div>
        </div>
        <div className="legal-content">
          <strong>Зүйл 198.3 Нээлттэй хорих анги - Энгийн зэрэглэл</strong>
          <br />
          Нээлттэй хорих ангийн энгийн зэрэглэлд ял эдэлж байгаа хоригдол 30 хоногт нэг удаа удаан хугацааны уулзалт хийж болох бөгөөд түр хугацааны уулзалт хийх, захидал илгээх, илгээмж авах, утсаар ярих тоог хязгаарлахгүй.
          <br /><br />
          <strong>Зүйл 198.4 Нээлттэй хорих анги - Тусгай зэрэглэл</strong>
          <br />
          Нээлттэй хорих ангийн тусгай зэрэглэлд ял эдэлж байгаа хоригдол 7 хоногт нэг удаа түр, 45 хоногт нэг удаа удаан хугацааны уулзалт хийж, 7 хоногт нэг удаа илгээмж авч, нэг удаа утсаар ярьж болох бөгөөд захидал илгээх тоог хязгаарлахгүй.
          <br /><br />
          <strong>Зүйл 199.4 Хаалттай хорих анги - Энгийн зэрэглэл</strong>
          <br />
          Хаалттай хорих ангийн энгийн зэрэглэлд ял эдэлж байгаа хоригдол нь 60 хоногт нэг удаа түр, 90 хоногт нэг удаа удаан хугацааны уулзалт хийж, 30 хоногт нэг удаа илгээмж авч, нэг удаа утсаар ярьж болно.
        </div>
      </div>
    </div>
  );
}
