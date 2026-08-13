// ============================================================
// Derived data: counts, filtering, attention scoring.
// Pure functions over the task list — memoize at call sites.
// ============================================================

import type {
  Assignee,
  Building,
  DateCount,
  Task,
  TaskType,
} from "../data/types";

export interface Filters {
  companyIds: string[];
  buildingIds: string[];
  unitTypeIds: string[];
  unitIds: string[];
  taskTypes: TaskType[];
  assigneeIds: string[]; // may include "unassigned"
  unassignedOnly: boolean;
  search: string; // building search text
}

export const emptyFilters: Filters = {
  companyIds: [],
  buildingIds: [],
  unitTypeIds: [],
  unitIds: [],
  taskTypes: [],
  assigneeIds: [],
  unassignedOnly: false,
  search: "",
};

export function activeFilterCount(f: Filters): number {
  return (
    f.companyIds.length +
    f.buildingIds.length +
    f.unitTypeIds.length +
    f.unitIds.length +
    f.taskTypes.length +
    f.assigneeIds.length +
    (f.unassignedOnly ? 1 : 0) +
    (f.search.trim() ? 1 : 0)
  );
}

interface Ctx {
  buildings: Building[];
  unitById: Map<string, { buildingId: string; unitTypeId: string; label: string }>;
}

export function matchesFilters(t: Task, f: Filters, ctx: Ctx): boolean {
  const unit = ctx.unitById.get(t.unitId);
  if (!unit) return false;

  if (f.buildingIds.length && !f.buildingIds.includes(t.buildingId)) return false;
  if (f.unitTypeIds.length && !f.unitTypeIds.includes(unit.unitTypeId)) return false;
  if (f.unitIds.length && !f.unitIds.includes(t.unitId)) return false;
  if (f.taskTypes.length && !f.taskTypes.includes(t.type)) return false;

  if (f.companyIds.length) {
    const b = ctx.buildings.find((b) => b.id === t.buildingId);
    if (!b || !f.companyIds.includes(b.companyId)) return false;
  }

  if (f.unassignedOnly && t.assigneeId) return false;

  if (f.assigneeIds.length) {
    const wantsUnassigned = f.assigneeIds.includes("unassigned");
    const matchAssignee = t.assigneeId && f.assigneeIds.includes(t.assigneeId);
    const matchUnassigned = wantsUnassigned && !t.assigneeId;
    if (!matchAssignee && !matchUnassigned) return false;
  }

  if (f.search.trim()) {
    const b = ctx.buildings.find((b) => b.id === t.buildingId);
    const hay = `${b?.name ?? ""} ${b?.code ?? ""}`.toLowerCase();
    if (!hay.includes(f.search.trim().toLowerCase())) return false;
  }
  return true;
}

/** Counts per date after applying non-date filters (for the date rail). */
export function dateCounts(
  tasks: Task[],
  f: Filters,
  ctx: Ctx,
  window: string[],
): Map<string, DateCount> {
  const map = new Map<string, DateCount>();
  for (const d of window) map.set(d, { date: d, total: 0, unassigned: 0 });
  for (const t of tasks) {
    if (!map.has(t.date)) continue;
    if (!matchesFilters(t, f, ctx)) continue;
    const c = map.get(t.date)!;
    c.total++;
    if (!t.assigneeId) c.unassigned++;
  }
  return map;
}

export interface BuildingLoad {
  building: Building;
  total: number;
  unassigned: number;
}

export function buildingLoads(tasks: Task[]): Map<string, { total: number; unassigned: number }> {
  const m = new Map<string, { total: number; unassigned: number }>();
  for (const t of tasks) {
    const c = m.get(t.buildingId) ?? { total: 0, unassigned: 0 };
    c.total++;
    if (!t.assigneeId) c.unassigned++;
    m.set(t.buildingId, c);
  }
  return m;
}

export function taskTypeLoads(tasks: Task[]): Map<TaskType, { total: number; unassigned: number }> {
  const m = new Map<TaskType, { total: number; unassigned: number }>();
  for (const t of tasks) {
    const c = m.get(t.type) ?? { total: 0, unassigned: 0 };
    c.total++;
    if (!t.assigneeId) c.unassigned++;
    m.set(t.type, c);
  }
  return m;
}

export function assigneeLoads(tasks: Task[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tasks) {
    if (!t.assigneeId) continue;
    m.set(t.assigneeId, (m.get(t.assigneeId) ?? 0) + 1);
  }
  return m;
}

// ---------- Attention scoring (FR-OV-1) ----------

