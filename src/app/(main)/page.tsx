
import { getProductsApi } from '../../services/api';
import { getBasketApi } from '../../services/api';
import HomePageClient from './HomePageClient';


export default async function HomePage() {

  const [products, basket] = await Promise.all([
    getProductsApi(), 
    getBasketApi(),   
  ]);

  return <HomePageClient products={products} basket={basket} />;
}


