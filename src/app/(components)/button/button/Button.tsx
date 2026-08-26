'use client';

import styles from './Button.module.css';
import type { ButtonProps } from './type';

export const ButtonUI = ({
  label,
  onClick,
  className,
  type = 'button',
  secondary = false,
  tertiary = false,
  disabled = false,
  children,
  dataCy,
}: ButtonProps) => (
  <button
    data-cy={dataCy}
    type={type}
    disabled={disabled}
    className={[
      styles.button,
      className,
      secondary && styles.secondary,
      tertiary && styles.tertiary,
    ]
      .filter(Boolean)
      .join(' ')}
    onClick={onClick}
  >
    {label}
    {children}
  </button>
);
