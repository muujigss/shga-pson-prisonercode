'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { HeartOutlined, MedicineBoxOutlined, AlertOutlined, ExperimentOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

export default function HealthSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/prisoner-code-auth/health')
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

  const items = [
    {
      icon: <MedicineBoxOutlined />,
      label: 'Архаг хууч өвчин байгаа эсэх',
      desc: data.CHRONIC_DISEASE_DESC,
      color: 'red',
    },
    {
      icon: <AlertOutlined />,
      label: 'Ял эдлэж эхэлснээс хойш өвчин байгаа эсэх',
      desc: data.ILLNESS_AFTER_JAIL_DESC,
      color: 'orange',
    },
    {
      icon: <ExperimentOutlined />,
      label: 'Байнга хэрэглэдэг эм байгаа эсэх',
      desc: data.MEDICINES_USE_REGULAR_DESC,
      color: 'blue',
    },
    {
      icon: <SafetyCertificateOutlined />,
      label: 'Харшилтай эсэх',
      desc: data.ALLERGY_DESC,
      color: 'purple',
    },
    {
      icon: <HeartOutlined />,
      label: 'Гадны эмнэлэгт үзүүлэх хүсэлтэй эсэх',
      desc: data.EXTERNAL_HOSPITAL_AID_DESC,
      color: 'green',
    },
  ];

  return (
    <div>
      <div className="section-title">
        <HeartOutlined className="section-title-icon" />
        <span>Эрүүл мэнд</span>
      </div>

      {items.map((item, i) => (
        <div
          className="content-card"
          key={i}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className={`info-card-icon ${item.color}`}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div className="health-label">{item.label}</div>
            </div>
          </div>
          {item.desc && (
            <div className="health-value" style={{ marginTop: 12, paddingLeft: 48 }}>
              {item.desc}
            </div>
          )}
        </div>
      ))}

      {data.CREATED_EMPLOYEE_NAME && (
        <div style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          Бүртгэсэн: {data.CREATED_EMPLOYEE_NAME} | {data.CREATED_DATE}
        </div>
      )}
    </div>
  );
}
