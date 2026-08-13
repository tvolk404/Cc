import { useMemo, useState } from "react";
import { useStore } from "../data/store";
import type { Filters } from "../lib/derive";
import {
  assigneeLoads,
  buildingLoads,
  buildAttentionFeed,
  taskTypeLoads,
} from "../lib/derive";
import { Avatar, Card, CardHead, LoadBar } from "../components/ui/bits";
import { Icon, type IconName } from "../components/Icon";
import { taskTypeLabel } from "../data/mockData";
import type { AttentionItem, AttentionSeverity } from "../lib/derive";
import { addDays, dateWindow } from "../data/mockData";
import {
  dayNum,
  fmtDateLong,
  monthName,
  relDayLabel,
  weekday,
} from "../lib/format";
import { MultiSelect } from "../components/ui/MultiSelect";
import { buildingOptions } from "../lib/options";
import type { TaskType } from "../data/types";
import "./overview.css";

const ATT_ICON: Record<AttentionItem["icon"], IconName> = {
  checkin: "checkin",
  checkout: "checkout",
  clean: "clean",
  clock: "clock",
  building: "building",
  user: "user",
  flag: "flag",
};

export function Overview({
  date,
  onDate,
  goToSchedule,
}: {
  date: string;
  onDate: (d: string) => void;
  goToSchedule: (
    date?: string,
    filterPatch?: Partial<Filters>,
    sub?: "bookings" | "unit" | "calendar",
  ) => void;
}) {
  const store = useStore();
  const [scope, setScope] = useScopeState();

  const inScope = useMemo(
    () =>
      store.tasks.filter(
        (t) => scope.length === 0 || scope.includes(t.buildingId),
      ),
    [store.tasks, scope],
  );

  const dayTasks = useMemo(
    () => inScope.filter((t) => t.date === date),
    [inScope, date],
  );

  // KPIs
  const total = dayTasks.length;
  const assigned = dayTasks.filter((t) => t.assigneeId).length;
  const pctAssigned = total ? Math.round((assigned / total) * 100) : 0;
  const checkins = dayTasks.filter((t) => t.type === "checkin").length;
  const activeBuildings = new Set(dayTasks.map((t) => t.buildingId)).size;

  const attention = useMemo(
    () => buildAttentionFeed(dayTasks, store.buildings, store.assignees),
    [dayTasks, store.buildings, store.assignees],
  );

  const bLoads = useMemo(() => buildingLoads(dayTasks), [dayTasks]);
  const ttLoads = useMemo(() => taskTypeLoads(dayTasks), [dayTasks]);
  const aLoads = useMemo(() => assigneeLoads(dayTasks), [dayTasks]);

  const maxBuilding = Math.max(1, ...[...bLoads.values()].map((v) => v.total));
  const orderedBuildings = [...bLoads.entries()].sort(
    (a, b) => b[1].total - a[1].total,
  );

  const TT_ORDER: TaskType[] = [
    "turnover",
    "checkin",
    "checkout",
    "maintenance",
    "inspection",
  ];

  return (
    <div className="ov">
      {/* Header */}
      <div className="ov__head">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-sub">{fmtDateLong(date)} · operational awareness</p>
        </div>
        <div className="ov__head-actions">
          <MultiSelect
            label="Buildings"
            options={buildingOptions(store.buildings)}
            selected={scope}
            onChange={setScope}
            width={180}
          />
          <div className="date-nav">
            <button onClick={() => onDate(addDays(date, -1))} aria-label="Previous day">
              <Icon name="chevron-left" size={18} />
            </button>
            <button
              className={`date-nav__today ${date === store.today ? "is-today" : ""}`}
              onClick={() => onDate(store.today)}
            >
              {date === store.today ? "Today" : relDayLabel(date, store.today)}
            </button>
            <button onClick={() => onDate(addDays(date, 1))} aria-label="Next day">
              <Icon name="chevron-right" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="ov__kpis">
        <Kpi
          icon="list"
          label="Total tasks"
          value={total}
          accent="var(--navy)"
        />
        <Card className="kpi kpi--gauge">
          <div className="kpi__gauge">
            <Ring pct={pctAssigned} />
            <div className="kpi__gauge-mid">
              <span className="kpi__value">{pctAssigned}%</span>
              <span className="kpi__label">Assigned</span>
            </div>
          </div>
          <div className="kpi__gauge-side">
            <span className="kpi__value">{assigned}</span>
            <span className="kpi__label">of {total} tasks assigned</span>
            <span className="kpi__unassigned">{total - assigned} unassigned</span>
          </div>
        </Card>
        <Kpi
          icon="checkin"
          label="Check-ins today"
          value={checkins}
          accent="var(--tt-checkin)"
        />
        <Kpi
          icon="building"
          label="Active buildings"
          value={activeBuildings}
          accent="var(--tt-inspection)"
        />
      </div>

      {/* Main grid */}
      <div className="ov__grid">
        {/* Attention feed */}
        <Card className="ov__attention">
          <CardHead
            title="Needs attention"
            sub="Highest-risk items first"
            right={
              <span className="pill-count">
                {attention.length} {attention.length === 1 ? "item" : "items"}
              </span>
            }
          />
          {attention.length === 0 ? (
            <div className="att-clear">
              <span className="att-clear__badge">
                <Icon name="check" size={20} strokeWidth={3} />
              </span>
              <p>Everything's covered for {relDayLabel(date, store.today).toLowerCase()}.</p>
            </div>
          ) : (
            <ul className="att-list">
              {attention.map((it) => (
                <AttentionRow
                  key={it.id}
                  item={it}
                  onClick={() => goToSchedule(date, it.filterPatch)}
                />
              ))}
            </ul>
          )}
        </Card>

        {/* Right column */}
        <div className="ov__col">
          <Card>
            <CardHead title="Building pressure" sub="Volume & unassigned by building" />
            <div className="press-list">
              {orderedBuildings.map(([bid, v]) => {
                const b = store.buildings.find((b) => b.id === bid)!;
                return (
                  <button
                    key={bid}
                    className="press-row"
                    onClick={() => goToSchedule(date, { buildingIds: [bid] })}
                  >
                    <span className="press-row__name">
                      <span className="press-row__code">{b.code}</span>
                      {b.name}
                    </span>
                    <LoadBar total={v.total} unassigned={v.unassigned} max={maxBuilding} />
                    <span className="press-row__nums">
                      <b>{v.total}</b>
                      {v.unassigned > 0 && (
                        <span className="press-row__un">{v.unassigned}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHead title="Task breakdown" sub="By type" />
            <div className="tt-grid">
              {TT_ORDER.map((tt) => {
                const v = ttLoads.get(tt) ?? { total: 0, unassigned: 0 };
                return (
                  <button
                    key={tt}
                    className="tt-cell"
                    onClick={() => goToSchedule(date, { taskTypes: [tt] })}
                    style={{ ["--tt" as string]: `var(--tt-${ttVar(tt)})` }}
                  >
                    <span className="tt-cell__bar">
                      <i style={{ height: `${barH(v.total, ttLoads)}%` }} />
                    </span>
                    <span className="tt-cell__n">{v.total}</span>
                    <span className="tt-cell__label">{taskTypeLabel(tt)}</span>
                    {v.unassigned > 0 && (
                      <span className="tt-cell__un">{v.unassigned} open</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Assignee load */}
        <Card className="ov__assignees">
          <CardHead
            title="Assignee load"
            sub="Distribution for the day"
            right={
              <button className="link-btn" onClick={() => goToSchedule(date, { unassignedOnly: true })}>
                View unassigned
              </button>
            }
          />
          <div className="aload">
            <div className="aload__row aload__row--unassigned">
              <span className="aload__who">
                <span className="aload__ghost">
                  <Icon name="user" size={16} />
                </span>
                Unassigned
              </span>
              <div className="aload__bar">
                <div
                  className="aload__fill aload__fill--un"
                  style={{ width: `${barPct(total - assigned, dayTasks, aLoads)}%` }}
                />
              </div>
              <b>{total - assigned}</b>
            </div>
            {store.assignees
              .map((a) => [a, aLoads.get(a.id) ?? 0] as const)
              .filter(([, n]) => n > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([a, n]) => (
                <div key={a.id} className="aload__row">
                  <span className="aload__who">
                    <Avatar a={a} size={28} />
                    {a.name}
                  </span>
                  <div className="aload__bar">
                    <div
                      className="aload__fill"
                      style={{
                        width: `${barPct(n, dayTasks, aLoads)}%`,
                        background: n >= 7 ? "var(--orange)" : "var(--navy)",
                      }}
                    />
                  </div>
                  <b>{n}</b>
                </div>
              ))}
          </div>
        </Card>

        {/* Day activity strip */}
        <Card className="ov__activity">
          <CardHead
            title="Day activity"
            sub="Task density across the day"
            right={
              <button className="link-btn" onClick={() => goToSchedule(date, {}, "unit")}>
                Open timeline
              </button>
            }
          />
          <ActivityStrip tasks={dayTasks} />
          <div className="ministrip">
            {dateWindow(date, 2, 3).map((d) => {
              const n = inScope.filter((t) => t.date === d).length;
              const un = inScope.filter((t) => t.date === d && !t.assigneeId).length;
              return (
                <button
                  key={d}
                  className={`ministrip__day ${d === date ? "is-sel" : ""}`}
                  onClick={() => onDate(d)}
                >
                  <span className="ministrip__wd">{weekday(d)}</span>
                  <span className="ministrip__n">{n}</span>
                  {un > 0 && <span className="ministrip__un">{un}</span>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* 7-day horizon */}
        <Card className="ov__horizon">
          <CardHead title="7-day horizon" sub="Load & risk in the week ahead" />
          <div className="horizon">
            {dateWindow(date, 0, 6).map((d) => {
              const t = inScope.filter((x) => x.date === d);
              const un = t.filter((x) => !x.assigneeId).length;
              const risk = t.length ? un / t.length : 0;
              const maxH = Math.max(
                1,
                ...dateWindow(date, 0, 6).map(
                  (dd) => inScope.filter((x) => x.date === dd).length,
                ),
              );
              return (
                <button key={d} className="hz" onClick={() => goToSchedule(d)}>
                  <span className="hz__bar-wrap">
                    <span
                      className="hz__bar"
                      style={{
                        height: `${(t.length / maxH) * 100}%`,
                        background:
                          risk > 0.45
                            ? "var(--red)"
                            : risk > 0.25
                              ? "var(--orange)"
                              : "var(--green)",
                      }}
                    />
                  </span>
                  <span className="hz__total">{t.length}</span>
                  <span className="hz__wd">{weekday(d)}</span>
                  <span className="hz__day">{dayNum(d)}</span>
                  {un > 0 && <span className="hz__un">{un} open</span>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Monthly heatmap */}
        <Card className="ov__month">
          <MonthHeat
            anchor={date}
            tasksFor={(d) => inScope.filter((t) => t.date === d)}
            onPick={(d) => goToSchedule(d, {}, "calendar")}
          />
        </Card>
      </div>
    </div>
  );
}

/* ---------------- sub-components ---------------- */

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: IconName;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className="kpi">
      <span className="kpi__icon" style={{ ["--accent" as string]: accent }}>
        <Icon name={icon} size={20} />
      </span>
      <div>
        <span className="kpi__value">{value}</span>
        <span className="kpi__label">{label}</span>
      </div>
    </Card>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <svg width="86" height="86" viewBox="0 0 86 86" className="ring">
      <circle cx="43" cy="43" r={r} fill="none" stroke="var(--bg-2)" strokeWidth="9" />
      <circle
        cx="43"
        cy="43"
        r={r}
        fill="none"
        stroke="url(#ringg)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform="rotate(-90 43 43)"
      />
      <defs>
        <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--green-bright)" />
          <stop offset="1" stopColor="var(--lime)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const SEV_LABEL: Record<AttentionSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Watch",
};

function AttentionRow({ item, onClick }: { item: AttentionItem; onClick: () => void }) {
  return (
    <li>
      <button className={`att att--${item.severity}`} onClick={onClick}>
        <span className="att__icon">
          <Icon name={ATT_ICON[item.icon]} size={18} />
        </span>
        <span className="att__body">
          <span className="att__title">{item.title}</span>
          <span className="att__detail">{item.detail}</span>
        </span>
        <span className="att__sev">{SEV_LABEL[item.severity]}</span>
        <span className="att__go">
          <Icon name="chevron-right" size={16} />
        </span>
      </button>
    </li>
  );
}

function ActivityStrip({ tasks }: { tasks: ReturnType<typeof useStore>["tasks"] }) {
  // hourly buckets 6:00–22:00
  const START = 6;
  const END = 22;
  const buckets = Array.from({ length: END - START }, (_, i) => {
    const hr = START + i;
    const inHr = tasks.filter(
      (t) => t.startMin != null && Math.floor(t.startMin / 60) === hr,
    );
    return { hr, total: inHr.length, un: inHr.filter((t) => !t.assigneeId).length };
  });
  const max = Math.max(1, ...buckets.map((b) => b.total));
  return (
    <div className="strip">
      {buckets.map((b) => (
        <div key={b.hr} className="strip__col" title={`${b.hr}:00 — ${b.total} tasks`}>
          <div className="strip__bar-wrap">
            <div className="strip__bar" style={{ height: `${(b.total / max) * 100}%` }}>
              {b.un > 0 && (
                <div
                  className="strip__un"
                  style={{ height: `${(b.un / b.total) * 100}%` }}
                />
              )}
            </div>
          </div>
          {b.hr % 3 === 0 && <span className="strip__label">{b.hr}</span>}
        </div>
      ))}
    </div>
  );
}

function MonthHeat({
  anchor,
  tasksFor,
  onPick,
}: {
  anchor: string;
  tasksFor: (d: string) => unknown[];
  onPick: (d: string) => void;
}) {
  const [y, m] = anchor.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const startDow = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();

  const cells: Array<{ iso: string; n: number } | null> = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  let max = 1;
  const dayData: Array<{ iso: string; n: number }> = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const n = tasksFor(iso).length;
    max = Math.max(max, n);
    dayData.push({ iso, n });
  }
  for (const dd of dayData) cells.push(dd);

  return (
    <div className="month">
      <div className="month__head">
        <span className="card-title">{monthName(anchor)} {y}</span>
        <span className="card-sub">Demand intensity · click a day to plan</span>
      </div>
      <div className="month__dow">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="month__grid">
        {cells.map((c, i) =>
          c ? (
            <button
              key={i}
              className={`month__cell ${c.iso === anchor ? "is-sel" : ""}`}
              style={{ ["--h" as string]: (c.n / max).toFixed(2) }}
              onClick={() => onPick(c.iso)}
              title={`${c.iso} — ${c.n} tasks`}
            >
              <span>{dayNum(c.iso)}</span>
              {c.n > 0 && <i />}
            </button>
          ) : (
            <span key={i} className="month__cell month__cell--empty" />
          ),
        )}
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function ttVar(t: TaskType) {
  return {
    turnover: "clean",
    checkin: "checkin",
    checkout: "checkout",
    maintenance: "maintenance",
    inspection: "inspection",
  }[t];
}
function barH(n: number, loads: Map<TaskType, { total: number }>) {
  const max = Math.max(1, ...[...loads.values()].map((v) => v.total));
  return Math.max(6, (n / max) * 100);
}
function barPct(n: number, tasks: unknown[], loads: Map<string, number>) {
  const max = Math.max(1, tasks.length ? tasks.length : 1, ...[...loads.values()]);
  return (n / max) * 100;
}

function useScopeState() {
  return useState<string[]>([]);
}
