// app/orderComplited/OrderComplitedClient.tsx
'use client';

import { type FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../services/hooks';
import { selectOrders } from '../../../services/selectors/userUIData-selectors/userUIData-selectors';
import { ButtonUI } from '../../(components)/button/button';
import styles from './OrderComolited.module.css';

const OrderComplitedClient: FC = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const orders: string[] = useAppSelector(selectOrders);
  const orderId = orders[orders.length - 1];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOk = () => {
    router.push('/');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <span className={styles.text}>
        Ваш заказ успешно создан и поступил в обработку, его номер {orderId}.
      </span>
      <ButtonUI
        dataCy="returnToMainPageAfterOrder"
        className={styles.buttonOk}
        onClick={handleOk}
        label="Отлично"
      />
    </div>
  );
};

export default OrderComplitedClient;
