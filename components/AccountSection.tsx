'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useTranslation } from '@/context/LanguageContext';

export default function AccountSection() {
  const [rows, setRows] = useState<any[]>([]);
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    api('/prisoner-code-auth/account-book')
      .then((res: any) => {
        // Шинэ shape: { account, rows }. Хуучин массив shape-тэй ч нийцнэ.
        if (Array.isArray(res)) {
          setRows(res);
        } else {
          setRows(res?.rows || []);
          setAccount(res?.account || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  const formatMoney = (val: number) => {
    if (!val && val !== 0) return '—';
    return Number(val).toLocaleString('mn-MN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const summary = account ? (
    <div className="account-summary" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 12 }}>
      <div>
        <span style={{ opacity: 0.7 }}>{t('account.accountNumber') || 'Дансны дугаар'}: </span>
        <b>{account.accountNumber || '—'}</b>
      </div>
      <div>
        <span style={{ opacity: 0.7 }}>{t('account.currentBalance') || 'Үлдэгдэл'}: </span>
        <b>{formatMoney(account.balance)}₮</b>
      </div>
    </div>
  ) : null;

  if (!rows || rows.length === 0) {
    return (
      <>
        {summary}
        <div className="empty-state">{t('account.noData')}</div>
      </>
    );
  }

  return (
    <div className="data-table-wrapper">
      {summary}
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
          {rows.map((row: any, i: number) => (
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
