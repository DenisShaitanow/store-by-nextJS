'use client';

import { useCallback, useState, useEffect } from 'react';
import { BaseDropdown } from '../baseDropdown';
import type { UserDropdownMenuProps } from './types';
import styles from './UserDropdownMenu.module.css';

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  user,
  onPersonalCabinetClick,
  onLogoutClick,
  placement = 'bottom-right',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePersonalCabinetClick = useCallback(() => {
    onPersonalCabinetClick();
    setIsOpen(false);
  }, [onPersonalCabinetClick]);

  const handleLogoutClick = useCallback(() => {
    onLogoutClick();
    setIsOpen(false);
  }, [onLogoutClick]);

  const [avatarError, setAvatarError] = useState(false);

  // Сброс ошибки если изменился URL аватара
  useEffect(() => {
    setAvatarError(false);
  }, [user.avatarUrl]);

  const trigger = (
    <div className={styles.trigger}>
      <span className={styles.userName}>{user.nameUser}</span>
      {user.avatarUrl && !avatarError ? (
        <img
          src={user.avatarUrl}
          alt={`${user.nameUser} avatar`}
          className={styles.avatar}
          onError={() => setAvatarError(true)}
        />
      ) : (
        <div className={styles.avatarPlaceholder}>{user.nameUser.charAt(0).toUpperCase()}</div>
      )}
    </div>
  );

  return (
    <BaseDropdown
      trigger={trigger}
      isOpen={isOpen}
      onToggle={setIsOpen}
      placement={placement}
      disabled={disabled}
      className={className}
      closeOnClickOutside
      closeOnEscape
      aria-label={ariaLabel || `Меню пользователя ${user.nameUser}`}
    >
      <div className={styles.menu}>
        <button className={styles.menuItem} onClick={handlePersonalCabinetClick} type="button">
          Личный кабинет
        </button>

        <button
          className={`${styles.menuItem} ${styles.logoutItem}`}
          onClick={handleLogoutClick}
          type="button"
        >
          <span>Выйти из аккаунта</span>
          <svg
            className={styles.logoutIcon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M8.868 22h.126c4.324 0 6.407-1.704 6.768-5.52a.732.732 0 0 0-.662-.8.745.745 0 0 0-.799.663c-.282 3.057-1.723 4.196-5.316 4.196h-.127c-3.963 0-5.365-1.402-5.365-5.365V8.826c0-3.963 1.402-5.365 5.365-5.365h.127c3.612 0 5.053 1.158 5.316 4.274.049.4.39.701.799.662a.731.731 0 0 0 .671-.788C15.441 3.733 13.347 2 8.994 2h-.126C4.087 2 2.042 4.045 2.042 8.826v6.348C2.042 19.955 4.087 22 8.868 22Z"
            />
            <path
              fill="currentColor"
              d="M9.101 12.73h11.08c.4 0 .731-.331.731-.73 0-.4-.331-.73-.73-.73H9.1c-.4 0-.73.33-.73.73 0 .399.33.73.73.73Z"
            />
            <path
              fill="currentColor"
              d="M18.01 15.992c.185 0 .37-.068.516-.215l3.262-3.261a.735.735 0 0 0 0-1.033l-3.262-3.261a.735.735 0 0 0-1.032 0 .735.735 0 0 0 0 1.032l2.746 2.745-2.746 2.746a.735.735 0 0 0 0 1.033.706.706 0 0 0 .516.214Z"
            />
          </svg>
        </button>
      </div>
    </BaseDropdown>
  );
};
