import { type ChangeEvent } from "react";

export type CheckboxUIProps = {
  label: string;
  isChecked?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  largeHeight?: boolean; // для использования в компоненте выбора города
};

export type CheckboxGroupUIProps = {
  title?: string;
  fieldNames: string[];
  selectedItems?: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  largeHeight?: boolean; // для использования в компоненте выбора города
  withInDropdown?: boolean; // для использования в выпадающем меню
};
