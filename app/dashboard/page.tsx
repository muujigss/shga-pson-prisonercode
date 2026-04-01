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

const menuItems = [
  { id: 'sentence', label: 'Ялын тооцоо', icon: <BankOutlined /> },
  { id: 'account', label: 'Данс', icon: <DollarOutlined /> },
  { id: 'offence', label: 'Зөрчил', icon: <WarningOutlined /> },
  { id: 'health', label: 'Эрүүл мэнд', icon: <HeartOutlined /> },
  { id: 'meeting', label: 'Уулзалт', icon: <TeamOutlined /> },
  { id: 'complaint', label: 'Өргөдөл гомдол', icon: <FileTextOutlined /> },
];

function DashboardContent({ children }: { children?: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState('sentence');
  const { prisoner, isLoading, logout } = useAuth();
  const router = useRouter();

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

  return (
    <div className="dashboard-layout">
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
            Гарах
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="dashboard-header">
        <span className="header-badge">Хоригдогчийн систем</span>
        <span className="header-badge">{displayName} {prisoner.stateRegNumber}</span>
      </header>

      {/* Content */}
      <main className="dashboard-content">
        {renderSection()}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
