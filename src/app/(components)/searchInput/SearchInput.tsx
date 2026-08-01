"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./SearchInput.module.css";

import SearchSvg from "../assets/search.svg?react";
import CrossSvg from "../assets/cross.svg?react";

export interface SkillOption {
  id: string;
  label: string;
}

interface SearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (option: SkillOption) => void;
  options?: SkillOption[];
  className?: string;
  limit?: number;
  caseSensitive?: boolean;
  filter?: (option: SkillOption, input: string) => boolean;
}

export const SearchInput: React.FC<SearchProps> = ({
  placeholder = "Искать навык",
  value,
  onChange,
  onSelect,
  options = [],
  className = "",
  limit = 10,
  caseSensitive = false,
  filter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const idBase = useId();
  const listboxId = `${idBase}-listbox`;

  const norm = useCallback(
    (s: string) => (caseSensitive ? s : s.toLowerCase()),
    [caseSensitive],
  );

  const defaultFilter = useCallback(
    (opt: SkillOption, input: string) =>
      norm(opt.label).startsWith(norm(input)),
    [norm],
  );
  const effectiveFilter = filter ?? defaultFilter;

  const filteredOptions = useMemo(() => {
    if (!value) return options.slice(0, limit);
    const res = options.filter((o) => effectiveFilter(o, value));
    return res.slice(0, limit);
  }, [options, value, effectiveFilter, limit]);

  const isDropdownVisible = isOpen && (filteredOptions.length > 0 || !!value);

  const combineClasses = (...classes: (string | false | null | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  const searchClasses = combineClasses(
    styles.search,
    isDropdownVisible && styles.search_open,
  );
  const wrapperClasses = combineClasses(styles.searchWrapper, className);

  const focusOption = useCallback((idx: number) => {
    const btn = optionRefs.current[idx];
    btn?.focus();
  }, []);

  const handleSelect = useCallback(
    (option: SkillOption) => {
      onChange(option.label);
      onSelect?.(option);
      setIsOpen(false);
      setActiveIdx(-1);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [onChange, onSelect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      setIsOpen(true);
      setActiveIdx(-1);
    },
    [onChange],
  );

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Если дропдаун закрыт — позволяем стандартное поведение
      if (!isDropdownVisible) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredOptions.length) {
          setIsOpen(true);
          const next =
            activeIdx >= 0
              ? Math.min(activeIdx + 1, filteredOptions.length - 1)
              : 0;
          setActiveIdx(next);
          requestAnimationFrame(() => focusOption(next));
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredOptions.length) {
          // Если мы ещё в инпуте (activeIdx === -1), переходим на последнюю опцию
          const prev =
            activeIdx >= 0
              ? Math.max(activeIdx - 1, 0)
              : filteredOptions.length - 1;
          setIsOpen(true);
          setActiveIdx(prev);
          requestAnimationFrame(() => focusOption(prev));
        }
        return;
      }

      if (e.key === "Enter") {
        if (activeIdx >= 0 && activeIdx < filteredOptions.length) {
          e.preventDefault();
          handleSelect(filteredOptions[activeIdx]);
        } else {
          // Выбрать произвольный ввод
          if (value.trim()) {
            onSelect?.({ id: value, label: value });
          }
          setIsOpen(false);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setActiveIdx(-1);
        return;
      }

      if (e.key === "Tab") {
        setIsOpen(false);
        setActiveIdx(-1);
        return;
      }
    },
    [
      isDropdownVisible,
      filteredOptions,
      activeIdx,
      handleSelect,
      focusOption,
      value,
      onSelect,
    ],
  );

  const onOptionKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(idx + 1, filteredOptions.length - 1);
        if (next !== idx) {
          setActiveIdx(next);
          requestAnimationFrame(() => focusOption(next));
        }
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) {
          const prev = idx - 1;
          setActiveIdx(prev);
          requestAnimationFrame(() => focusOption(prev));
        } else {
          setActiveIdx(-1);
          inputRef.current?.focus();
        }
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(filteredOptions[idx]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        setActiveIdx(-1);
        inputRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        setIsOpen(false);
        setActiveIdx(-1);
        return;
      }
    },
    [filteredOptions, handleSelect, focusOption],
  );

  // Закрытие по клику вне
  useEffect(() => {
    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !inputRef.current?.contains(target) &&
        !listRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  // Прокрутка к активной опции
  useEffect(() => {
    if (activeIdx < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx='${activeIdx}']`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const showEmpty = !!value && filteredOptions.length === 0;

  return (
    <div className={wrapperClasses}>
      <div className={searchClasses} onFocus={() => setIsOpen(true)}>
        <SearchSvg className={styles.search__icon} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={onInputKeyDown}
          className={styles.search__input}
          aria-autocomplete="list"
          aria-expanded={!!isDropdownVisible}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={
            activeIdx >= 0
              ? `${idBase}-option-${filteredOptions[activeIdx].id}`
              : undefined
          }
          role="combobox"
        />
        {value && (
          <button
            type="button"
            aria-label="Очистить"
            onClick={() => {
              onChange("");
              setIsOpen(true);
              setActiveIdx(-1);
              inputRef.current?.focus();
            }}
            className={styles.iconButton}
          >
            <CrossSvg className={styles.search__clear} />
          </button>
        )}
      </div>

      {isDropdownVisible && (
        <ul
          id={listboxId}
          className={styles.dropdown}
          role="listbox"
          ref={listRef}
        >
          {!showEmpty &&
            filteredOptions.map((option, idx) => {
              const optionId = `${idBase}-option-${option.id}`;
              const isActive = idx === activeIdx;
              return (
                <li key={option.id} role="presentation">
                  <button
                    type="button"
                    id={optionId}
                    role="option"
                    aria-selected={isActive}
                    data-idx={idx}
                    className={styles.dropdownItem}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => onOptionKeyDown(e, idx)}
                    ref={(el) => {
                      optionRefs.current[idx] = el ?? null;
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          {showEmpty && <li className={styles.dropdownEmpty}>Не найдено</li>}
        </ul>
      )}
    </div>
  );
};
