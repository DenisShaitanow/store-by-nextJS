// app/(shop)/about/page.tsx
import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "О магазине | Store Things",
  description: "Информация о интернет-магазине Store Things. Широкий ассортимент одежды и аксессуаров.",
  keywords: "о нас, интернет-магазин, Store Things, одежда, аксессуары",
  openGraph: {
    title: "О магазине Store Things",
    description: "Узнайте больше о нашем интернет-магазине",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}