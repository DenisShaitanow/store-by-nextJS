'use client';

import React from 'react';
import styles from './SpinnerPulse.module.css';

interface IProps {
  className?: string;
}

// Компонент Spinner
export const SpinnerPulse: React.FC<IProps> = ({ className }) => {
  return (
    <svg
      className={`${styles.preloader} ${className}`}
      width="40"
      height="40"
      viewBox="22 22 44 44"
      id="root-preloader"
    >
      <g className={styles['g-container']}>
        <circle
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          strokeWidth="3.6"
          stroke="var(--color-primary, #abd27a)"
          className={styles.circle}
        />
      </g>
    </svg>
  );
};
