"use client";


import type { FC } from "react";
import styles from "./ProductCardInBasket.module.css";
import type { Props } from "./type";
import { useAppDispatch } from "../../../services/hooks";
import Delete from "../assets/delete.svg";
import {
  changeBasket,
} from "../../../services/thunks/userUIData/userUIData-thunks";
import { OperationBasket } from '../../../services/api';
/*`../assets/${props.image}`*/

const ProductCardInBasket: FC<Props> = ({ card, count }) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(changeBasket({product: card, operation: "DELETE"}));
  };

  const handlePlus = () => {
    dispatch(changeBasket({product: card, operation: "ADD"}));
  };

  const handleMin = () => {
    dispatch(changeBasket({product: card, operation: "SUBTRACT"}));
  };

  return (
    <div
      className={`${styles.container}`}
      id={card.id}
      data-cy={`productCard-${card.id}`}
    >
      <img className={styles.image} src={card.image}></img>
      <div className={styles.info}>
        <p className={styles.price}>{`${card.price}₽`}</p>
        <p className={styles.description}>{card.shortDescription}</p>
        <Delete
          data-cy={"buttonDeleteProductFromBasket"}
          className={styles.delete}
          onClick={handleDelete}
        />
      </div>
      <div className={styles.countContainer}>
        <button className={styles.countChange} onClick={handlePlus}>
          +
        </button>
        <span className={styles.count}>{count}</span>
        <button className={styles.countChange} onClick={handleMin}>
          <span className={styles.spanMin}>-</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCardInBasket;
