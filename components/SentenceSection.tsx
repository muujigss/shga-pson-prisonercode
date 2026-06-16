'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';
import {
  CalendarOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';

const ymd30 = (diffDays: number) => {
  if (diffDays <= 0) return { y: 0, m: 0, d: 0 };
  const y = Math.floor(diffDays / 360);
  const m = Math.floor((diffDays % 360) / 30);
  const d = (diffDays % 360) % 30;
  return { y, m, d };
};
const toNominal = (y: number, m: number, d: number) => y * 360 + m * 30 + d;

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

  // Admin (type=11) Ялын тооцоотой ижил логик.
  const jailYears = Number(data.JAIL_YEARS || 0);
  const jailMonths = Number(data.JAIL_MONTHS || 0);
  const jailDays = Number(data.JAIL_DAYS || 0);
  const bonusDays = Number(data.BONUS_DAYS || 0);
  const custodyDays = Number(data.DAYS_IN_CUSTODY || 0);
  const calcTypeId = Number(data.CALC_TYPE_ID || 1);
  const isCalendar = calcTypeId !== 1;
  const start = data.JAIL_START_DATE ? dayjs(data.JAIL_START_DATE) : null;

  // Хоригдох хугацаа — нормчилсон (30 хоног = 1 сар, 12 сар = 1 жил).
  const normJailDays = jailDays % 30;
  const normJailMonthsRaw = jailMonths + Math.floor(jailDays / 30);
  const normJailMonths = normJailMonthsRaw % 12;
  const normJailYears = jailYears + Math.floor(normJailMonthsRaw / 12);

  // Ял эдэлж дуусах огноо
  let endDateStr = '';
  if (start) {
    const bY = Math.floor(bonusDays / 360);
    const bM = Math.floor(bonusDays / 30) - bY * 12;
    const bD = bonusDays - (bY * 12 + bM) * 30;
    let end;
    if (isCalendar) {
      end = start
        .add(jailYears - bY, 'year')
        .add(jailMonths - bM, 'month')
        .add(jailDays - bD, 'day');
    } else {
      let totalD = start.date() + (jailDays - bD);
      let totalM = (start.month() + 1) + (jailMonths - bM);
      let totalY = start.year() + (jailYears - bY);
      if (totalD <= 0) {
        const bm = Math.ceil(Math.abs(totalD) / 30) || 1;
        totalD += bm * 30; totalM -= bm;
      } else if (totalD > 30) {
        totalM += Math.floor(totalD / 30); totalD = totalD % 30;
      }
      if (totalM <= 0) {
        const by = Math.ceil(Math.abs(totalM) / 12) || 1;
        totalM += by * 12; totalY -= by;
      } else if (totalM > 12) {
        totalY += Math.floor(totalM / 12); totalM = totalM % 12;
        if (totalM === 0) { totalM = 12; totalY -= 1; }
      }
      end = dayjs().year(totalY).month(totalM - 1).date(totalD);
    }
    endDateStr = end.format('YYYY-MM-DD');
  }

  // Биеэр эдэлсэн ← Ял эхлэн тоолох огноо → өнөөдөр
  const now = dayjs();
  let served = { y: 0, m: 0, d: 0 };
  if (start) {
    if (isCalendar) {
      let a = start.startOf('day');
      const b = now.startOf('day');
      let y = b.diff(a, 'year'); if (y < 0) y = 0; a = a.add(y, 'year');
      let m = b.diff(a, 'month'); if (m < 0) m = 0; a = a.add(m, 'month');
      let d = b.diff(a, 'day'); if (d < 0) d = 0;
      served = { y, m, d };
    } else {
      let days = now.date() - start.date();
      let months = (now.month() + 1) - (start.month() + 1);
      let years = now.year() - start.year();
      if (days < 0) { days += 30; months -= 1; }
      if (months < 0) { months += 12; years -= 1; }
      served = { y: years, m: months, d: days };
    }
  }

  const servedNominal = toNominal(served.y, served.m, served.d);
  const totalNominal = servedNominal + bonusDays;
  const sentenceNominal = toNominal(jailYears, jailMonths, jailDays);
  const remainNominal = Math.max(0, sentenceNominal - totalNominal);
  const bonus = ymd30(bonusDays);
  const totalServed = ymd30(totalNominal);
  const remain = ymd30(remainNominal);

  const dur = (o: { y: number; m: number; d: number }) =>
    `${o.y} ${t('sentence.years')} ${o.m} ${t('sentence.months')} ${o.d} ${t('sentence.daysText')}`;

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
          <div className="info-card-value">{normJailYears} {t('sentence.years')} {normJailMonths} {t('sentence.months')} {normJailDays} {t('sentence.daysText')}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon green"><FieldTimeOutlined /></div>
          <div className="info-card-label">{t('sentence.bonusDays')}</div>
          <div className="info-card-value">{dur(bonus)}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon red"><FieldTimeOutlined /></div>
          <div className="info-card-label">Биеэр эдэлсэн</div>
          <div className="info-card-value">{dur(served)}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon orange"><FieldTimeOutlined /></div>
          <div className="info-card-label">Нийт эдэлсэн</div>
          <div className="info-card-value">{dur(totalServed)}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon red"><CalendarOutlined /></div>
          <div className="info-card-label">{t('sentence.jailEndDate')}</div>
          <div className="info-card-value red">{endDateStr || '—'}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon blue"><ClockCircleOutlined /></div>
          <div className="info-card-label">Үлдсэн хугацаа</div>
          <div className="info-card-value">{dur(remain)}</div>
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
          {t('sentence.p1')}<br />
          {t('sentence.p1_1')}<br />
          {t('sentence.p1_2')}<br />
          {t('sentence.p1_3')}<br /><br />
          {t('sentence.p2')}<br /><br />
          {t('sentence.p3')}<br /><br />
          {t('sentence.p4')}<br /><br />
          {t('sentence.p5')}<br /><br />
          {t('sentence.p6')}<br /><br />
          <em>{t('sentence.note')}</em>
        </div>
      </div>
    </div>
  );
}
