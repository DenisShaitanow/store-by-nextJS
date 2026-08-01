// app/(shop)/favorites/page.tsx
import { Metadata } from "next";
import FavoritesPageClient from "./FavoritsPageClient";

export const metadata: Metadata = {
  title: "Избранное | Store Things",
  description: "Ваши избранные товары в интернет-магазине Store Things",
  robots: {
    index: false, // Избранное - личная страница
    follow: false,
  },
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}