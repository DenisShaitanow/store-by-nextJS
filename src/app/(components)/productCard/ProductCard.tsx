'use client';

import { memo, useEffect, useState, useRef, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import styles from './ProductCard.module.css';
import type { IProduct } from './type';
import { useAppDispatch } from '../../../services/hooks';
import { toggleLike } from '../../../services/thunks/userUIData/userUIData-thunks';
import Like from '../assets/like.svg';
import RedLike from '../assets/like-red.svg';
/*`../assets/${props.image}`*/

export const ProductCard = forwardRef<HTMLDivElement, IProduct>((props, refCont) => {
  const dispatch = useAppDispatch();
  const [like, setLike] = useState<boolean>(props.isLiked);
  const heartlike = useRef<HTMLSpanElement>(null);
  const router = useRouter();

  function handleClick(evt: React.MouseEvent<HTMLDivElement>) {
    const target = evt.target as HTMLElement;

    if (target.closest(`.${styles.like}`)) {
      return;
    }

    router.push(`/card/${props.id}`);
  }

  function handleLike(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();    
    dispatch(toggleLike(props.id));
    setLike(!like);
    
  }

  return (
    <Link href={`/card/${props.id}`}>
    <div
      ref={refCont}
      onClick={handleClick}
      className={`${styles.container} ${props.className}`}
      id={props.id}
      data-cy={`productCard-${props.id}`}
    >
      <img className={styles.image} src={props.image}></img>
      <p className={styles.price}>{`${props.price}₽`}</p>
      <p className={styles.title}>{props.title}</p>
      <p className={styles.description}>{props.shortDescription}</p>
      {!like ? (
        <Like ref={heartlike} onClick={handleLike} className={styles.like}></Like>
      ) : (
        <RedLike ref={heartlike} onClick={handleLike} className={styles.like}></RedLike>
      )}
    </div>
    </Link>
  );
});
