'use client';
import React from 'react';
import type { ButtonProps } from '../../(components)/button/button/type';
import styles from './ExternalAuthButton.module.css';

interface ExternalAuthButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export const ExternalAuthButton: React.FC<ExternalAuthButtonProps> = ({
  label,
  onClick,
  type = 'button',
  children,
}) => (
  <button type={type} className={styles.button} onClick={onClick}>
    {children}
    {label}
  </button>
);
