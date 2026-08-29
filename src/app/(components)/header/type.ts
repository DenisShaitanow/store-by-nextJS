// type.ts

import { type RegistrationData } from '../../../types';

export type THeaderUIProps = {
  isModal: boolean;
  isAuth: boolean;
  isNotification: boolean;
  user?: RegistrationData;
  theme: 'light' | 'dark';
  //удалить потом
  navItems?: Array<{ label: string; href: string }>;
  handleClickLogout?: () => void;
  onRegisterClick?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  handleCloseButtonClick?: () => void;
};
