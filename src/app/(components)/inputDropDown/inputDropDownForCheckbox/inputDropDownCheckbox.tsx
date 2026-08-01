"use client";

import type { FC, ChangeEvent } from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./inputDropDownCheckbox.module.css";
import type { InputDropDownForCheckboxProps } from "./type";
import { CheckboxGroupUI } from "../../checkbox/CheckboxGroup";

interface CategoryItem {
  value: string;
  label: string;
}

interface Category extends CategoryItem {
  children?: Array<Category | CategoryItem>;
}

type CategoriesTree = Array<Category>;

const findValueByLabel = (
  categories: CategoriesTree,
  labelToFind: string,
): string | undefined => {
  for (let category of categories) {
    if (category.label === labelToFind) return category.value;

    // Проверяем наличие дочерних элементов
    if (Array.isArray(category.children)) {
      const foundInChildren = findValueByLabel(category.children, labelToFind);
      if (foundInChildren !== undefined) return foundInChildren;
    }
  }
};

export const InputDropDownForCheckbox: FC<InputDropDownForCheckboxProps> = ({
  options,
  onChangeOption,
  className = "",
  id,
  title,
  value,
  placeholder,
  error,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectLabel, setSelectLabel] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      const foundOption = options.find((opt) => opt.value === value);
      if (foundOption) {
        setSelectLabel(foundOption.label);
        setSelectedValue([foundOption.value]);
      }
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  const optionsFotCheckboxUI = options.map((option) => option.label);

  const [isOpen, setIsOpen] = useState(false);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    if (target.checked) {
      const fakeEvent: React.ChangeEvent<HTMLInputElement> = {
        target: {
          name: id, // Имя поля совпадает с ID компонента
          value: findValueByLabel(options, e.target.id), // Значение выбираемого варианта
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>; // Приведение типа
      setSelectLabel(target.id);
      onChangeOption(fakeEvent);
      setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  return (
    <>
      <div ref={containerRef} className={`${styles.container} ${className}`}>
        <label htmlFor={id}>{title}</label>
        <div className={`${isOpen ? styles.borderDone : ""}`}>
          <div
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className={`${styles.select}${isOpen ? ` ${styles.selectOpen}` : ``}${selectLabel ? ` ${styles.selectDone}` : ``}`}
          >
            {`${selectLabel || placeholder}`}
          </div>
          {isOpen && (
            <div
              className={`${isOpen ? `${styles.optionsContainerOpen} ${styles.optionsContainer}` : styles.optionsContainer}`}
            >
              <CheckboxGroupUI
                fieldNames={optionsFotCheckboxUI as string[]}
                selectedItems={[selectLabel]}
                onChange={handleOnChange}
              />
            </div>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </>
  );
};
