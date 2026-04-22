'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';
import {
  CalendarOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';

export default function SentenceSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    api('/prisoner-code-auth/sentence')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!data) {
    return <div className="empty-state">{t('sentence.noData')}</div>;
  }

  const jailYears = data.JAIL_YEARS || 0;
  const jailMonths = data.JAIL_MONTHS || 0;
  const jailDays = data.JAIL_DAYS || 0;
  const bonusDays = data.BONUS_DAYS || 0;
  const custodyDays = data.DAYS_IN_CUSTODY || 0;

  // Calculate end date
  let endDate = '';
  if (data.JAIL_START_DATE) {
    const start = new Date(data.JAIL_START_DATE);
    start.setFullYear(start.getFullYear() + jailYears);
    start.setMonth(start.getMonth() + jailMonths);
    start.setDate(start.getDate() + jailDays - bonusDays);
    endDate = start.toISOString().split('T')[0];
  }

  return (
    <div>
      <div className="info-cards-grid">
        <div className="info-card">
          <div className="info-card-icon blue"><CalendarOutlined /></div>
          <div className="info-card-label">{t('sentence.decisionDate')}</div>
          <div className="info-card-value">{data.DECISION_DATE || '—'}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon green"><FieldTimeOutlined /></div>
          <div className="info-card-label">{t('sentence.custodyDays')}</div>
          <div className="info-card-value">{custodyDays} {t('sentence.daysSuffix')}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon blue"><CalendarOutlined /></div>
          <div className="info-card-label">{t('sentence.jailStartDate')}</div>
          <div className="info-card-value">{data.JAIL_START_DATE || '—'}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon orange"><ClockCircleOutlined /></div>
          <div className="info-card-label">{t('sentence.jailDuration')}</div>
          <div className="info-card-value">{jailYears} {t('sentence.years')} {jailMonths} {t('sentence.months')} {jailDays} {t('sentence.daysText')}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon green"><FieldTimeOutlined /></div>
          <div className="info-card-label">{t('sentence.bonusDays')}</div>
          <div className="info-card-value">{bonusDays} {t('sentence.daysSuffix')}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon red"><CalendarOutlined /></div>
          <div className="info-card-label">{t('sentence.jailEndDate')}</div>
          <div className="info-card-value red">{endDate || '—'}</div>
        </div>
      </div>

      <div className="legal-section" style={{ marginTop: 16 }}>
        <div className="legal-header">
          <AuditOutlined className="legal-icon" />
          <div>
            <h3>{t('sentence.legalTitle')}</h3>
          </div>
        </div>
        <div className="legal-badge">
          {t('sentence.legalEffectiveDate')}
        </div>
        <div className="legal-content">
          <strong>{t('sentence.legalHeader')}</strong>
          <br /><br />
          {t('sentence.p1')}
          <br />
          {t('sentence.p1_1')}
          <br />
          {t('sentence.p1_2')}
          <br />
          {t('sentence.p1_3')}
          <br /><br />
          {t('sentence.p2')}
          <br /><br />
          {t('sentence.p3')}
          <br /><br />
          {t('sentence.p4')}
          <br /><br />
          {t('sentence.p5')}
          <br /><br />
          {t('sentence.p6')}
          <br /><br />
          <em>{t('sentence.note')}</em>
        </div>
      </div>
    </div>
  );
}