export type AttentionSeverity = "critical" | "high" | "medium";

export interface AttentionItem {
  id: string;
  severity: AttentionSeverity;
  title: string;
  detail: string;
  /** deep-link target: filter to apply when clicked */
  filterPatch: Partial<Filters>;
  count: number;
  icon: "checkin" | "checkout" | "clean" | "clock" | "building" | "user" | "flag";
}

const severityRank: Record<AttentionSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
};

/**
 * Build a prioritized attention feed for a single day's task set.
 * Highest-risk items first (§FR-OV-1 acceptance).
 */
export function buildAttentionFeed(
  dayTasks: Task[],
  buildings: Building[],
  assignees: Assignee[],
): AttentionItem[] {
  const items: AttentionItem[] = [];
  const unassigned = dayTasks.filter((t) => !t.assigneeId);

  const byType = (tt: TaskType) => unassigned.filter((t) => t.type === tt);

  const uCheckin = byType("checkin");
  if (uCheckin.length)
    items.push({
      id: "att-checkin",
      severity: "critical",
      title: `${uCheckin.length} unassigned check-in${uCheckin.length > 1 ? "s" : ""}`,
      detail: "Guests arriving today with no one assigned",
      filterPatch: { taskTypes: ["checkin"], unassignedOnly: true },
      count: uCheckin.length,
      icon: "checkin",
    });

  const uTurnover = byType("turnover").filter((t) => t.guestImpacting);
  if (uTurnover.length)
    items.push({
      id: "att-turnover",
      severity: "critical",
      title: `${uTurnover.length} same-day turnover clean${uTurnover.length > 1 ? "s" : ""}`,
      detail: "Guest-impacting cleans still unassigned",
      filterPatch: { taskTypes: ["turnover"], unassignedOnly: true },
      count: uTurnover.length,
      icon: "clean",
    });

  const uCheckout = byType("checkout");
  if (uCheckout.length)
    items.push({
      id: "att-checkout",
      severity: "high",
      title: `${uCheckout.length} unassigned check-out${uCheckout.length > 1 ? "s" : ""}`,
      detail: "Departures needing coverage",
      filterPatch: { taskTypes: ["checkout"], unassignedOnly: true },
      count: uCheckout.length,
      icon: "checkout",
    });

  const urgent = unassigned.filter(
    (t) => t.priority === "urgent" || t.priority === "high",
  );
  if (urgent.length)
    items.push({
      id: "att-urgent",
      severity: "high",
      title: `${urgent.length} urgent unassigned task${urgent.length > 1 ? "s" : ""}`,
      detail: "High-priority work without an owner",
      filterPatch: { unassignedOnly: true },
      count: urgent.length,
      icon: "flag",
    });

  // buildings with multiple unassigned tasks
  const perBuilding = new Map<string, number>();
  for (const t of unassigned)
    perBuilding.set(t.buildingId, (perBuilding.get(t.buildingId) ?? 0) + 1);
  const hotBuildings = [...perBuilding.entries()]
    .filter(([, n]) => n >= 4)
    .sort((a, b) => b[1] - a[1]);
  for (const [bid, n] of hotBuildings.slice(0, 2)) {
    const b = buildings.find((b) => b.id === bid);
    items.push({
      id: `att-b-${bid}`,
      severity: "medium",
      title: `${b?.name ?? "Building"} has ${n} unassigned`,
      detail: "Concentrated coverage gap in one building",
      filterPatch: { buildingIds: [bid], unassignedOnly: true },
      count: n,
      icon: "building",
    });
  }

  // tasks missing scheduled times
  const noTime = dayTasks.filter((t) => t.startMin == null);
  if (noTime.length >= 3)
    items.push({
      id: "att-notime",
      severity: "medium",
      title: `${noTime.length} tasks missing a time`,
      detail: "Unscheduled work is hard to sequence",
      filterPatch: {},
      count: noTime.length,
      icon: "clock",
    });

  // overloaded assignees
  const load = assigneeLoads(dayTasks);
  const overloaded = [...load.entries()]
    .filter(([, n]) => n >= 7)
    .sort((a, b) => b[1] - a[1]);
  for (const [aid, n] of overloaded.slice(0, 1)) {
    const a = assignees.find((a) => a.id === aid);
    items.push({
      id: `att-a-${aid}`,
      severity: "medium",
      title: `${a?.name ?? "Assignee"} has ${n} tasks`,
      detail: "Possible overload — consider rebalancing",
      filterPatch: { assigneeIds: [aid] },
      count: n,
      icon: "user",
    });
  }

  return items.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}
