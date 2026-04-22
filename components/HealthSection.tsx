'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';
import { HeartOutlined, MedicineBoxOutlined, AlertOutlined, ExperimentOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

export default function HealthSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { t, tDynamic } = useTranslation();

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
    return <div className="empty-state">{t('health.noData')}</div>;
  }

  const formatDesc = (desc: string) => {
    if (!desc) return desc;
    const translatedNo = tDynamic('yesNo', 'Үгүй', 'Үгүй');
    const translatedYes = tDynamic('yesNo', 'Тийм', 'Тийм');
    
    return desc.replace(/^үгүй/i, translatedNo).replace(/^тийм/i, translatedYes);
  };

  const items = [
    {
      icon: <MedicineBoxOutlined />,
      label: t('health.chronicDisease'),
      desc: formatDesc(data.CHRONIC_DISEASE_DESC),
      color: 'red',
    },
    {
      icon: <AlertOutlined />,
      label: t('health.illnessAfterJail'),
      desc: formatDesc(data.ILLNESS_AFTER_JAIL_DESC),
      color: 'orange',
    },
    {
      icon: <ExperimentOutlined />,
      label: t('health.medicinesUseRegular'),
      desc: formatDesc(data.MEDICINES_USE_REGULAR_DESC),
      color: 'blue',
    },
    {
      icon: <SafetyCertificateOutlined />,
      label: t('health.allergy'),
      desc: formatDesc(data.ALLERGY_DESC),
      color: 'purple',
    },
    {
      icon: <HeartOutlined />,
      label: t('health.externalHospitalAid'),
      desc: formatDesc(data.EXTERNAL_HOSPITAL_AID_DESC),
      color: 'green',
    },
  ];

  return (
    <div>
      <div className="section-title">
        <HeartOutlined className="section-title-icon" />
        <span>{t('health.title')}</span>
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
          {t('health.registeredBy')}: {data.CREATED_EMPLOYEE_NAME} | {data.CREATED_DATE}
        </div>
      )}
    </div>
  );
}
