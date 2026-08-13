import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import "./multiselect.css";

export interface Option {
  value: string;
  label: string;
  hint?: string;
}

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  width = 170,
}: {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (next: string[]) => void;
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);

  const filtered = q
    ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
    : options;

  return (
    <div className="ms" ref={ref} style={{ width }}>
      <button
        type="button"
        className={`ms__btn ${selected.length ? "ms__btn--active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="ms__label">
          {label}
          {selected.length > 0 && <span className="ms__count">{selected.length}</span>}
        </span>
        <Icon name="chevron-down" size={15} />
      </button>

      {open && (
        <div className="ms__pop" role="listbox">
          {options.length > 7 && (
            <div className="ms__search">
              <Icon name="search" size={14} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}`}
              />
            </div>
          )}
          <div className="ms__list">
            {filtered.map((o) => {
              const on = selected.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  className={`ms__opt ${on ? "ms__opt--on" : ""}`}
                  onClick={() => toggle(o.value)}
                  role="option"
                  aria-selected={on}
                >
                  <span className={`ms__box ${on ? "ms__box--on" : ""}`}>
                    {on && <Icon name="check" size={12} strokeWidth={3} />}
                  </span>
                  <span className="ms__opt-label">{o.label}</span>
                  {o.hint && <span className="ms__opt-hint">{o.hint}</span>}
                </button>
              );
            })}
            {!filtered.length && <div className="ms__none">No matches</div>}
          </div>
          {selected.length > 0 && (
            <button className="ms__clear" onClick={() => onChange([])} type="button">
              Clear {label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
