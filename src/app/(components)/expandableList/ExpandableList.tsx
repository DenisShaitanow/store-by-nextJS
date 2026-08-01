"use client";

import { useState, useCallback } from "react";
import classNames from "classnames";
import type { ExpandableListProps } from "./types";
import styles from "./ExpandableList.module.css";

export const ExpandableList: React.FC<ExpandableListProps> = ({
  children,
  maxVisibleItems = 3,
  showAllText = "Показать все",
  collapseText = "Свернуть",
  className,
  additionalItemsClassName,
  additionalItemsExpandedClassName,
  buttonClassName,
  disableAnimation = false,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  }, [isExpanded, onToggle]);

  // Если элементов меньше или равно максимальному количеству, не показываем кнопку
  if (children.length <= maxVisibleItems) {
    return (
      <div className={classNames(styles.container, className)}>{children}</div>
    );
  }

  const visibleItems = children.slice(0, maxVisibleItems);
  const hiddenItems = children.slice(maxVisibleItems);

  return (
    <div className={classNames(styles.container, className)}>
      {/* Всегда видимые элементы */}
      {visibleItems}

      {/* Дополнительные элементы с анимацией */}
      <div
        className={classNames(
          additionalItemsClassName || styles.additionalItems,
          {
            // Используем переданный expanded класс или дефолтный
            ...(additionalItemsExpandedClassName &&
              isExpanded && {
                [additionalItemsExpandedClassName]: true,
              }),
            [styles.additionalItems_expanded]:
              isExpanded && !additionalItemsExpandedClassName,
            [styles.additionalItems_noAnimation]: disableAnimation,
          },
        )}
      >
        {hiddenItems}
      </div>

      {/* Кнопка показать все/свернуть */}
      <button
        type="button"
        className={buttonClassName || styles.toggleButton}
        onClick={handleToggle}
      >
        <span className={buttonClassName ? undefined : styles.toggleText}>
          {isExpanded ? collapseText : showAllText}
        </span>
        <svg
          className={classNames(
            buttonClassName ? styles.showAllIcon : styles.toggleIcon,
            {
              [styles.showAllIcon_expanded]: isExpanded && buttonClassName,
              [styles.toggleIcon_expanded]: isExpanded && !buttonClassName,
            },
          )}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
