// app/(shop)/card/[idCardR]/CardPageClient.tsx (клиентский)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './CardPage.module.css';
import { ButtonUI } from '../../../(components)/button/button';
import { useAppDispatch, useAppSelector } from '../../../../services/hooks';
import { type IProduct } from '../../../../types';
import { changeBasket } from '@/src/services/thunks/userUIData/userUIData-thunks';
import { selectIsAuth } from '../../../../services/selectors/user-selectors/user-selectors';

interface Props {
  initialProduct: IProduct;
}

export default function CardPageClient({ initialProduct }: Props) {
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [PutToBasketButton, setPut] = useState<boolean>(false);

  const isAuth = useAppSelector(selectIsAuth);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePutToBasket = () => {
    if (initialProduct) {
      if (PutToBasketButton) {
        dispatch(changeBasket({ product: initialProduct, operation: 'ADD' }));
      } else {
        dispatch(changeBasket({ product: initialProduct, operation: 'DELETE' }));
      }
      setPut(!PutToBasketButton);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftHalf}>
        <img className={styles.image} src={initialProduct.image} alt={initialProduct.title} />
        <p className={styles.price}>{`${initialProduct.price}₽`}</p>
        <ButtonUI
          dataCy="putToBasketButton"
          disabled={!isAuth}
          label={
            !isAuth
              ? 'Авторизуйтесь пожалуйста'
              : PutToBasketButton
                ? 'Убрать из корзины'
                : 'Положить в корзину'
          }
          className={styles.button}
          onClick={handlePutToBasket}
        />
        {!isAuth && (
          <span className={styles.regPleaseTransparant}>
            Для покупки товара, вам необходимо авторизоваться.
          </span>
        )}
      </div>

      <div className={styles.information}>
        <h2 className={styles.title}>{initialProduct.title}</h2>
        <p className={styles.description}>{initialProduct.description}</p>
      </div>

      <Link href="/" className={styles.back}>
        <ButtonUI label="Назад" className={styles.buttonBack} />
      </Link>
    </div>
  );
}
