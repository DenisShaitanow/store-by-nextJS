"use client";

import clsx from "classnames";
import styles from "./CheckboxGroup.module.css";
import { type CheckboxUIProps, type CheckboxGroupUIProps } from "./type";

const CheckboxUI: React.FC<CheckboxUIProps> = ({
  label,
  isChecked = false,
  onChange,
  largeHeight,
}) => (
  <label
    htmlFor={label}
    className={clsx(styles.label, {
      [styles.label_large_height]: largeHeight,
    })}
  >
    <input
      className={styles.input}
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      id={label}
    />
    <span className={styles.icon} />
    <span className={styles.text}>{label}</span>
  </label>
);

export const CheckboxGroupUI: React.FC<CheckboxGroupUIProps> = ({
  title,
  fieldNames,
  selectedItems = [],
  onChange,
  largeHeight,
  withInDropdown,
}) => (
  <div className={styles.container}>
    {title && <p className={clsx(styles.title)}>{title}</p>}
    <div
      className={clsx(styles.list, {
        [styles.list_with_dropdown]: withInDropdown,
      })}
    >
      {fieldNames.map((label) => (
        <CheckboxUI
          key={label}
          label={label}
          isChecked={selectedItems.includes(label)}
          onChange={onChange}
          largeHeight={largeHeight || withInDropdown}
        />
      ))}
    </div>
  </div>
);
