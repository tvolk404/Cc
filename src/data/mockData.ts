// ============================================================
// Scheduler v7 — Deterministic mock dataset
// A seeded PRNG keeps the demo stable across reloads so the
// "current time" line, counts, and screenshots are reproducible.
// ============================================================

import type {
  Assignee,
  Building,
  Company,
  Priority,
  Task,
  TaskType,
  Unit,
  UnitType,
} from "./types";

/** Anchor "today" for the prototype (matches the PRD sample date). */
export const TODAY = "2026-03-11";

// ---- tiny seeded PRNG (mulberry32) ----
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260311);
const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
const chance = (p: number) => rnd() < p;
const int = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));

// ---- date helpers ----
export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}
export function dateWindow(center: string, before: number, after: number) {
  const out: string[] = [];
  for (let i = -before; i <= after; i++) out.push(addDays(center, i));
  return out;
}

// ---- static reference data ----
export const companies: Company[] = [
  { id: "co-1", name: "Harbor Stays" },
  { id: "co-2", name: "Meridian Living" },
];

export const buildings: Building[] = [
  { id: "b-1", companyId: "co-1", name: "Avalon Court", code: "AVL" },
  { id: "b-2", companyId: "co-1", name: "Riverside Lofts", code: "RVS" },
  { id: "b-3", companyId: "co-1", name: "The Meridian", code: "MRD" },
  { id: "b-4", companyId: "co-2", name: "Cedar Heights", code: "CDR" },
  { id: "b-5", companyId: "co-2", name: "Union Square Flats", code: "USQ" },
  { id: "b-6", companyId: "co-2", name: "Bayview Residences", code: "BAY" },
];

export const unitTypes: UnitType[] = [
  { id: "ut-1", name: "Studio" },
  { id: "ut-2", name: "1 Bedroom" },
  { id: "ut-3", name: "2 Bedroom" },
  { id: "ut-4", name: "Penthouse" },
];

// Units: 5–9 per building, spread across types.
export const units: Unit[] = (() => {
  const out: Unit[] = [];
  let n = 1;
  for (const b of buildings) {
    const count = int(5, 9);
    for (let i = 0; i < count; i++) {
      const ut = pick(unitTypes);
      const floor = int(1, 6);
      out.push({
        id: `u-${n++}`,
        buildingId: b.id,
        unitTypeId: ut.id,
        label: `Unit ${floor}${String(int(1, 9)).padStart(2, "0")}`,
      });
    }
  }
  return out;
})();

// ---- assignees ----
const avatarBgs = [
  "#ffd7b0",
  "#cfe4ff",
  "#c9c2ff",
  "#bfe3c0",
  "#f6d6a8",
  "#ffc2c2",
  "#d3f6d8",
  "#ded9ff",
];
const emojis = ["🧑🏽", "👨🏻", "🧔🏻", "👩🏻", "🧑🏾", "🧑🏻", "👨🏽", "🧑🏼", "🧔🏽", "👩🏽"];

const assigneeSeed: Array<[string, string]> = [
  ["Amara Osei", "Turnover Lead"],
  ["Diego Ramirez", "Housekeeper"],
  ["Priya Nair", "Inspector"],
  ["Liam Walsh", "Maintenance"],
  ["Nina Kovač", "Housekeeper"],
  ["Marcus Bell", "Check-in Host"],
  ["Sofia Rossi", "Turnover Lead"],
  ["Kenji Tanaka", "Maintenance"],
  ["Grace Adeyemi", "Housekeeper"],
  ["Tomas Novak", "Inspector"],
];

export const assignees: Assignee[] = assigneeSeed.map(([name, role], i) => {
  const parts = name.split(" ");
  const initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  // role-weighted task types
  let tt: TaskType[];
  if (role.includes("Maintenance")) tt = ["maintenance", "inspection"];
  else if (role.includes("Inspector")) tt = ["inspection", "checkin", "checkout"];
  else if (role.includes("Check-in")) tt = ["checkin", "checkout"];
  else tt = ["turnover", "checkin", "checkout"];
  // each covers 2–4 buildings
  const bs = [...buildings].sort(() => rnd() - 0.5).slice(0, int(2, 4)).map((b) => b.id);
  return {
    id: `a-${i + 1}`,
    name,
    initials,
    role,
    skills: tt.slice(0, int(1, tt.length)).map(taskTypeLabel),
    active: chance(0.85),
    buildingIds: bs,
    taskTypes: tt,
    avatarBg: avatarBgs[i % avatarBgs.length],
    emoji: emojis[i % emojis.length],
  };
});

