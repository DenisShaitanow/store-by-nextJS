'use client';

import React from 'react';
import styles from './spinner.module.css';

interface SpinnerProps {
  size?: number;
  borderColor?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 50,
  borderColor = '#d1d2d6 #9fa0a5 #626368 #1a1b22',
}) => (
  <div
    className={styles.spinner}
    style={
      {
        '--size': `${size}px`,
        '--border-color': borderColor,
      } as React.CSSProperties
    }
  >
    <div className={styles.spinner_circle} />
  </div>
);
