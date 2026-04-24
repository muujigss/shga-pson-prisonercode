'use client';

import { useTranslation } from '@/context/LanguageContext';
import { AuditOutlined } from '@ant-design/icons';

export default function LegalSection() {
  const { t } = useTranslation();

  return (
    <div className="legal-section">
      <div className="legal-header">
        <AuditOutlined className="legal-icon" />
        <div>
          <h3>{t('legal.title')}</h3>
        </div>
      </div>
      <div className="legal-badge">
        {t('legal.badge')}
      </div>
      <div className="legal-content px-12 py-6">
        <p className="mb-4 font-semibold">{t('legal.intro')}</p>
        
        {/* 210.1 */}
        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.rights.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.rights.item1')}</li>
          <li>{t('legal.rights.item2')}</li>
          <li>{t('legal.rights.item3')}</li>
          <li>{t('legal.rights.item4')}</li>
          <li>{t('legal.rights.item5')}</li>
          <li>{t('legal.rights.item6')}</li>
          <li>{t('legal.rights.item7')}</li>
          <li>{t('legal.rights.item8')}</li>
          <li>{t('legal.rights.item9')}</li>
          <li>{t('legal.rights.item10')}</li>
          <li>{t('legal.rights.item11')}</li>
          <li>{t('legal.rights.item12')}</li>
          <li>{t('legal.rights.item13')}</li>
          <li>{t('legal.rights.item14')}</li>
          <li>{t('legal.rights.item15')}</li>
        </ul>

        {/* 211.1 */}
        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.duties.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.duties.item1')}</li>
          <li>{t('legal.duties.item2')}</li>
          <li>{t('legal.duties.item3')}</li>
          <li>{t('legal.duties.item4')}</li>
          <li>{t('legal.duties.item5')}</li>
          <li>{t('legal.duties.item6')}</li>
          <li>{t('legal.duties.item7')}</li>
          <li>{t('legal.duties.item8')}</li>
          <li>{t('legal.duties.item9')}</li>
        </ul>
        <p className="mb-2 text-gray-700">{t('legal.duties.desc1')}</p>
        <p className="mb-2 text-gray-700">{t('legal.duties.desc2')}</p>
        <p className="mb-4 text-gray-700">{t('legal.duties.desc3')}</p>

        {/* 213 */}
        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.meetings.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.meetings.item1')}</li>
          <li>{t('legal.meetings.item2')}</li>
          <li>{t('legal.meetings.item3')}</li>
          <li>{t('legal.meetings.item4')}</li>
          <li>{t('legal.meetings.item5')}</li>
          <li>{t('legal.meetings.item6')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.communication.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.communication.item1')}</li>
          <li>{t('legal.communication.item2')}</li>
          <li>{t('legal.communication.item3')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.rewards.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.rewards.item1')}</li>
          <li>{t('legal.rewards.item2')}</li>
          <li>{t('legal.rewards.item3')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.search.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.search.item1')}</li>
          <li>{t('legal.search.item2')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.allowed.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.allowed.item1')}</li>
          <li>{t('legal.allowed.item2')}</li>
          <li>{t('legal.allowed.item3')}</li>
          <li>{t('legal.allowed.item4')}</li>
          <li>{t('legal.allowed.item5')}</li>
          <li>{t('legal.allowed.item6')}</li>
          <li>{t('legal.allowed.item7')}</li>
          <li>{t('legal.allowed.item8')}</li>
          <li>{t('legal.allowed.item9')}</li>
          <li>{t('legal.allowed.item10')}</li>
          <li>{t('legal.allowed.item11')}</li>
        </ul>
        <p className="mb-2 text-gray-700">{t('legal.allowed.desc1')}</p>
        <p className="mb-2 text-gray-700">{t('legal.allowed.desc2')}</p>
        <p className="mb-4 text-gray-700">{t('legal.allowed.desc3')}</p>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.schedule.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.schedule.item1')}</li>
          <li>{t('legal.schedule.item2')}</li>
          <li>{t('legal.schedule.item3')}</li>
          <li>{t('legal.schedule.item4')}</li>
          <li>{t('legal.schedule.item5')}</li>
          <li>{t('legal.schedule.item6')}</li>
          <li>{t('legal.schedule.item7')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.security.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.security.item1')}</li>
          <li>{t('legal.security.item2')}</li>
          <li>{t('legal.security.item3')}</li>
          <li>{t('legal.security.item4')}</li>
          <li>{t('legal.security.item5')}</li>
          <li>{t('legal.security.item6')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.security.violation')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.security.violation1')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.movement.title')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.movement.item1')}</li>
          <li>{t('legal.movement.item2')}</li>
          <li>{t('legal.movement.item3')}</li>
          <li>{t('legal.movement.item4')}</li>
          <li>{t('legal.movement.item5')}</li>
          <li>{t('legal.movement.item6')}</li>
        </ul>

        <p className="font-semibold text-blue-800 mt-4 mb-2">{t('legal.discipline.title')}</p>
        <p className="mb-2 text-gray-700">{t('legal.discipline.desc1')}</p>
        <ul className="list-disc pl-8 mb-4 space-y-1">
          <li>{t('legal.discipline.item1')}</li>
          <li>{t('legal.discipline.item2')}</li>
          <li>{t('legal.discipline.item3')}</li>
        </ul>
        <p className="mb-2 text-gray-700">{t('legal.discipline.desc2')}</p>
        <p className="mb-4 text-gray-700">{t('legal.discipline.desc3')}</p>

      </div>
    </div>
  );
}
