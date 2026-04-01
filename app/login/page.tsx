'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SafetyCertificateOutlined, LockOutlined } from '@ant-design/icons';

function LoginForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('6 оронтой код оруулна уу');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(code);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Код буруу эсвэл идэвхгүй байна');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    setError('');
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <SafetyCertificateOutlined />
        </div>

        <h2 className="login-title">Хоригдогчийн мэдээлэл</h2>
        <p className="login-subtitle">Нэг удаагийн кодоо оруулж нэвтэрнэ үү</p>

        {error && <div className="login-error">{error}</div>}

        <div className="login-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            className="login-input"
            placeholder="6 оронтой нэг удаагийн код"
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
          {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
