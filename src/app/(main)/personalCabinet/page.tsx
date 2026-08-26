// app/personal-cabinet/page.tsx
import { Metadata } from 'next';
import PersonalCabinetClient from './PersonalCabinet';

export const metadata: Metadata = {
  title: 'Личный кабинет | Store Things',
  description: 'Управление личными данными в интернет-магазине Store Things',
  robots: {
    index: false, // Личная страница не должна индексироваться
    follow: false,
  },
};

export default function PersonalCabinetPage() {
  return <PersonalCabinetClient />;
}
