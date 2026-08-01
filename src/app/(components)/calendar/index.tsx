import { useState } from "react";
import { format } from "date-fns";
import SimpleDatePicker from "./datepicker";

export default function DatepickerWithInput() {
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label>
        Дата рождения
        <div>
          <input
            type="text"
            value={date ? format(date, "dd.MM.yyyy") : ""}
            placeholder="ДД.ММ.ГГГГ"
            readOnly
            onClick={() => setOpen((v) => !v)}
          />

          <button
            type="button"
            aria-label="Открыть календарь"
            onClick={() => setOpen((v) => !v)}
          />

          {open && (
            <div onClick={(e) => e.stopPropagation()}>
              <SimpleDatePicker
                selected={date}
                onChange={(d) => {
                  setDate(d);
                  setOpen(false);
                }}
                onClickOutside={() => setOpen(false)}
                inline
              />
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
