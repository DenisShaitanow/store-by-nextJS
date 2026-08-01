"use client";

import { useState, useCallback, useMemo } from "react";
import type { ChangeEvent } from "react";
import classNames from "classnames";
import { BaseDropdown } from "../baseDropdown";
import { SearchInput } from "../searchInput";
import { CheckboxGroupUI } from "../checkbox";
import { ExpandableList } from "../expandableList";
import type { CheckboxDropdownProps, CheckboxOption } from "./types";
import styles from "./CheckboxDropdown.module.css";

export const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({
  options,
  selectedValues: controlledSelectedValues,
  defaultSelectedValues = [],
  onChange,
  placeholder = "Выберите опции",
  title,
  enableSearch = false,
  searchPlaceholder = "Поиск...",
  treeMode = false,
  maxVisibleOptions = 3,
  showAllText = "Показать все",
  collapseText = "Свернуть",
  staticMode = false,
  disabled = false,
  className,
  dropdownClassName,
  triggerClassName,
  placement = "bottom-left",
  offset = 4,
  closeOnClickOutside = true,
  closeOnEscape = true,
  "aria-label": ariaLabel,
}) => {
  const [internalSelectedValues, setInternalSelectedValues] = useState<
    (string | number)[]
  >(defaultSelectedValues);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Set<string | number>
  >(new Set());

  const selectedValues = controlledSelectedValues ?? internalSelectedValues;

  // Нормализация опций - преобразование строк в CheckboxOption
  const normalizedOptions = useMemo(
    (): CheckboxOption[] =>
      options.map((option, index) => {
        if (typeof option === "string") {
          return { value: index, label: option };
        }
        return option;
      }),
    [options],
  );

  // Получение всех потомков для древовидной структуры
  const getAllChildren = useCallback(
    (option: CheckboxOption): (string | number)[] =>
      option.children
        ? option.children.flatMap(getAllChildren)
        : [option.value],
    [],
  );

  // Фильтрация опций по поиску
  const filteredOptions = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) return normalizedOptions;
    const query = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [normalizedOptions, searchQuery, enableSearch]);

  // Переключение раскрытия категории
  const toggleCategory = useCallback((categoryValue: string | number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(categoryValue)
        ? next.delete(categoryValue)
        : next.add(categoryValue);
      return next;
    });
  }, []);

  // Получение состояния чекбокса для древовидной структуры
  const getCheckboxState = useCallback(
    (option: CheckboxOption) => {
      if (!treeMode || !option.children) {
        return selectedValues.includes(option.value) ? "checked" : "unchecked";
      }

      const childValues = getAllChildren(option);
      const selectedCount = childValues.filter((v) =>
        selectedValues.includes(v),
      ).length;

      return selectedCount === 0
        ? "unchecked"
        : selectedCount === childValues.length
          ? "checked"
          : "indeterminate";
    },
    [selectedValues, treeMode, getAllChildren],
  );

  // Обработчик изменения чекбоксов
  const handleCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const label = e.target.id; // CheckboxUI использует label как id
      const isChecked = e.target.checked;

      // Найти соответствующую опцию по label
      const option = filteredOptions.find((opt) => opt.label === label);
      if (!option) return;

      const newSelectedValues = isChecked
        ? [...selectedValues, option.value]
        : selectedValues.filter((v) => v !== option.value);

      if (controlledSelectedValues === undefined) {
        setInternalSelectedValues(newSelectedValues);
      }
      onChange?.(newSelectedValues);
    },
    [selectedValues, controlledSelectedValues, onChange, filteredOptions],
  );

  // Обработчик для древовидной структуры
  const handleTreeOptionToggle = useCallback(
    (option: CheckboxOption) => {
      const newSelectedValues =
        treeMode && option.children
          ? (() => {
              const childValues = getAllChildren(option);
              const allSelected = childValues.every((v) =>
                selectedValues.includes(v),
              );
              return allSelected
                ? selectedValues.filter((v) => !childValues.includes(v))
                : [...new Set([...selectedValues, ...childValues])];
            })()
          : selectedValues.includes(option.value)
            ? selectedValues.filter((value) => value !== option.value)
            : [...selectedValues, option.value];

      if (controlledSelectedValues === undefined) {
        setInternalSelectedValues(newSelectedValues);
      }
      onChange?.(newSelectedValues);
    },
    [
      selectedValues,
      controlledSelectedValues,
      onChange,
      treeMode,
      getAllChildren,
    ],
  );

  // Обработчик поиска
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Рендеринг одной опции древовидной структуры
  const renderTreeOption = useCallback(
    (option: CheckboxOption, level: number): React.ReactNode => {
      const state = getCheckboxState(option);
      const isDisabled = disabled || option.disabled;
      const isExpanded = expandedCategories.has(option.value);
      const hasChildren = treeMode && option.children?.length;

      return (
        <div key={option.value}>
          <div
            className={classNames(styles.optionRow, {
              [styles.optionRow_child]: level > 0,
              [styles.optionRow_hasChildren]: hasChildren,
              [styles.optionRow_expanded]: hasChildren && isExpanded,
            })}
          >
            <div className={styles.checkboxContainer}>
              <input
                id={`checkbox-${option.value}-${level}`}
                type="checkbox"
                className={styles.checkboxInput}
                checked={state === "checked"}
                ref={(el) => {
                  if (el) el.indeterminate = state === "indeterminate";
                }}
                disabled={isDisabled}
                onChange={() => !isDisabled && handleTreeOptionToggle(option)}
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor={`checkbox-${option.value}-${level}`}
                className={classNames(styles.checkboxIcon, {
                  [styles.checkboxIcon_indeterminate]:
                    state === "indeterminate",
                })}
              />
            </div>

            <div
              className={classNames(styles.labelContainer, {
                [styles.labelContainer_disabled]: isDisabled,
                [styles.labelContainer_clickable]: hasChildren || !isDisabled,
              })}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  if (hasChildren) {
                    // Если есть дочерние элементы - раскрыть/свернуть
                    toggleCategory(option.value);
                  } else {
                    // Если нет дочерних элементов - выбрать чекбокс
                    handleTreeOptionToggle(option);
                  }
                }
              }}
            >
              <span className={styles.checkboxText}>{option.label}</span>
            </div>

            {hasChildren && (
              <div
                className={classNames(styles.expandArrow, {
                  [styles.expandArrow_expanded]: isExpanded,
                })}
              />
            )}
          </div>

          {hasChildren && (
            <div
              className={classNames(styles.childrenContainer, {
                [styles.childrenContainer_expanded]: isExpanded,
              })}
            >
              {option.children!.map((child) =>
                renderTreeOption(child, level + 1),
              )}
            </div>
          )}
        </div>
      );
    },
    [
      getCheckboxState,
      disabled,
      expandedCategories,
      treeMode,
      handleTreeOptionToggle,
      toggleCategory,
    ],
  );

  // Контент компонента
  const content = (
    <div className={styles.content}>
      {enableSearch && (
        <div className={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className={styles.searchInput}
          />
        </div>
      )}

      <div className={styles.optionsList}>
        {filteredOptions.length === 0 ? (
          <div className={styles.noOptions}>
            {enableSearch && searchQuery
              ? "Ничего не найдено"
              : "Нет доступных опций"}
          </div>
        ) : (
          <>
            {treeMode ? (
              // Древовидная структура - используем ExpandableList
              <div className={styles.treeContainer}>
                <ExpandableList
                  maxVisibleItems={maxVisibleOptions}
                  showAllText={showAllText}
                  collapseText={collapseText}
                  additionalItemsClassName={styles.additionalOptions}
                  additionalItemsExpandedClassName={
                    styles.additionalOptions_show
                  }
                  buttonClassName={styles.showAllButton}
                >
                  {filteredOptions.map((option) => renderTreeOption(option, 0))}
                </ExpandableList>
              </div>
            ) : (
              // Простой список - используем CheckboxGroup с ExpandableList
              <ExpandableList
                maxVisibleItems={maxVisibleOptions}
                showAllText={showAllText}
                collapseText={collapseText}
                additionalItemsClassName={styles.additionalOptions}
                additionalItemsExpandedClassName={styles.additionalOptions_show}
                buttonClassName={styles.showAllButton}
              >
                {filteredOptions.map((option, index) => (
                  <div key={option.value} className={`${styles.option}`}>
                    <CheckboxGroupUI
                      fieldNames={[option.label]}
                      selectedItems={
                        selectedValues.includes(option.value)
                          ? [option.label]
                          : []
                      }
                      onChange={handleCheckboxChange}
                      withInDropdown={!staticMode}
                    />
                  </div>
                ))}
              </ExpandableList>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Статичный режим для фильтров
  if (staticMode) {
    return (
      <div className={classNames(styles.staticContainer, className)}>
        {title && <h3 className={styles.staticTitle}>{title}</h3>}
        {content}
      </div>
    );
  }

  // Обычный режим с dropdown
  return (
    <BaseDropdown
      trigger={
        <div
          className={classNames(styles.trigger, triggerClassName, {
            [styles.trigger_disabled]: disabled,
            [styles.trigger_open]: isOpen,
            [styles.trigger_has_selection]: selectedValues.length > 0,
          })}
        >
          <span className={styles.triggerText}>{placeholder}</span>
          <svg
            className={classNames(styles.chevron, {
              [styles.chevron_open]: isOpen,
            })}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      }
      isOpen={isOpen}
      onToggle={setIsOpen}
      placement={placement}
      offset={offset}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      disabled={disabled}
      className={className}
      dropdownClassName={classNames(styles.dropdown, dropdownClassName)}
      aria-label={ariaLabel || "Выпадающий список с множественным выбором"}
    >
      {content}
    </BaseDropdown>
  );
};
