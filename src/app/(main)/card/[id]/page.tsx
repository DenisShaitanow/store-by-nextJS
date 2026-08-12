
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CardPageClient from "./CardPageClient";

// Динамические метаданные
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const { id } = params;
  
  // Проверяем формат
  if (!id) {
    return {
      title: "Товар не найден",
      robots: { index: false },
    };
  }


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
    id: string;
  };
}

export default async function CardPage({ params }: Props) {
  const { id } = params;
  
  // Проверяем формат
  if (!id) {
    notFound();
  }


  
  // Получаем данные на сервере
  const product = await getProduct(id);
  
  // Передаем ID и данные в клиентский компонент
  return <CardPageClient id={id} initialProduct={product} />;
}