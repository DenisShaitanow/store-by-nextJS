// app/(shop)/card/[idCardR]/page.tsx (серверный)
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CardPageClient from "./CardPageClient";

// Динамические метаданные
export async function generateMetadata({ 
  params 
}: { 
  params: { idCardR: string } 
}): Promise<Metadata> {
  const idCardR = params.idCardR;
  
  // Проверяем формат
  if (!idCardR || !idCardR.includes("id=")) {
    return {
      title: "Товар не найден",
      robots: { index: false },
    };
  }

  // Извлекаем ID: "id=123" → "123"
  const id = idCardR.replace("id=", "");
  
  // Здесь можно получить данные о товаре для метаданных
  // const product = await getProduct(id);
  
  return {
    title: `Товар | Store Things`,
    description: `Информация о товаре`,
  };
}

// Получение данных на сервере
async function getProduct(id: string) {
  // Запрос к API или БД
  // const response = await fetch(`https://api.example.com/products/${id}`);
  // return response.json();
  return null;
}

interface Props {
  params: {
    idCardR: string;
  };
}

export default async function CardPage({ params }: Props) {
  const { idCardR } = params;
  
  // Проверяем формат
  if (!idCardR || !idCardR.includes("id=")) {
    notFound();
  }

  // Извлекаем ID
  const id = idCardR.replace("id=", "");
  
  // Получаем данные на сервере
  const product = await getProduct(id);
  
  // Передаем ID и данные в клиентский компонент
  return <CardPageClient idCardR={idCardR} id={id} initialProduct={product} />;
}