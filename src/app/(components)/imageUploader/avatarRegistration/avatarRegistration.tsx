"use client";

import { useRef, type FC, useState } from "react";
import styles from "./avatarRegistration.module.css"; // Подключаем стили
import type { AvatarRegistrationProps } from "./type";

// Компонент AvatarRegistration
export const AvatarRegistration: FC<AvatarRegistrationProps> = ({
  onImageChange,
}) => {
  // стейт для файла авы
  const [avatarForForm, setAvatarForForm] = useState<File | null>(null);

  // стейт для адерса картинки
  // если переменная пустая, будет свг картинка, если есть адрес, появится картинка
  const [srcAvatar, setSrcAvatar] = useState<string | null>(null);

  const inputHidden = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (inputHidden.current !== null) {
      inputHidden.current.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;

    if (!inputFiles || !inputFiles.length) return; // Проверяем наличие файлов

    const newAvatar = inputFiles[0];

    if (newAvatar) {
      const src = URL.createObjectURL(newAvatar);
      setSrcAvatar(src);
      setAvatarForForm(newAvatar);
      onImageChange(event);
    }
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      {/* Поле для загрузки аватара */}
      <input
        ref={inputHidden}
        id="inputHidden"
        data-cy="inputHidden"
        type="file"
        className={styles.inputAvatar}
        accept="image/*"
        onChange={handleChange}
      />
      {srcAvatar ? (
        <img src={srcAvatar} className={styles.avatar} />
      ) : (
        <span className={styles.svgContainer} />
      )}
      <span className={styles.greenAdd} />
    </div>
  );
};
