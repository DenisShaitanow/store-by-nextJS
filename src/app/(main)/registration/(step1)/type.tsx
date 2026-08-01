import type { ChangeEvent } from "react";

export type PasswordStepProps = {
  email: string;
  password: string;
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorText?: string;
  onClickButton: () => void;
};
