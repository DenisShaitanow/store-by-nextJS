import type { ReactNode } from "react";

export type PlacementType =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface BaseDropdownProps {
  /** Элемент-триггер по клику, на который открывается dropdown */
  trigger: ReactNode;
  /** Контент dropdown */
  children: ReactNode;
  /** Контролируемое состояние открыт/закрыт */
  isOpen?: boolean;
  /** Callback при изменении состояния открыт/закрыт */
  onToggle?: (isOpen: boolean) => void;
  /** Позиционирование dropdown относительно триггера @default 'bottom-left' */
  placement?: PlacementType;
  /** Отступ от триггера в пикселях @default 4 */
  offset?: number;
  /** Закрывать ли dropdown при клике вне области @default true */
  closeOnClickOutside?: boolean;
  /** Закрывать ли dropdown при нажатии Escape @default true */
  closeOnEscape?: boolean;
  /** Отключен ли dropdown @default false */
  disabled?: boolean;
  /** CSS класс для container */
  className?: string;
  /** CSS класс для dropdown */
  dropdownClassName?: string;
  /** Aria-label для accessibility */
  "aria-label"?: string;
}
