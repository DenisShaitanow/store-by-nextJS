"use client";
import React from "react";
import type { ButtonProps } from "../button/type";
import styles from "./ExternalAuthButton.module.css";

interface ExternalAuthButtonProps extends ButtonProps {
  iconUrl: string;
}

export const ExternalAuthButton: React.FC<ExternalAuthButtonProps> = ({
  label,
  onClick,
  type = "button",
  iconUrl,
}) => (
  <button type={type} className={styles.button} onClick={onClick}>
    <img src={iconUrl} alt={label} />
    {label}
  </button>
);
