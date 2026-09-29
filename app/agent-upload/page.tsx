import type { Metadata } from 'next';
import AgentUploadForm from '@/components/AgentUploadForm';

// Цэсэнд холбоосгүй хуудас. Хамгаалалт нь FINGER_AGENT_UPLOAD_SECRET (backend шалгана).
export const metadata: Metadata = {
  title: 'Уншигчийн програм байршуулах',
  robots: { index: false, follow: false },
};

export default function AgentUploadPage() {
  return <AgentUploadForm />;
}
