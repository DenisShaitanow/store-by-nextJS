// app/(shop)/card/[idCardR]/CardPageClient.tsx (клиентский)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./CardPage.module.css";
import { ButtonUI } from "../../(components)/button/button";
import { useAppDispatch, useAppSelector } from "../../../services/hooks";
import { type IProduct } from "../../../types";
import { selectProducts } from "../../../services/selectors/userUIData-selectors/userUIData-selectors";
import {
  addToBusket,
  removeFromBusket,
} from "../../../services/slices/userUIData";
import { selectIsAuth } from "../../../services/selectors/user-selectors/user-selectors";

interface Props {
  idCardR: string;          // Полный параметр "id=123"
  id: string;               // Чистый ID "123"
  initialProduct?: IProduct | null;
}

export default function CardPageClient({ idCardR, id, initialProduct }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [PutToBasketButton, setPut] = useState<boolean>(false);
  
  const products: IProduct[] = useAppSelector(selectProducts);
  const isAuth = useAppSelector(selectIsAuth);

  // Находим карточку товара (сначала из пропсов, потом из Redux)
  const card = initialProduct || products.find((item) => item.id === id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePutToBasket = () => {
    if (card) {
      if (PutToBasketButton) {
        dispatch(removeFromBusket(card));
      } else {
        dispatch(addToBusket(card));
      }
      setPut(!PutToBasketButton);
    }
  };

  if (!isMounted) {
    return null;
  }

  // Если товар не найден
  if (!card) {
    return (
      <div className={`${styles.container} ${styles.column}`}>
        {/* SVG иконка печали */}
        <p className={styles.notFoundParagraph}>Товар не найден</p>
        <Link href="/">
          <ButtonUI label="Вернуться на главную" />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftHalf}>
        <img className={styles.image} src={card.image} alt={card.title} />
        <p className={styles.price}>{`${card.price}₽`}</p>
        <ButtonUI
          dataCy="putToBasketButton"
          disabled={!isAuth}
          label={
            !isAuth
              ? "Авторизуйтесь пожалуйста"
              : PutToBasketButton
              ? "Убрать из корзины"
              : "Положить в корзину"
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
        <h2 className={styles.title}>{card.title}</h2>
        <p className={styles.description}>{card.description}</p>
      </div>
      
      <Link href="/" className={styles.back}>
        <ButtonUI label="Назад" className={styles.buttonBack} />
      </Link>
    </div>
  );
}