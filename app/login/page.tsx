'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SafetyCertificateOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Button } from 'antd';
import { LanguageProvider, useTranslation, Language } from '@/context/LanguageContext';

function LoginForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError(t('login.errorLength'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(code);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('login.errorInvalid'));
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    setError('');
  };

  const items: MenuProps['items'] = [
    { key: 'mn', label: 'Монгол' },
    { key: 'en', label: 'English' },
    { key: 'ru', label: 'Русский' },
    { key: 'zh', label: '中文' },
  ];

  return (
    <div className="login-container relative">
      <div className="absolute top-4 right-4 z-10">
        <Dropdown 
          menu={{ 
            items, 
            onClick: (e) => setLanguage(e.key as Language),
            selectedKeys: [language]
          }} 
          placement="bottomRight"
        >
          <Button icon={<GlobalOutlined />} type="text" style={{ color: 'white' }}>
            {(items.find(item => item?.key === language) as any)?.label || 'Монгол'}
          </Button>
        </Dropdown>
      </div>

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <SafetyCertificateOutlined />
        </div>

        <h2 className="login-title">{t('login.title')}</h2>
        <p className="login-subtitle">{t('login.subtitle')}</p>

        {error && <div className="login-error">{error}</div>}

        <div className="login-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            className="login-input"
            placeholder={t('login.placeholder')}
            value={code}
            onChange={handleCodeChange}
            maxLength={6}
            autoComplete="off"
          />
          <LockOutlined className="login-input-icon" />
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={loading || code.length !== 6}
        >
          {loading ? t('login.buttonLoading') : t('login.buttonSubmit')}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
