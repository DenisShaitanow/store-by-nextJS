// app/(shop)/basket/BasketPageClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './BasketPage.module.css';
import { ButtonUI } from '../../(components)/button/button';
import { useAppDispatch, useAppSelector } from '../../../services/hooks';
import { selectBasket } from '../../../services/selectors/userUIData-selectors/userUIData-selectors';
import ProductCardInBasket from '../../(components)/productCardinBasket/ProductCardInBasket';
import SadSmile from '../../(components)/assets/smiley-sad-fill.svg';
import { getBasketApi } from '@/src/services/api';

export default function BasketPageClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const productsInBasket = useAppSelector(selectBasket);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOrder = () => {
    router.push('/formOrder');
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      {productsInBasket.length > 0 ? (
        <>
          <div className={styles.cardList}>
            {productsInBasket.map((card) => (
              <ProductCardInBasket key={card.item.id} card={card.item} count={card.count} />
            ))}
          </div>
          <ButtonUI
            dataCy="proceedToCheckoutOrder"
            className={styles.buttonBasket}
            label="Перейти к оформлению"
            onClick={handleOrder}
          />
        </>
      ) : (
        <div className={styles.noProducts}>
          <SadSmile />
          <span className={styles.basketEmpty}>Корзина пуста.</span>
          <ButtonUI label="Вернуться к покупкам" onClick={handleBack} />
        </div>
      )}
    </div>
  );
}
