'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';

export default function AccountSection() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    api('/prisoner-code-auth/account-book')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!data || data.length === 0) {
    return <div className="empty-state">{t('account.noData')}</div>;
  }

  const formatMoney = (val: number) => {
    if (!val && val !== 0) return '—';
    return Number(val).toLocaleString('mn-MN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 60 }}>{t('account.index')}</th>
            <th>{t('account.date')}</th>
            <th style={{ textAlign: 'right' }}>{t('account.spending')}</th>
            <th style={{ textAlign: 'right' }}>{t('account.income')}</th>
            <th style={{ textAlign: 'right' }}>{t('account.balance')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i}>
              <td>{row.ROW_NUM || i + 1}</td>
              <td>{row.BOOK_DATE || '—'}</td>
              <td style={{ textAlign: 'right' }}>{formatMoney(row.SPENDING)}</td>
              <td style={{ textAlign: 'right' }}>{formatMoney(row.INCOME)}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatMoney(row.BALANCE)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
