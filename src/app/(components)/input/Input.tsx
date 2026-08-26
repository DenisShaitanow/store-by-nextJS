'use client';

import { type FC, useState, useRef } from 'react';
import clsx from 'classnames';
import styles from './Input.module.css';
import { type InputUIProps } from './type';

export const InputUI: FC<InputUIProps> = ({
  title,
  type,
  placeholder,
  name,
  onChange,
  value,
  error,
  errorText,
  halfSize,
  largeSize,
  withEditButton,
  dataCy,
}) => {
  // Состояние для переключения режима readonly
  const [readonlyMode, setReadonlyMode] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Обработчик клика по иконке редактирования
  const onClick = () => {
    setReadonlyMode(!readonlyMode);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div
      className={clsx(styles.container, {
        [styles.container_with_button]: withEditButton,
        [styles.container_half]: halfSize,
        [styles.container_large_half]: largeSize && halfSize,
      })}
    >
      <span className={clsx(styles.title, styles.text)}>{title}</span>
      <div
        className={clsx(styles.wrapper, {
          [styles.wrapper_with_button]: withEditButton,
          [styles.wrapper_error]: error,
        })}
      >
        <input
          data-cy={dataCy}
          className={clsx(styles.input, styles.text)}
          type={type}
          placeholder={placeholder}
          name={name}
          id={`input-${title}`}
          onChange={onChange}
          value={value}
          maxLength={50}
          size={halfSize ? 10 : 42}
          readOnly={withEditButton ? readonlyMode : false}
          ref={inputRef}
        />
        <button
          className={clsx(styles.button, {
            [styles.button_visible]: withEditButton,
          })}
          type="button"
          onClick={onClick}
        />
      </div>
      {error && <p className={styles.text_error}>{errorText}</p>}
    </div>
  );
};
