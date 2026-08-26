'use client';

import React, { useState } from 'react';
import clsx from 'classnames';
import styles from './passwordInput.module.css';
import { type PasswordInputUIProps } from './type';
import { RevealElementUI } from './passwordReveal';

export const PasswordInputUI: React.FC<PasswordInputUIProps> = ({
  page,
  onChange,
  value,
  error,
  errorText,
  dataCy,
  largeSize,
}) => {
  const isRegisterPage = page === 'register';
  const isLoginPage = page === 'login';
  const passwordIsTooShort = value.length > 0 && value.length < 8;

  // Состояние для переключения режима видимости
  const [showPassword, setShowPassword] = useState(false);

  // Обработчик клика по иконке переключателя
  const toggleInputVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      className={clsx(styles.container, {
        [styles.container_large]: largeSize,
      })}
    >
      <span className={clsx(styles.title, styles.text)}>Пароль</span>
      <div
        className={clsx(styles.wrapper, {
          [styles.wrapper_error]: (isRegisterPage && passwordIsTooShort) || (isLoginPage && error),
        })}
      >
        <input
          data-cy={dataCy}
          autoComplete="off"
          className={clsx(styles.input, styles.text)}
          type={showPassword ? 'text' : 'password'}
          placeholder={isRegisterPage ? 'Придумайте надежный пароль' : 'Введите ваш пароль'}
          name="password"
          id={`input-password`}
          onChange={onChange}
          value={value}
          maxLength={50}
          size={42}
        />
        <RevealElementUI onClick={toggleInputVisibility} visible={showPassword} />
      </div>
      {isRegisterPage ? (
        <p
          className={clsx(styles.text_tip, {
            [styles.text_error]: passwordIsTooShort,
          })}
        >
          {passwordIsTooShort || value.length === 0
            ? 'Пароль должен состоять не менее, чем из 8 символов'
            : 'Надежный'}
        </p>
      ) : (
        error && (
          <p className={clsx(styles.text, styles.text_tip, styles.text_error)}>{errorText}</p>
        )
      )}
    </div>
  );
};
