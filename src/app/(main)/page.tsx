
import { getProductsApi } from '../../services/api';
import { getBasketApi } from '../../services/api';
import HomePageClient from './HomePageClient';
import { cookies } from 'next/headers';


export default async function HomePage() {
  
  const cookieStore = await cookies();
  const successToken = cookieStore.get('successToken')?.value || '';

  const products = await getProductsApi(successToken);

  return <HomePageClient products={products}/>;
}