// ---- labels & meta ----
export function taskTypeLabel(t: TaskType): string {
  return {
    turnover: "Turnover Clean",
    checkin: "Check-in",
    checkout: "Check-out",
    maintenance: "Maintenance",
    inspection: "Inspection",
  }[t];
}
export function taskTypeColorVar(t: TaskType): string {
  return {
    turnover: "var(--tt-clean)",
    checkin: "var(--tt-checkin)",
    checkout: "var(--tt-checkout)",
    maintenance: "var(--tt-maintenance)",
    inspection: "var(--tt-inspection)",
  }[t];
}
export function statusLabel(s: Task["status"]): string {
  return {
    unassigned: "Unassigned",
    assigned: "Assigned",
    pushed: "Pushed",
    in_progress: "In progress",
    completed: "Completed",
    blocked: "Blocked",
  }[s];
}

const GUEST_NAMES = [
  "J. Carter", "M. Lindqvist", "R. Osei", "T. Alvarez", "S. Nakamura",
  "P. Dubois", "A. Kowalski", "L. Fernandez", "D. Okafor", "E. Bianchi",
  "H. Andersen", "N. Petrov", "C. Mwangi", "V. Reyes", "F. Haddad",
];

// ---- task generation ----
function makeTask(id: number, date: string, isToday: boolean): Task {
  const unit = pick(units);
  const type = pick<TaskType>([
    "turnover", "turnover", "turnover", "checkin", "checkin",
    "checkout", "maintenance", "inspection",
  ]);
  const guestImpacting =
    isToday && (type === "checkin" || type === "checkout" || type === "turnover");

  // priority skewed by type/impact
  let priority: Priority = "normal";
  if (guestImpacting && chance(0.4)) priority = chance(0.5) ? "high" : "urgent";
  else if (chance(0.15)) priority = "high";
  else if (chance(0.1)) priority = "low";

  const scheduled = chance(0.82);
  const startMin = scheduled ? int(7, 19) * 60 + pick([0, 15, 30, 45]) : undefined;
  const durationMin = { turnover: 90, checkin: 30, checkout: 30, maintenance: 60, inspection: 45 }[type];

  // assignment: leave a meaningful unassigned pool, esp. today
  const assignedProb = isToday ? 0.62 : 0.5;
  let assigneeId: string | undefined;
  let status: Task["status"] = "unassigned";
  if (chance(assignedProb)) {
    const cand = assignees.filter(
      (a) => a.active && a.taskTypes.includes(type) && a.buildingIds.includes(unit.buildingId),
    );
    const a = cand.length ? pick(cand) : pick(assignees.filter((x) => x.active));
    if (a) {
      assigneeId = a.id;
      status = chance(0.2) ? "in_progress" : chance(0.15) ? "completed" : "assigned";
    }
  }
  if (!assigneeId && chance(0.06)) status = "blocked";

  const hasBooking = type !== "maintenance" && type !== "inspection";
  const nights = hasBooking ? int(1, 6) : undefined;

  return {
    id: `t-${id}`,
    type,
    subtype: type === "maintenance" ? pick(["Plumbing", "HVAC", "Electrical", "Appliance"]) : undefined,
    status,
    priority,
    durationMin,
    date,
    startMin,
    assigneeId,
    buildingId: unit.buildingId,
    unitId: unit.id,
    bookingRef: hasBooking ? `BK-${int(10000, 99999)}` : undefined,
    guestName: hasBooking ? pick(GUEST_NAMES) : undefined,
    checkIn: hasBooking ? date : undefined,
    checkOut: hasBooking && nights ? addDays(date, nights) : undefined,
    nights,
    breezewayPushed: chance(0.55),
    keyReady: chance(0.7),
    notes: chance(0.25) ? pick([
      "Guest requested early access.",
      "Balcony door lock sticks.",
      "Leave welcome pack on counter.",
      "Elevator out — use service lift.",
      "Pet stay — extra vacuum.",
    ]) : undefined,
    guestImpacting,
  };
}

export function generateTasks(): Task[] {
  const dates = dateWindow(TODAY, 14, 21);
  const out: Task[] = [];
  let id = 1;
  for (const date of dates) {
    const isToday = date === TODAY;
    // demand curve: heavier near/around today, lighter far out
    const base = isToday ? int(34, 42) : int(10, 30);
    for (let i = 0; i < base; i++) out.push(makeTask(id++, date, isToday));
  }
  return out;
}
