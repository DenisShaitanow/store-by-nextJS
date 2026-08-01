import type { PlacementType } from "../baseDropdown/types";

export interface UserDropdownMenuProps {
  /* Данные пользователя */
  user: {
    nameUser: string;
    avatarUrl?: string;
  };
  /* колбэк при клике на "Личный кабинет" */
  onPersonalCabinetClick: () => void;
  /* колбэк при клике на "Выйти из аккаунта" */
  onLogoutClick: () => void;
  /* Позиционирование dropdown относительно триггера @default 'bottom-right' */
  placement?: PlacementType;
  /* Отключен ли dropdown @default false */
  disabled?: boolean;
  /* CSS класс для container */
  className?: string;
  /* Aria-label для accessibility */
  "aria-label"?: string;
}
