export interface CheckboxOption {
  /* Уникальное значение опции */
  value: string | number;
  /* Отображаемый текст */
  label: string;
  /* Отключена ли опция */
  disabled?: boolean;
  /* Дочерние опции для древовидной структуры */
  children?: CheckboxOption[];
}

export interface CheckboxDropdownProps {
  /* Список опций для выбора */
  options: CheckboxOption[] | string[];
  /* Выбранные значения (controlled режим) */
  selectedValues?: (string | number)[];
  /* Значения по умолчанию (uncontrolled режим) */
  defaultSelectedValues?: (string | number)[];
  /* Колбэк при изменении выбранных значений */
  onChange?: (selectedValues: (string | number)[]) => void;
  /* Плейсхолдер для trigger кнопки */
  placeholder?: string;
  /* Заголовок для группы чекбоксов */
  title?: string;
  /* Включить ли поиск по опциям */
  enableSearch?: boolean;
  /* Плейсхолдер для поля поиска */
  searchPlaceholder?: string;
  /* Древовидный режим с подкатегориями */
  treeMode?: boolean;
  /* Максимальное количество видимых опций */
  maxVisibleOptions?: number;
  /* Текст для кнопки "Показать все" */
  showAllText?: string;
  /* Текст для кнопки Свернуть */
  collapseText?: string;
  /* Статичный режим без BaseDropdown (для фильтров) */
  staticMode?: boolean;
  /* Отключен ли компонент */
  disabled?: boolean;
  /* CSS класс для контейнера */
  className?: string;
  /* CSS класс для dropdown */
  dropdownClassName?: string;
  /* CSS класс для trigger */
  triggerClassName?: string;
  /* Позиционирование dropdown */
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  /* Отступ от триггера */
  offset?: number;
  /* Закрытие при клике вне области */
  closeOnClickOutside?: boolean;
  /* Закрытие при нажатии Escape */
  closeOnEscape?: boolean;
  /* Aria-label для accessibility */
  "aria-label"?: string;
}
