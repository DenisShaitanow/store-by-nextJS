import { Metadata } from "next";
import FormOrderClient from "./FormOrderPage";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформление заказа в нашем магазине",
};

export default function OrderPage() {
  return <FormOrderClient />;
}