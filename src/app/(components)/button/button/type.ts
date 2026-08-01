import type { ReactNode } from "react";

export type ButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  // нужно чтобы отображался svg в кнопке закрыть хидера
  children?: ReactNode;
  icon?: ReactNode;
  dataCy?: string;
};
