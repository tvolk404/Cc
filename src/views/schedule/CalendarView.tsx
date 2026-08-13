import { useMemo, useState } from "react";
import { useStore } from "../../data/store";
import type { Task } from "../../data/types";
import { Icon } from "../../components/Icon";
import { TaskTypeIcon } from "../../components/ui/bits";
import { addDays } from "../../data/mockData";
import { dayNum, fmtDateLong, fmtTime, monthName } from "../../lib/format";
import { taskTypeLabel } from "../../data/mockData";
import "./calendar.css";

/** `tasks` is the full filtered set across all dates (date filter not applied). */
export function CalendarView({
  tasks,
  date,
  today,
  onOpenDay,
}: {
  tasks: Task[];
  date: string;
  today: string;
  onOpenDay: (d: string) => void;
}) {
  const store = useStore();
  const [month, setMonth] = useState(() => date.slice(0, 7)); // "YYYY-MM"
  const [drawerDay, setDrawerDay] = useState<string | null>(date);

  const byDate = useMemo(() => {
    const m = new Map<string, { total: number; un: number }>();
    for (const t of tasks) {
      const c = m.get(t.date) ?? { total: 0, un: 0 };
      c.total++;
      if (!t.assigneeId) c.un++;
      m.set(t.date, c);
    }
    return m;
  }, [tasks]);

  const [y, mo] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, mo - 1, 1));
  const startDow = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate();
  const maxTotal = Math.max(1, ...[...byDate.values()].map((v) => v.total));

  const cells: Array<string | null> = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(`${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`);

  const shiftMonth = (delta: number) => {
    const nd = new Date(Date.UTC(y, mo - 1 + delta, 1));
    setMonth(nd.toISOString().slice(0, 7));
  };

  const dayTasks = drawerDay ? tasks.filter((t) => t.date === drawerDay) : [];
  const groupedByBuilding = useMemo(() => {
    const m = new Map<string, Task[]>();
    for (const t of dayTasks) {
      const arr = m.get(t.buildingId) ?? [];
      arr.push(t);
      m.set(t.buildingId, arr);
    }
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [dayTasks]);

  return (
    <div className="calview">
      <div className="cal">
        <div className="cal__head">
          <div>
            <h3 className="card-title">{monthName(`${month}-01`)} {y}</h3>
            <p className="card-sub">Filtered task intensity by day</p>
          </div>
          <div className="cal__nav">
            <button onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <Icon name="chevron-left" size={18} />
            </button>
            <button onClick={() => shiftMonth(1)} aria-label="Next month">
              <Icon name="chevron-right" size={18} />
            </button>
          </div>
        </div>
        <div className="cal__dow">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="cal__grid">
          {cells.map((iso, i) =>
            iso ? (
              <button
                key={iso}
                className={`cal__cell ${iso === drawerDay ? "is-sel" : ""} ${iso === today ? "is-today" : ""}`}
                style={{ ["--h" as string]: ((byDate.get(iso)?.total ?? 0) / maxTotal).toFixed(2) }}
                onClick={() => setDrawerDay(iso)}
              >
                <span className="cal__num">{dayNum(iso)}</span>
                {byDate.get(iso) && (
                  <span className="cal__meta">
                    <b>{byDate.get(iso)!.total}</b>
                    {byDate.get(iso)!.un > 0 && <i>{byDate.get(iso)!.un}</i>}
                  </span>
                )}
              </button>
            ) : (
              <span key={`e-${i}`} className="cal__cell cal__cell--empty" />
            ),
          )}
        </div>
        <div className="cal__legend">
          <span className="cal__legend-item"><i className="lo" /> Lighter load</span>
          <span className="cal__legend-item"><i className="hi" /> Heavier load</span>
          <span className="cal__legend-item"><i className="un" /> Unassigned count</span>
        </div>
      </div>

      <div className="cal__drawer">
        {drawerDay ? (
          <>
            <div className="cal__drawer-head">
              <div>
                <h3 className="card-title">{fmtDateLong(drawerDay)}</h3>
                <p className="card-sub">{dayTasks.length} tasks · {dayTasks.filter((t) => !t.assigneeId).length} unassigned</p>
              </div>
              <button className="cal__open" onClick={() => onOpenDay(drawerDay)}>
                Open in schedule
                <Icon name="arrow-up-right" size={15} strokeWidth={2.4} />
              </button>
            </div>
            <div className="cal__quicknav">
              <button onClick={() => setDrawerDay(addDays(drawerDay, -1))}>
                <Icon name="chevron-left" size={15} /> Prev
              </button>
              <button onClick={() => setDrawerDay(addDays(drawerDay, 1))}>
                Next <Icon name="chevron-right" size={15} />
              </button>
            </div>
            {groupedByBuilding.length ? (
              <div className="cal__groups">
                {groupedByBuilding.map(([bid, ts]) => {
                  const b = store.buildings.find((b) => b.id === bid)!;
                  return (
                    <div key={bid} className="cal__group">
                      <div className="cal__group-head">
                        <span className="cal__group-code">{b.code}</span>
                        {b.name}
                        <span className="cal__group-n">{ts.length}</span>
                      </div>
                      {ts.slice(0, 6).map((t) => (
                        <div key={t.id} className={`cal__task ${!t.assigneeId ? "is-un" : ""}`}>
                          <TaskTypeIcon type={t.type} size={14} />
                          <span className="cal__task-t">{taskTypeLabel(t.type)}</span>
                          <span className="cal__task-time">{fmtTime(t.startMin)}</span>
                        </div>
                      ))}
                      {ts.length > 6 && (
                        <div className="cal__more">+{ts.length - 6} more</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cal__empty">No tasks scheduled for this day.</div>
            )}
          </>
        ) : (
          <div className="cal__empty">Pick a day to see its tasks.</div>
        )}
      </div>
    </div>
  );
}
