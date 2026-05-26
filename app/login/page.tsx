'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SafetyCertificateOutlined, LockOutlined, GlobalOutlined, UserOutlined, DownloadOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Button, Radio, Input, InputRef, Spin } from 'antd';
import { LanguageProvider, useTranslation, Language } from '@/context/LanguageContext';
import { getSocket } from '@/lib/sockets';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { OTPRef } from 'antd/es/input/OTP';
function LoginForm() {
  const [registerNum, setRegisterNum] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const registerRef = useRef<InputRef>(null);
  const otpRef = useRef<OTPRef>(null)
  const router = useRouter();
  const { login } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const [connected, setConnected] = useState(false);
  const [ fingerImage, setFingerImage ] = useState<string | null>(null);
  const [ selectedType, setSelectedType ] = useState<string>('FINGER');
  const options: CheckboxGroupProps<string>['options'] = [
    { label: t('login.typeFinger'), value: 'FINGER' },
    { label: t('login.typeCode'), value: 'CODE' },
  ];
  useEffect(() => {
    registerRef.current?.focus();
    const socket = getSocket();
    if (!socket) return;
    const removeMessage = socket.addMessageListener((message) => {
      try {
        const evt = JSON.parse(message.data);
        if (evt.eventType === 'FINGER_IMAGE') {
          setFingerImage(evt.payload);
        }
      } catch (err) {
        console.log('message error:', err);
      }
    });
    const removeOpen = socket.addOpenListener(() => {
      setConnected(true);
      console.log('🟢 CONNECTED');
    });
    const removeClose = socket.addCloseListener(() => {
      setFingerImage(null);
      setConnected(false);
      console.log('🔴 DISCONNECTED');
    });
    setConnected(socket.isConnected);
    return () => {
      removeMessage();
      removeOpen();
      removeClose();
    };
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType === 'CODE' && code.length !== 6) {
      setError(t('login.errorLength'));
      return;
    }
    setLoading(true);
    setError('');

    try {
      await login(registerNum, code, fingerImage);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || t('login.errorInvalid'));
    } finally {
      setLoading(false);
    }
  };
  const handleOtpChange = (val: string) => {
    setCode(val);
    setError('');
  }
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    setError('');
  };
  const handleRegisterNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setRegisterNum(val);
    setError('');
  };
  const items: MenuProps['items'] = [
    { key: 'mn', label: 'Монгол' },
    { key: 'en', label: 'English' },
    { key: 'ru', label: 'Русский' },
    { key: 'zh', label: '中文' },
  ];
  const isCodeValid = code.length === 6;
  const isFingerValid = !!fingerImage;
  const isRegisterNumValid = !!registerNum;
  const canSubmit = isRegisterNumValid && (selectedType === 'CODE' ? isCodeValid : isFingerValid);
  const isButtonDisabled = loading || !canSubmit;
  return (
    <div className="login-container relative">
      {/* <div className="absolute top-4 right-4 z-10">
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
      </div> */}
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-icon">
          <SafetyCertificateOutlined />
        </div>
        <h2 className="login-title">{t('login.title')}</h2>
        <p className="login-subtitle">{t('login.subtitle')}</p>
        <div className='login-input-wrapper'>
          <Radio.Group
            block
            options={options}
            defaultValue="FINGER"
            buttonStyle="solid"
            optionType="button"
            size="large"
            value={selectedType}
            onChange={(e) => {
              setCode('');
              setFingerImage(null);
              setSelectedType(e.target.value);
            }}
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-input-wrapper">
          <Input
            ref={registerRef}
            placeholder={t('login.registerNum')}
            prefix={<UserOutlined />}
            size="large"
            value={registerNum}
            onChange={handleRegisterNumChange}
          />
          {/* <input
            ref={registerRef}
            type="text"
            placeholder={t('login.placeholder')}
            value={registerNum}
            onChange={handleRegisterNumChange}
            maxLength={20}
            autoComplete="off"
          />
          <UserOutlined className="login-input-icon" /> */}
        </div>
        {
          selectedType === 'FINGER' ?
          <div className="login-input-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ height: 100, width: 78.05, border: '1px solid  #9aa5b8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {
                !!fingerImage ? <img style={{ height: "100%", width: "100%", borderRadius: 8 }} src={`data:image/png;base64,${fingerImage}`} alt="img" /> :
                connected ?
                <div style={{ fontSize: 11, textAlign: 'center', fontWeight: 'bolder', color: '#9aa5b8' }}>Та хуруугаа дарна уу</div> : <Spin />
              }
            </div>
          </div> :
          <div className="login-input-wrapper">
            <Input.OTP
              ref={otpRef}
              mask="*"
              value={code}
              size="large"
              onChange={handleOtpChange}
            />
            {/* <input
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
            <LockOutlined className="login-input-icon" /> */}
          </div>
        }
        <button
          type="submit"
          className="login-btn login-input-wrapper"
          disabled={isButtonDisabled}
        >
          {loading ? t('login.buttonLoading') : t('login.buttonSubmit')}
        </button>
        <a  href="/ZkFingerprintSetup.exe.zip" download="ZkFingerprintSetup.exe.zip" >
          <Button color="primary" variant="link" icon={<DownloadOutlined /> }>
            Хурууны хээ уншигч татах
          </Button>
        </a>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
