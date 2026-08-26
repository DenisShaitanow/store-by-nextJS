'use client';

import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({ onClose }: { onClose: () => void }) => (
  <div className={styles.overlay} onClick={onClose} data-cy="modal-overlay" />
);
