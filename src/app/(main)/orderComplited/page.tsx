// app/orderComplited/page.tsx
import { Metadata } from "next";
import OrderComplitedClient from "./OrderComolited";

export const metadata: Metadata = {
  title: "Заказ оформлен | Store Things",
  description: "Ваш заказ успешно оформлен",
  robots: {
    index: false, // Страница заказа не должна индексироваться
    follow: false,
  },
};

export default function OrderComplitedPage() {
  return <OrderComplitedClient />;
}