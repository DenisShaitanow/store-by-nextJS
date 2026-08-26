'use client';

import { useRef, type FC, useState } from 'react';
import type { DragEvent } from 'react';
import type { AddImagesForSkillsProps } from './type';
import styles from './addImagesForSkills.module.css'; // Подключаем стили

export const AddImagesForSkills: FC<AddImagesForSkillsProps> = ({ onImagesChange }) => {
  const inputHidden = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Получаем целевое DOM-элемент события
    const target = event.target as HTMLElement;

    // Если целевой элемент — фотография, прекращаем выполнение
    if (target.classList.contains(styles.image)) {
      return;
    }

    // Активируем скрытый input только если клик произошел не на самом изображении
    if (inputHidden.current !== null) {
      inputHidden.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files || [];

    // Проверяем общее количество файлов (текущие + новые)
    if (newFiles.length > 0 && images.length + newFiles.length <= 5) {
      let updatedImages = [...images, ...Array.from(newFiles)];
      if (updatedImages.length > 5) {
        updatedImages = updatedImages.slice(0, 5); // Оставляем только первые 5 файлов
      }
      setImages(updatedImages);
      onImagesChange && onImagesChange(updatedImages); // Сообщаем родителю (Форме) о новом состоянии
    }
  };

  // Функция обработки события Drop (перетаскивание)
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer?.files || [];

    // Формируем полный массив (старые + новые файлы)
    let updatedImages = [...images, ...Array.from(droppedFiles)];

    // Ограничиваем длину до 5, если получилось больше
    if (updatedImages.length > 5) {
      updatedImages = updatedImages.slice(0, 5); // Оставляем только первые 5 файлов
    }

    // Сохраняем новое состояние
    setImages(updatedImages);
    onImagesChange && onImagesChange(updatedImages); // Сообщаем родителю (Форме) о новом состоянии
  };

  // Отмена стандартного поведения браузера при dragover
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Обработка удаления одной фотографии нажатием на крестик
  const handleDelete = (event: React.MouseEvent<HTMLSpanElement>, key: number) => {
    event.stopPropagation();
    setImages(images.filter((_, index) => index !== key));
  };

  return images.length > 0 ? (
    <div
      className={`${styles.container} ${styles.directionRow}`}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        className={styles.input}
        ref={inputHidden}
        id="inputHidden"
        data-cy="inputHiddenImagesForSkills"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      {images.map((img, index) => (
        <div key={index} className={styles.imagePreview}>
          <img
            className={styles.image}
            src={URL.createObjectURL(img)}
            alt={`Uploaded image ${index}`}
          />
          <span
            className={styles.imagePreviewDelete}
            onClick={(event) => handleDelete(event, index)}
          />
        </div>
      ))}
      <p className={styles.notMany}>Не более 5 картинок</p>
    </div>
  ) : (
    <div
      className={styles.container}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h4 className={styles.title}>Перетащите или выберите изображения навыка</h4>
      <input
        className={styles.input}
        ref={inputHidden}
        id="inputHidden"
        data-cy="inputHiddenImagesForSkills"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <div className={styles.selectImage}>
        <span className={styles.icon} />
        <p className={styles.inputText}>Выбрать изображения</p>
      </div>
    </div>
  );
};
