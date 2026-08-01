import type { ReactNode } from "react";

export interface ExpandableListProps {
  /* Элементы для отображения */
  children: ReactNode[];
  /* Максимальное количество видимых элементов */
  maxVisibleItems?: number;
  /* Текст для кнопки "Показать все" */
  showAllText?: string;
  /* Текст для кнопки "Свернуть" */
  collapseText?: string;
  /* CSS класс для контейнера */
  className?: string;
  /* CSS класс для дополнительных элементов */
  additionalItemsClassName?: string;
  /* CSS класс для дополнительных элементов в expanded состоянии */
  additionalItemsExpandedClassName?: string;
  /* CSS класс для кнопки */
  buttonClassName?: string;
  /* Отключить анимации */
  disableAnimation?: boolean;
  /* Колбэк при изменении состояния (развернуто/свернуто) */
  onToggle?: (isExpanded: boolean) => void;
}
