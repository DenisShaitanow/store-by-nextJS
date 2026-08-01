import { type ChangeEvent } from "react";

export type RevealElementUIProps = {
  visible?: boolean;
  onClick: () => void;
};

export type PasswordInputUIProps = {
  page: "register" | "login";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error?: boolean;
  errorText?: string;
  dataCy?: string;
  largeSize?: boolean; // для использования на странице профиля при нажатии на кнопу "Изменить пароль"
};
