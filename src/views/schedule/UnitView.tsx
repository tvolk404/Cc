import { useMemo, useRef, useState } from "react";
import { useStore } from "../../data/store";
import type { Task } from "../../data/types";
import { taskTypeLabel } from "../../data/mockData";
import { EmptyState, Spinner } from "../../components/ui/bits";
import { Icon } from "../../components/Icon";
import { fmtTime } from "../../lib/format";
import type { TaskHandlers } from "./types";
import "./unitview.css";

const START_H = 6;
const END_H = 22;
const SNAP = 15; // minutes
const TOTAL_MIN = (END_H - START_H) * 60;

export function UnitView({
  tasks,
  h,
  date,
  today,
}: {
  tasks: Task[];
  h: TaskHandlers;
  date: string;
  today: string;
}) {
  const store = useStore();

  const { rows, unscheduled } = useMemo(() => {
    const byUnit = new Map<string, Task[]>();
    const uns: Task[] = [];
    for (const t of tasks) {
      if (t.startMin == null) uns.push(t);
      else {
        const arr = byUnit.get(t.unitId) ?? [];
        arr.push(t);
        byUnit.set(t.unitId, arr);
      }
    }
    const rows = [...byUnit.entries()]
      .map(([uid, ts]) => {
        const u = store.units.find((u) => u.id === uid);
        const b = store.buildings.find((b) => b.id === u?.buildingId);
        return { uid, unit: u, building: b, tasks: ts };
      })
      .sort((a, b) =>
        (a.building?.code ?? "").localeCompare(b.building?.code ?? "") ||
        (a.unit?.label ?? "").localeCompare(b.unit?.label ?? ""),
      );
    return { rows, unscheduled: uns };
  }, [tasks, store]);

  const hours = Array.from({ length: END_H - START_H + 1 }, (_, i) => START_H + i);
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const showNow = date === today && nowMin >= START_H * 60 && nowMin <= END_H * 60;
  const nowPct = ((nowMin - START_H * 60) / TOTAL_MIN) * 100;

  if (!tasks.length) {
    return <EmptyState icon="timeline" title="No tasks to place for this day" />;
  }

  return (
    <div className="unitview">
      <div className="uv">
        <div className="uv__timehead">
          <div className="uv__corner">Unit</div>
          <div className="uv__hours">
            {hours.map((hh) => (
              <span key={hh} className="uv__hour">
                {String(hh).padStart(2, "0")}:00
              </span>
            ))}
          </div>
        </div>

        <div className="uv__body">
          {showNow && (
            <div className="uv__now" style={{ left: `calc(180px + ${nowPct}% * (100% - 180px) / 100)` }}>
              <span className="uv__now-dot" />
            </div>
          )}
          {rows.map((r) => (
            <div className="uv__row" key={r.uid}>
              <div className="uv__unitcell">
                <span className="uv__code">{r.building?.code}</span>
                <span className="uv__unit">{r.unit?.label}</span>
              </div>
              <div className="uv__track">
                {hours.slice(0, -1).map((hh) => (
                  <span key={hh} className="uv__gridline" style={{ left: `${((hh - START_H) * 60 / TOTAL_MIN) * 100}%` }} />
                ))}
                {r.tasks.map((t) => (
                  <TaskBlock key={t.id} task={t} h={h} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {unscheduled.length > 0 && (
        <div className="uv__tray">
          <div className="uv__tray-head">
            <Icon name="clock" size={16} />
            Unscheduled · {unscheduled.length}
            <span className="uv__tray-hint">still actionable — assign or set a time in the drawer</span>
          </div>
          <div className="uv__tray-items">
            {unscheduled.map((t) => (
              <button
                key={t.id}
                className={`uv__chip ${!t.assigneeId ? "is-un" : ""}`}
                style={{ ["--tt" as string]: `var(--tt-${ttVar(t.type)})` }}
                onClick={() => h.openDrawer(t.id)}
              >
                <i />
                {taskTypeLabel(t.type)}
                <span className="uv__chip-unit">
                  {store.buildings.find((b) => b.id === t.buildingId)?.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskBlock({ task, h }: { task: Task; h: TaskHandlers }) {
  const store = useStore();
  const trackRef = useRef<HTMLElement | null>(null);
  const [dragMin, setDragMin] = useState<number | null>(null);
  const busy = store.pending.has(task.id);

  const start = dragMin ?? task.startMin ?? START_H * 60;
  const leftPct = ((start - START_H * 60) / TOTAL_MIN) * 100;
  const widthPct = (task.durationMin / TOTAL_MIN) * 100;

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const track = (e.currentTarget as HTMLElement).parentElement;
    if (!track) return;
    trackRef.current = track;
    const rect = track.getBoundingClientRect();
    const pxPerMin = rect.width / TOTAL_MIN;
    const grabOffset = e.clientX - rect.left - (start - START_H * 60) * pxPerMin;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      const raw = (ev.clientX - rect.left - grabOffset) / pxPerMin + START_H * 60;
      const snapped = Math.round(raw / SNAP) * SNAP;
      const clamped = Math.max(
        START_H * 60,
        Math.min(END_H * 60 - task.durationMin, snapped),
      );
      setDragMin(clamped);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDragMin((final) => {
        if (final != null && final !== task.startMin) store.reschedule(task.id, final);
        return null;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const assignee = task.assigneeId
    ? store.assignees.find((a) => a.id === task.assigneeId)
    : undefined;

  return (
    <div
      className={`uvblock ${!task.assigneeId ? "is-un" : ""} ${dragMin != null ? "is-drag" : ""}`}
      style={{
        left: `${leftPct}%`,
        width: `max(${widthPct}%, 68px)`,
        ["--tt" as string]: `var(--tt-${ttVar(task.type)})`,
      }}
      onPointerDown={onPointerDown}
      onClick={() => dragMin == null && h.openDrawer(task.id)}
      role="button"
      title={`${taskTypeLabel(task.type)} · ${fmtTime(start)}`}
    >
      <span className="uvblock__t">{taskTypeLabel(task.type)}</span>
      <span className="uvblock__time">
        {busy ? <Spinner size={11} /> : fmtTime(start)}
        {assignee && <em>· {assignee.initials}</em>}
      </span>
    </div>
  );
}

function ttVar(t: Task["type"]) {
  return {
    turnover: "clean",
    checkin: "checkin",
    checkout: "checkout",
    maintenance: "maintenance",
    inspection: "inspection",
  }[t];
}
