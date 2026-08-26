// app/notifications/page.tsx
import { Metadata } from 'next';
import NotificationsClient from './NotificationsPage';

export const metadata: Metadata = {
  title: 'Уведомления | Store Things',
  description: 'Ваши уведомления в интернет-магазине Store Things',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
