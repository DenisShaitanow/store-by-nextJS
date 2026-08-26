'use client';

import type { FC } from 'react';
import styles from './Logo.module.css';

export const Logo: FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.icon}>
      <svg className={styles.svg} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect className={styles.bg} width="40" height="40" rx="20" />
        <path
          className={styles.symbol}
          d="M20 10C20 10 20.5518 15.1499 22.7009 17.2991C24.8501 19.4482 30 20 30 20C30 20 24.8501 20.5518 22.7009 22.7009C20.5518 24.8501 20 30 20 30C20 30 19.4482 24.8501 17.2991 22.7009C15.1499 20.5518 10 20 10 20C10 20 15.1499 19.4482 17.2991 17.2991C19.4482 15.1499 20 10 20 10Z"
        />
      </svg>
    </div>
    <span className={styles.text}>StoreThings</span>
  </div>
);
