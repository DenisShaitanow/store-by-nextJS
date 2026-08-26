// app/not-found/page.tsx
import { Metadata } from 'next';
import PageNotFoundClient from './PageNotFinfClient';

export const metadata: Metadata = {
  title: 'Страница не найдена | 404',
  description: 'Запрашиваемая страница не существует. Вернитесь на главную.',
  robots: {
    index: false, // Страница 404 не должна индексироваться
    follow: false,
  },
};

export default function NotFoundPage() {
  return <PageNotFoundClient />;
}
