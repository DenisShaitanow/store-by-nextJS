
import { getProductsApi } from '../../services/api';
import { getBasketApi } from '../../services/api';
import HomePageClient from './HomePageClient';


export default async function HomePage() {

  const products = await getProductsApi();
  console.log(products)

  return <HomePageClient products={products}/>;
}


