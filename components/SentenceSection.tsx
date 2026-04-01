'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  CalendarOutlined,
  FieldTimeOutlined,
  ClockCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';

export default function SentenceSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="empty-state">Өгөгдөл байхгүй</div>;
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
          <div className="info-card-label">Шийтгэх тогтоолын огноо</div>
          <div className="info-card-value">{data.DECISION_DATE || '—'}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon green"><FieldTimeOutlined /></div>
          <div className="info-card-label">Цагдан хоригдсон хоног</div>
          <div className="info-card-value">{custodyDays} хоног</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon blue"><CalendarOutlined /></div>
          <div className="info-card-label">Ял эхлэн тоолох огноо</div>
          <div className="info-card-value">{data.JAIL_START_DATE || '—'}</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon orange"><ClockCircleOutlined /></div>
          <div className="info-card-label">Хорих хугацаа</div>
          <div className="info-card-value">{jailYears} жил {jailMonths} сар {jailDays} өдөр</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon green"><FieldTimeOutlined /></div>
          <div className="info-card-label">Шагналын хоног</div>
          <div className="info-card-value">{bonusDays} хоног</div>
        </div>

        <div className="info-card">
          <div className="info-card-icon red"><CalendarOutlined /></div>
          <div className="info-card-label">Ял эдлэж дуусах огноо</div>
          <div className="info-card-value red">{endDate || '—'}</div>
        </div>
      </div>

      {/* Legal basis */}

      {/* Hardcoded legal reference */}
      <div className="legal-section" style={{ marginTop: 16 }}>
        <div className="legal-header">
          <AuditOutlined className="legal-icon" />
          <div>
            <h3>Хуулийн үндэслэл - 6.12 дугаар зүйл</h3>
          </div>
        </div>
        <div className="legal-badge">
          Хүчин төгөлдөр болсон огноо: 7/1/2017
        </div>
        <div className="legal-content">
          <strong>Хорих ялаас хугацаанаас өмнө суллаж, хяналт тогтоох</strong>
          <br /><br />
          1. Ялтан гэмт хэрэг үйлдэж учруулсан хохирлоо нөхөн төлж зан байдлаараа нийтэд аюулгүй болсноо нотлон харуулж ял эдлэх хугацаандаа ноцтой зөрчил гаргаагүй, оногдуулсан ялын дараах хувийг эдэлсэн бол прокурорын саналыг харгалзан шүүх хугацаанаас өмнө суллаж, хяналт тогтоохоор шийдвэрлэж болно:
          <br />
          1.1. таван жил хүртэл хугацаагаар оногдуулсан хорих ялын хоёрны нэгээс доошгүй хувийг;
          <br />
          1.2. таван жилээс дээш арван хоёр жил хүртэл хугацаагаар оногдуулсан хорих ялын гуравны хоёроос доошгүй хувийг;
          <br />
          1.3. арван хоёр жилээс дээш хорин жил хүртэл хугацаагаар оногдуулсан хорих ялын дөрөвний гурваас доошгүй хувийг эдэлсэн бол.
          <br /><br />
          2. Хорих ялаас хугацаанаас нь өмнө суллахдаа эдлээгүй үлдсэн ялын хугацаатай тэнцүү хяналтын хугацаа тогтооно.
          <br /><br />
          3. Хорих ялаас хугацаанаас өмнө суллагдсан хүн хяналтын хугацаанд түүнд хүлээлгэсэн үүргийг зөрчсөн бол прокурорын саналыг харгалзан шүүх хяналт тогтоосон шийдвэрийг хүчингүй болгож эдлээгүй үлдсэн ялыг эдлүүлэхээр шийдвэрлэнэ.
          <br /><br />
          4. Хорих ялаас хугацаанаас өмнө суллагдсан хүн хяналтын хугацаанд санаатай гэмт хэрэг үйлдсэн бол шүүх эдлээгүй үлдсэн ял дээр шинээр үйлдсэн гэмт хэрэгт оногдуулсан ялыг энэ хуулийн 6.9 дүгээр зүйлд заасан журмаар нэмж нэгтгэнэ.
          <br /><br />
          5. Хорих ялаас хугацаанаас өмнө суллагдсан хүн хяналтын хугацаанд болгоомжгүй гэмт хэрэг үйлдсэн бол энэ хуулийн 6.9 дүгээр зүйлд заасан журмаар ял оногдуулах эсэхийг шүүх шийдвэрлэнэ.
          <br /><br />
          6. Энэ хуулийн 10.1 дүгээр зүйлийн 3 дахь хэсэг, 12.1 дүгээр зүйлийн 4 дэх хэсэг, 12.3 дугаар зүйлийн 4.1 дэх заалт, 13.1 дүгээр зүйлийн 2, 3 дахь хэсэг, 22.1 дүгээр зүйлийн 3 дахь хэсэг, 22.4 дүгээр зүйлийн 3 дахь хэсэг, 22.10 дугаар зүйлийн 2 дахь хэсэгт заасан гэмт хэрэг үйлдсэн ялтныг хорих ялаас хугацаанаас өмнө суллаж, хяналт тогтоохгүй.
          <br /><br />
          <em>Тайлбар: Гэмт хэрэг үйлдэх үедээ арван найман насанд хүрээгүй хүнд энэ зүйлийн 6 дахь хэсэг хамаарахгүй.</em>
        </div>
      </div>
    </div>
  );
}
