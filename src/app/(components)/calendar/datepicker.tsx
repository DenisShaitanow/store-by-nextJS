"use client";

import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { type Locale } from "date-fns";
import * as ruLocale from "date-fns/locale/ru";
import chevronDownUrl from "../assets/chevron-down.svg";

import "./calendar.css";

//Русская локаль для react-datepicker.

const ru = ((ruLocale as any)?.default ?? ruLocale) as Locale;
registerLocale("ru", ru);
setDefaultLocale("ru");

type Props = {
  inline?: boolean;
  id?: string;
  className?: string;
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  onClickOutside?: (event: Event) => void;
};

const formatWeekDay = (name: string) => {
  const map: Record<string, string> = {
    пн: "Пн",
    вт: "Вт",
    ср: "Ср",
    чт: "Чт",
    пт: "Пт",
    сб: "Сб",
    вс: "Вс",
  };
  const key = name.slice(0, 2).toLowerCase();
  return map[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
};

// Основной компонент календаря.
// Логика: пользователь кликает даты внутри календаря (value),
// подтверждает или отменяет в футере, а наружу отдаём через onChange.

export const SimpleDatePicker = ({
  inline = true,
  id,
  className,
  selected = null,
  onChange,
  onClickOutside,
}: Props) => {
  const [value, setValue] = useState<Date | null>(selected);

  const [visibleDate, setVisibleDate] = useState<Date>(selected ?? new Date());

  const initialSelectedRef = useRef<Date | null>(selected ?? null);

  // Синхронизация, когда проп selected изменился извне.
  useEffect(() => {
    setValue(selected ?? null);
    setVisibleDate(selected ?? new Date());
    initialSelectedRef.current = selected ?? null;
  }, [selected]);

  useEffect(() => {
    console.log(value);
  }, [value]);

  // Обновляем только локальное состояние .
  const handleChange = (d: Date | null) => {
    setValue(d);
  };

  // Пробрасываем наружу факт клика по дню (без подтверждения).
  /*const handleSelect = (d: Date | null) => {
        setValue(d);
    };*/

  // Кнопка "Отменить": откат к последней подтверждённой дате и уведомление наружу.
  const handleCancel = () => {
    const base = initialSelectedRef.current ?? null;
    setValue(base);
    onChange?.(base);
  };

  // Кнопка "Выбрать": подтверждаем текущий черновик и уведомляем наружу.
  const handleApply = () => {
    onChange?.(value ?? null);
  };

  // Состояние дропдаунов в заголовке.
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  // Данные для дропдаунов: список месяцев и диапазон годов (c 1900).
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("ru-RU", { month: "long" }),
  );
  const getYears = (from = 1900, to = new Date().getFullYear()) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  // ref на корень календаря
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Одноразово: в aria-live чистит текст сразу при изменении
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const el = root.querySelector(
      ".react-datepicker__aria-live",
    ) as HTMLElement | null;
    if (!el) return;

    // отключает оповещения и скрывает элемент
    el.setAttribute("aria-live", "off");
    el.setAttribute("role", "presentation");
    el.setAttribute("aria-hidden", "true");
    el.textContent = "";

    const clean = () => {
      el.textContent = "";
    };
    const observer = new MutationObserver(clean);
    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  // Для дропдауна годов: автопрокрутка к текущему году при открытии.
  const yearListRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!openYear) return;
    const curr = yearListRef.current?.querySelector<HTMLButtonElement>(
      '[data-current="true"]',
    );
    curr?.scrollIntoView({ block: "center" });
  }, [openYear]);

  return (
    <div ref={rootRef} className={`calendar ${className ?? ""}`} id={id}>
      <DatePicker
        inline={inline}
        selected={value || null}
        onChange={handleChange}
        /*onSelect={handleSelect}*/
        onClickOutside={(ev: Event) => {
          setOpenMonth(false);
          setOpenYear(false);
          onClickOutside?.(ev);
        }}
        onMonthChange={(d: Date) => setVisibleDate(d)}
        fixedHeight
        monthClassName={() => "calendar__month"}
        weekClassName={() => "calendar__week"}
        dayClassName={(d: Date) => {
          const classes = ["calendar__day"];
          if (visibleDate && d.getMonth() !== visibleDate.getMonth()) {
            classes.push("calendar__day_outside");
          }
          const today = new Date();
          if (d.toDateString() === today.toDateString()) {
            classes.push("calendar__day_today");
          }
          return classes.join(" ");
        }}
        locale={ru}
        formatWeekDay={formatWeekDay}
        renderCustomHeader={({ date, changeMonth, changeYear }) => {
          const years = getYears(1900);
          return (
            <div className="calendar__header">
              {/* Контрол выбора месяца */}
              <div className="month-control">
                <span className="calendar__current-month">
                  {date.toLocaleString("ru-RU", {
                    month: "long",
                  })}
                </span>
                <button
                  type="button"
                  className="calendar__nav calendar__nav--month"
                  onClick={(e) => {
                    e.stopPropagation(); // не отдаём клик наружу
                    setOpenMonth((v) => !v); // переключаем список месяцев
                    setOpenYear(false); // на всякий — закрываем список годов
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={openMonth}
                  aria-label="Выбрать месяц"
                >
                  <img
                    src={chevronDownUrl}
                    alt=""
                    className="calendar__chevron"
                    aria-hidden="true"
                  />
                </button>

                {/* Дропдаун месяцев */}
                {openMonth && (
                  <div
                    className="dropdown month-dropdown"
                    role="listbox"
                    aria-label="Месяцы"
                    onClick={(e) => e.stopPropagation()} // клики внутри не закрывают целый календарь
                  >
                    {months.map((m, idx) => (
                      <button
                        key={m}
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          changeMonth(idx);
                          setOpenMonth(false);
                          // Обновляем "видимый" месяц для корректной подсветки "внешних" дней.
                          setVisibleDate(new Date(date.getFullYear(), idx, 1));
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Контрол выбора года */}
              <div className="year-control">
                <span className="calendar__year">{date.getFullYear()}</span>
                <button
                  type="button"
                  className="calendar__nav calendar__nav--year"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenYear((v) => !v); // переключаем список годов
                    setOpenMonth(false); // и закрываем список месяцев
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={openYear}
                  aria-label="Выбрать год"
                >
                  <img
                    src={chevronDownUrl}
                    alt=""
                    className="calendar__chevron"
                    aria-hidden="true"
                  />
                </button>

                {/* Дропдаун годов */}
                {openYear && (
                  <div
                    ref={yearListRef}
                    className="dropdown year-dropdown"
                    role="listbox"
                    aria-label="Годы"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {years.map((y) => (
                      <button
                        key={y}
                        type="button"
                        className="dropdown-item"
                        // Атрибут, чтобы отскроллить к текущему году
                        data-current={
                          y === date.getFullYear() ? "true" : undefined
                        }
                        onClick={() => {
                          // Переключение года через API библиотеки.
                          changeYear(y);
                          setOpenYear(false);
                          // Обновляем "видимую" дату (месяц сохраняем).
                          setVisibleDate(new Date(y, date.getMonth(), 1));
                        }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }}
        // Классы‑обёртки для ваших CSS‑правил
        calendarClassName="calendar__popup"
        wrapperClassName="calendar__wrapper"
        popperClassName="calendar__popper"
        weekDayClassName={() => "calendar__weekday"}
      >
        {/* Футер: кнопки подтверждения и отмены выбора даты. */}
        <div className="dp-footer" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="dp-btn dp-btn_cancel"
            onClick={handleCancel}
          >
            Отменить
          </button>
          <button
            type="button"
            className="dp-btn dp-btn_apply"
            onClick={handleApply}
          >
            Выбрать
          </button>
        </div>
      </DatePicker>
    </div>
  );
};

export default SimpleDatePicker;
