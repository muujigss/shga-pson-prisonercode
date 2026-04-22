'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import {
  BankOutlined,
  DollarOutlined,
  WarningOutlined,
  HeartOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import SentenceSection from '@/components/SentenceSection';
import AccountSection from '@/components/AccountSection';
import OffenceSection from '@/components/OffenceSection';
import HealthSection from '@/components/HealthSection';
import MeetingSection from '@/components/MeetingSection';
import ComplaintSection from '@/components/ComplaintSection';



import { LanguageProvider, useTranslation, Language } from '@/context/LanguageContext';
import { Dropdown, MenuProps, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

function DashboardContent({ children }: { children?: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState('sentence');
  const { prisoner, isLoading, logout } = useAuth();
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    if (!isLoading && !prisoner) {
      router.push('/login');
    }
  }, [isLoading, prisoner, router]);

  if (isLoading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!prisoner) return null;

  const displayName = `${prisoner.lastName?.[0] || ''}. ${prisoner.firstName}`;

  const renderSection = () => {
    switch (activeMenu) {
      case 'sentence': return <SentenceSection />;
      case 'account': return <AccountSection />;
      case 'offence': return <OffenceSection />;
      case 'health': return <HealthSection />;
      case 'meeting': return <MeetingSection />;
      case 'complaint': return <ComplaintSection />;
      default: return <SentenceSection />;
    }
  };

  const menuItems = [
    { id: 'sentence', label: t('dashboard.menu.sentence'), icon: <BankOutlined /> },
    { id: 'account', label: t('dashboard.menu.account'), icon: <DollarOutlined /> },
    { id: 'offence', label: t('dashboard.menu.offence'), icon: <WarningOutlined /> },
    { id: 'health', label: t('dashboard.menu.health'), icon: <HeartOutlined /> },
    { id: 'meeting', label: t('dashboard.menu.meeting'), icon: <TeamOutlined /> },
    { id: 'complaint', label: t('dashboard.menu.complaint'), icon: <FileTextOutlined /> },
  ];

  const langItems: MenuProps['items'] = [
    { key: 'mn', label: 'Монгол' },
    { key: 'en', label: 'English' },
    { key: 'ru', label: 'Русский' },
    { key: 'zh', label: '中文' },
  ];

  return (
    <div className="dashboard-layout relative">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-logout">
          <button className="logout-btn" onClick={logout}>
            <LogoutOutlined />
            {t('dashboard.logout')}
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="dashboard-header relative">
        <span className="header-badge">{t('dashboard.headerBadge')}</span>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Dropdown 
            menu={{ 
              items: langItems, 
              onClick: (e) => setLanguage(e.key as Language),
              selectedKeys: [language]
            }} 
            placement="bottomRight"
          >
            <Button icon={<GlobalOutlined />} type="text" style={{ color: 'white' }}>
              {(langItems.find(item => item?.key === language) as any)?.label || 'Монгол'}
            </Button>
          </Dropdown>
          <span className="header-badge">{displayName} {prisoner.stateRegNumber}</span>
        </div>
      </header>

      {/* Content */}
      <main className="dashboard-content">
        {renderSection()}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
