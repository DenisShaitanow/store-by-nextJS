// app/(shop)/basket/page.tsx
import { Metadata } from "next";
import BasketPageClient from "./BasketPageClient";

export const metadata: Metadata = {
  title: "Корзина | Store Things",
  description: "Ваша корзина покупок в интернет-магазине Store Things",
  robots: {
    index: false, // Корзина - личная страница, не индексируем
    follow: false,
  },
};

export default function BasketPage() {

  return <BasketPageClient />;
}