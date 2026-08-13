import { useMemo, useRef } from "react";
import type { DateCount } from "../../data/types";
import { addDays, dateWindow } from "../../data/mockData";
import { dayNum, weekday } from "../../lib/format";
import { Icon } from "../../components/Icon";
import "./daterail.css";

export function DateRail({
  date,
  today,
  counts,
  onPick,
}: {
  date: string;
  today: string;
  counts: Map<string, DateCount>;
  onPick: (d: string) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const days = useMemo(() => dateWindow(date, 7, 14), [date]);
  const maxTotal = Math.max(1, ...[...counts.values()].map((c) => c.total));

  return (
    <div className="daterail">
      <button
        className="daterail__nav"
        onClick={() => onPick(addDays(date, -7))}
        aria-label="Earlier"
      >
        <Icon name="chevron-left" size={18} />
      </button>
      <div className="daterail__track" ref={railRef}>
        {days.map((d) => {
          const c = counts.get(d) ?? { date: d, total: 0, unassigned: 0 };
          const sel = d === date;
          const isToday = d === today;
          return (
            <button
              key={d}
              className={`drday ${sel ? "is-sel" : ""} ${isToday ? "is-today" : ""}`}
              onClick={() => onPick(d)}
            >
              <span className="drday__wd">{weekday(d)}</span>
              <span className="drday__num">{dayNum(d)}</span>
              <span className="drday__meter">
                <span
                  className="drday__meter-fill"
                  style={{ height: `${(c.total / maxTotal) * 100}%` }}
                />
              </span>
              <span className="drday__counts">
                <b>{c.total}</b>
                {c.unassigned > 0 && <i>{c.unassigned}</i>}
              </span>
            </button>
          );
        })}
      </div>
      <button
        className="daterail__nav"
        onClick={() => onPick(addDays(date, 7))}
        aria-label="Later"
      >
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  );
}
