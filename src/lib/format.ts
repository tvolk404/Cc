// Small formatting helpers shared across views.

export function fmtTime(min?: number): string {
  if (min == null) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function fmtDuration(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function weekday(iso: string): string {
  return WD[parseISO(iso).getUTCDay()];
}
export function monthName(iso: string): string {
  return MO[parseISO(iso).getUTCMonth()];
}
export function dayNum(iso: string): number {
  return parseISO(iso).getUTCDate();
}
export function fmtDateLong(iso: string): string {
  const d = parseISO(iso);
  return `${WD[d.getUTCDay()]}, ${MO[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
export function fmtDateShort(iso: string): string {
  const d = parseISO(iso);
  return `${MO[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function relDayLabel(iso: string, today: string): string {
  if (iso === today) return "Today";
  const a = parseISO(iso).getTime();
  const b = parseISO(today).getTime();
  const diff = Math.round((a - b) / 86400000);
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 0) return `In ${diff} days`;
  return `${-diff} days ago`;
}
