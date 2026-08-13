// app/(auth)/auth/page.tsx
import { Metadata } from "next";
import AuthPageClient from "./AuthPageClient";

export const metadata: Metadata = {
  title: "Вход в личный кабинет | Store Things",
  description: "Войдите в свой личный кабинет в интернет-магазине Store Things",
  robots: {
    index: false, 
    follow: false,
  },
};

export default function AuthPage() {
  return <AuthPageClient />;
}