
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CardPageClient from "./CardPageClient";
import { GetProductApi } from '../../../../services/api';

// Динамические метаданные
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  
  // Проверяем формат
  if (!id) {
    return {
        title: "Загрузка товара...",
        robots: { index: false },
    };
} else {
  try {
  const product = await GetProductApi({id: id});
  
  return {
    title: `${product.title}`,
    description: `${product.description}`,
  }; }

  catch {
    return {
      title: `Товар не найден`,
      description: ``,
      robots: { index: false },
    };
    
  }
}

 
}


interface Props {
  params: {
    id: string;
  };
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;

  try {
    const product = await GetProductApi({ id });
    
    // Если продукта нет — редирект
    if (!product) {
        redirect('/404');
    }
    
    return <CardPageClient initialProduct={product} />;
    
} catch (error) {
    redirect('/404');
}

}