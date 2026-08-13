// CSV export of the currently filtered schedule dataset (FR-SCH-9).
import type { Building, Task, Unit } from "../../data/types";
import { statusLabel, taskTypeLabel } from "../../data/mockData";
import { fmtTime } from "../../lib/format";
import type { Assignee } from "../../data/types";

function esc(v: string | number | undefined | null): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function tasksToCsv(
  tasks: Task[],
  buildings: Building[],
  units: Unit[],
  assignees: Assignee[],
): string {
  const bById = new Map(buildings.map((b) => [b.id, b]));
  const uById = new Map(units.map((u) => [u.id, u]));
  const aById = new Map(assignees.map((a) => [a.id, a]));

  const header = [
    "Task ID",
    "Date",
    "Type",
    "Subtype",
    "Status",
    "Priority",
    "Start",
    "Duration (min)",
    "Building",
    "Building Code",
    "Unit",
    "Assignee",
    "Booking Ref",
    "Guest",
    "Check-in",
    "Check-out",
    "Nights",
    "Breezeway Pushed",
    "Key Ready",
    "Notes",
  ];

  const rows = tasks.map((t) => {
    const b = bById.get(t.buildingId);
    const u = uById.get(t.unitId);
    const a = t.assigneeId ? aById.get(t.assigneeId) : undefined;
    return [
      t.id,
      t.date,
      taskTypeLabel(t.type),
      t.subtype ?? "",
      statusLabel(t.status),
      t.priority,
      t.startMin != null ? fmtTime(t.startMin) : "",
      t.durationMin,
      b?.name ?? "",
      b?.code ?? "",
      u?.label ?? "",
      a?.name ?? "Unassigned",
      t.bookingRef ?? "",
      t.guestName ?? "",
      t.checkIn ?? "",
      t.checkOut ?? "",
      t.nights ?? "",
      t.breezewayPushed ? "Yes" : "No",
      t.keyReady ? "Yes" : "No",
      t.notes ?? "",
    ]
      .map(esc)
      .join(",");
  });

  return [header.map(esc).join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
