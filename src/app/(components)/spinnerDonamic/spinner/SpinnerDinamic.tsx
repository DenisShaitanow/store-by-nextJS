'use client';

import React from 'react';
import styles from './SpinnerDinamic.module.css';

// Интерфейс для пропсов
interface SpinnerProps {
  size?: number; // Диаметр кружка
  color?: string; // Основной цвет
}

// Компонент Spinner
export const SpinnerDynamic: React.FC<SpinnerProps> = ({ size = 50, color = '#ff6600' }) => {
  const radius = Math.floor(size * 0.4); // Радиус ~ 40%
  const circumference = 2 * Math.PI * radius; // Общая длина окружности

  return (
    <svg
      className={styles.spinner}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      width={`${size}px`}
      height={`${size}px`}
      style={
        {
          '--size': `${size}px`,
          '--border-color': color,
        } as React.CSSProperties
      }
    >
      <circle
        className={styles.spinner_circle}
        cx={`${size / 2}`}
        cy={`${size / 2}`}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={`${Math.max(size * 0.04, 2)}`}
        pathLength={circumference.toFixed()} // Важно!
      />
    </svg>
  );
};
