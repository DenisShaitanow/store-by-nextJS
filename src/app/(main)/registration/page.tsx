// app/registration/page.tsx
import { Metadata } from "next";
import RegistrationClient from "./registration";

export const metadata: Metadata = {
  title: "Регистрация | Store Things",
  description: "Создайте аккаунт в интернет-магазине Store Things",
  robots: {
    index: false, // Страница регистрации не должна индексироваться
    follow: false,
  },
};

export default function RegistrationPage() {
  return <RegistrationClient />;
}