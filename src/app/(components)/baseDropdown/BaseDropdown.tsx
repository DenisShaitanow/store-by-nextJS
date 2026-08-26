'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import classNames from 'classnames';
import type { BaseDropdownProps } from './types';
import styles from './BaseDropdown.module.css';

export const BaseDropdown = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  placement = 'bottom-left',
  offset = 4,
  closeOnClickOutside = true,
  closeOnEscape = true,
  disabled = false,
  className,
  dropdownClassName,
  'aria-label': ariaLabel,
}: BaseDropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(
    (newIsOpen: boolean) => {
      if (disabled) return;

      if (onToggle) {
        onToggle(newIsOpen);
      } else {
        setInternalIsOpen(newIsOpen);
      }
    },
    [disabled, onToggle]
  );

  const handleTriggerClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      handleToggle(!isOpen);
    },
    [isOpen, handleToggle]
  );

  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle(!isOpen);
      } else if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        handleToggle(false);
      }
    },
    [isOpen, handleToggle]
  );

  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;

    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, closeOnClickOutside]);

  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: Event) => {
      const keyboardEvent = event as globalThis.KeyboardEvent;
      if (keyboardEvent.key === 'Escape') {
        handleToggle(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, closeOnEscape]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const focusable = dropdownRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      focusable?.focus();
    }
  }, [isOpen]);

  const containerClasses = useMemo(
    () =>
      classNames(
        styles.container,
        {
          [styles.disabled]: disabled,
        },
        className
      ),
    [disabled, className]
  );

  const dropdownClasses = useMemo(
    () =>
      classNames(
        styles.dropdown,
        styles[`placement-${placement}`],
        {
          [styles.open]: isOpen,
        },
        dropdownClassName
      ),
    [placement, isOpen, dropdownClassName]
  );

  const dropdownStyle = useMemo(
    () =>
      ({
        '--dropdown-offset': `${offset}px`,
      }) as React.CSSProperties,
    [offset]
  );

  return (
    <div ref={containerRef} className={containerClasses} data-testid="base-dropdown-container">
      <div
        className={styles.trigger}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        data-testid="base-dropdown-trigger"
      >
        {trigger}
      </div>

      <div
        ref={dropdownRef}
        className={dropdownClasses}
        style={dropdownStyle}
        role="menu"
        aria-hidden={!isOpen}
        data-testid="base-dropdown-content"
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
