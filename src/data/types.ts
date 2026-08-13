// ============================================================
// Scheduler v7 — Core domain types
// Mirrors §13 Data Model of the PRD.
// ============================================================

export type TaskType =
  | "turnover"
  | "checkin"
  | "checkout"
  | "maintenance"
  | "inspection";

export type TaskStatus =
  | "unassigned"
  | "assigned"
  | "pushed"
  | "in_progress"
  | "completed"
  | "blocked";

export type Priority = "low" | "normal" | "high" | "urgent";

export interface Company {
  id: string;
  name: string;
}

export interface Building {
  id: string;
  companyId: string;
  name: string;
  /** short code shown in dense UI, e.g. "AVL" */
  code: string;
}

export interface UnitType {
  id: string;
  name: string; // "Studio", "1BR", "2BR", "Penthouse"
}

export interface Unit {
  id: string;
  buildingId: string;
  unitTypeId: string;
  label: string; // "Unit 204"
}

export interface Assignee {
  id: string;
  name: string;
  initials: string;
  role: string;
  skills: string[];
  active: boolean;
  /** building ids this person is assigned to cover */
  buildingIds: string[];
  /** task types this person is allowed to perform */
  taskTypes: TaskType[];
  avatarBg: string;
  emoji: string;
}

export interface Task {
  id: string;
  type: TaskType;
  subtype?: string;
  status: TaskStatus;
  priority: Priority;
  /** estimated duration in minutes */
  durationMin: number;
  /** ISO date, e.g. "2026-03-11" */
  date: string;
  /** minutes from midnight, undefined = unscheduled */
  startMin?: number;
  assigneeId?: string;
  buildingId: string;
  unitId: string;

  // operational context
  bookingRef?: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  breezewayPushed: boolean;
  keyReady: boolean;
  notes?: string;
  /** same-day guest-impacting work — drives attention scoring */
  guestImpacting: boolean;
}

/** Aggregated per-date figure used for the date rail / horizon. */
export interface DateCount {
  date: string;
  total: number;
  unassigned: number;
}
