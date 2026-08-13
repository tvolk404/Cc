import { useCallback, useMemo, useState } from "react";
import { useStore } from "../../data/store";
import type { Task, TaskType } from "../../data/types";
import {
  dateCounts,
  matchesFilters,
  type Filters,
} from "../../lib/derive";
import { dateWindow } from "../../data/mockData";
import { fmtDateLong, relDayLabel } from "../../lib/format";
import { Icon, type IconName } from "../../components/Icon";
import { DateRail } from "./DateRail";
import { FilterBar } from "./FilterBar";
import { BookingsView } from "./BookingsView";
import { UnitView } from "./UnitView";
import { CalendarView } from "./CalendarView";
import { TaskDrawer } from "./TaskDrawer";
import { NewTaskModal } from "./NewTaskModal";
import { AssignMenu, type AssignTarget } from "./AssignMenu";
import type { TaskHandlers } from "./types";
import { taskTypeLabel } from "../../data/mockData";
import { downloadCsv, tasksToCsv } from "./csv";
import "./schedule.css";

export type ScheduleSub = "bookings" | "unit" | "calendar";

const SUBS: Array<{ id: ScheduleSub; label: string; icon: IconName }> = [
  { id: "bookings", label: "Bookings", icon: "list" },
  { id: "unit", label: "Unit View", icon: "timeline" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
];

export function Schedule({
  date,
  onDate,
  sub,
  onSub,
  filters,
  onFilters,
}: {
  date: string;
  onDate: (d: string) => void;
  sub: ScheduleSub;
  onSub: (s: ScheduleSub) => void;
  filters: Filters;
  onFilters: (f: Filters) => void;
}) {
  const store = useStore();
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [assignTarget, setAssignTarget] = useState<AssignTarget | null>(null);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [similarScope, setSimilarScope] = useState<"day" | "building">("day");

  const ctx = useMemo(
    () => ({
      buildings: store.buildings,
      unitById: new Map(
        store.units.map((u) => [
          u.id,
          { buildingId: u.buildingId, unitTypeId: u.unitTypeId, label: u.label },
        ]),
      ),
    }),
    [store.buildings, store.units],
  );

  // Tasks matching non-date filters (used by calendar + date rail).
  const filteredAll = useMemo(
    () => store.tasks.filter((t) => matchesFilters(t, filters, ctx)),
    [store.tasks, filters, ctx],
  );
  const dayTasks = useMemo(
    () => filteredAll.filter((t) => t.date === date),
    [filteredAll, date],
  );

  const counts = useMemo(
    () => dateCounts(store.tasks, filters, ctx, dateWindow(date, 7, 14)),
    [store.tasks, filters, ctx, date],
  );

  const unassignedCount = dayTasks.filter((t) => !t.assigneeId).length;

  // ---- selection helpers ----
  const toggle = useCallback((id: string) => {
    setSelection((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);
  const setMany = useCallback((ids: string[], on: boolean) => {
    setSelection((prev) => {
      const next = new Set(prev);
      for (const id of ids) (on ? next.add(id) : next.delete(id));
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelection(new Set()), []);

  const requestAssign = useCallback(
    (taskIds: string[], anchor: DOMRect, types: TaskType[], buildingId?: string) => {
      const already = taskIds.filter(
        (id) => store.tasks.find((t) => t.id === id)?.assigneeId,
      ).length;
      setAssignTarget({ taskIds, anchor, types, buildingId, alreadyAssigned: already });
    },
    [store.tasks],
  );

  const handlers: TaskHandlers = useMemo(
    () => ({
      selection,
      pending: store.pending,
      toggle,
      setMany,
      openDrawer: (id) => setDrawerId(id),
      unassign: (id) => store.unassign(id),
      requestAssign,
    }),
    [selection, store.pending, store.unassign, toggle, setMany, requestAssign],
  );

  const doAssign = async (assigneeId: string) => {
    if (!assignTarget) return;
    const ids = assignTarget.taskIds;
    setAssignTarget(null);
    if (ids.length > 1) {
      await store.bulkAssign(ids, assigneeId);
      clearSelection();
    } else {
      await store.assign(ids[0], assigneeId);
    }
  };

  // ---- bulk: select similar ----
  const selectSimilar = () => {
    const selectedTasks = dayTasks.filter((t) => selection.has(t.id));
    const types = new Set(selectedTasks.map((t) => t.type));
    const buildings = new Set(selectedTasks.map((t) => t.buildingId));
    const pool =
      similarScope === "building"
        ? filteredAll.filter((t) => t.date === date && buildings.has(t.buildingId))
        : dayTasks;
    const ids = pool.filter((t) => types.has(t.type)).map((t) => t.id);
    setMany(ids, true);
  };

  const selectedTasks = store.tasks.filter((t) => selection.has(t.id));
  const typeMix = useMemo(() => {
    const m = new Map<TaskType, number>();
    for (const t of selectedTasks) m.set(t.type, (m.get(t.type) ?? 0) + 1);
    return [...m.entries()];
  }, [selectedTasks]);

  const exportCsv = () => {
    const csv = tasksToCsv(dayTasks, store.buildings, store.units, store.assignees);
    downloadCsv(`scheduler-v7_${date}.csv`, csv);
  };

  const drawerTask: Task | null = drawerId
    ? store.tasks.find((t) => t.id === drawerId) ?? null
    : null;

  return (
    <div className="sched">
      {/* Header */}
      <div className="sched__head">
        <div>
          <h1 className="page-title">Schedule</h1>
          <p className="page-sub">
            {fmtDateLong(date)} · {dayTasks.length} tasks · {unassignedCount} unassigned
          </p>
        </div>
        <div className="sched__head-actions">
          <button className="btn-ghost" onClick={exportCsv} title="Export filtered set as CSV">
            <Icon name="download" size={16} /> Export CSV
          </button>
          <button className="btn-primary" onClick={() => setNewOpen(true)}>
            Add task
            <span className="btn-primary__plus">
              <Icon name="plus" size={14} strokeWidth={3} />
            </span>
          </button>
        </div>
      </div>

      <DateRail date={date} today={store.today} counts={counts} onPick={onDate} />

      <FilterBar filters={filters} onFilters={onFilters} />

      {/* Sub-view tabs */}
      <div className="sched__tabs">
        {SUBS.map((s) => (
          <button
            key={s.id}
            className={`sched__tab ${sub === s.id ? "is-active" : ""}`}
            onClick={() => onSub(s.id)}
          >
            <Icon name={s.icon} size={16} />
            {s.label}
          </button>
        ))}
        <span className="sched__tab-hint">
          {relDayLabel(date, store.today)}
        </span>
      </div>

      {/* Sub-view */}
      <div className="sched__view">
        {sub === "bookings" && <BookingsView tasks={dayTasks} h={handlers} />}
        {sub === "unit" && (
          <UnitView tasks={dayTasks} h={handlers} date={date} today={store.today} />
        )}
        {sub === "calendar" && (
          <CalendarView
            tasks={filteredAll}
            date={date}
            today={store.today}
            onOpenDay={(d) => {
              onDate(d);
              onSub("bookings");
            }}
          />
        )}
      </div>

      {/* Bulk toolbar */}
      {selection.size > 0 && (
        <div className="bulkbar">
          <div className="bulkbar__count">
            <span className="bulkbar__n">{selection.size}</span>
            selected
          </div>
          <div className="bulkbar__mix">
            {typeMix.map(([t, n]) => (
              <span key={t} className="bulkbar__chip" style={{ ["--tt" as string]: `var(--tt-${ttVar(t)})` }}>
                <i />
                {n} {taskTypeLabel(t)}
              </span>
            ))}
          </div>
          <div className="bulkbar__scope">
            Similar in
            <div className="bulkbar__seg">
              <button
                className={similarScope === "day" ? "is-on" : ""}
                onClick={() => setSimilarScope("day")}
              >
                Day
              </button>
              <button
                className={similarScope === "building" ? "is-on" : ""}
                onClick={() => setSimilarScope("building")}
              >
                Building
              </button>
            </div>
            <button className="bulkbar__similar" onClick={selectSimilar}>
              Select similar
            </button>
          </div>
          <div className="bulkbar__actions">
            <button className="bulkbar__clear" onClick={clearSelection}>
              Clear
            </button>
            <button
              className="bulkbar__assign"
              onClick={(e) => {
                const ids = [...selection];
                const types = [...new Set(selectedTasks.map((t) => t.type))];
                const bset = new Set(selectedTasks.map((t) => t.buildingId));
                requestAssign(
                  ids,
                  e.currentTarget.getBoundingClientRect(),
                  types,
                  bset.size === 1 ? [...bset][0] : undefined,
                );
              }}
            >
              <Icon name="user" size={16} />
              Assign {selection.size}
            </button>
          </div>
        </div>
      )}

      {/* Overlays */}
      {assignTarget && (
        <AssignMenu target={assignTarget} onClose={() => setAssignTarget(null)} onPick={doAssign} />
      )}
      <TaskDrawer
        task={drawerTask}
        onClose={() => setDrawerId(null)}
        onRequestAssign={(id, anchor) => {
          const t = store.tasks.find((x) => x.id === id);
          if (t) requestAssign([id], anchor, [t.type], t.buildingId);
        }}
      />
      {newOpen && (
        <NewTaskModal
          date={date}
          onClose={() => setNewOpen(false)}
          onCreated={(id) => {
            setNewOpen(false);
            setDrawerId(id);
          }}
        />
      )}
    </div>
  );
}

function ttVar(t: TaskType) {
  return {
    turnover: "clean",
    checkin: "checkin",
    checkout: "checkout",
    maintenance: "maintenance",
    inspection: "inspection",
  }[t];
}
