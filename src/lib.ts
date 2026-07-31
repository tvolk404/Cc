import type { AppState, Property, Task, Unit } from './types'

export function propUnitCount(p: Property): number {
  if (p.kind === 'single') return 1
  return p.unitTypes.reduce((n, ut) => n + ut.units.length, 0)
}

export function allUnits(p: Property): { unit: Unit; unitTypeId: string; typeName: string }[] {
  return p.unitTypes.flatMap((ut) =>
    ut.units.map((unit) => ({ unit, unitTypeId: ut.id, typeName: ut.name })),
  )
}

export function findUnitLabel(p: Property | undefined, unitId?: string): string | null {
  if (!p || !unitId) return null
  for (const ut of p.unitTypes) {
    const u = ut.units.find((x) => x.id === unitId)
    if (u) return u.label
  }
  return null
}

export function taskWhere(state: AppState, t: Task): string {
  const p = state.properties.find((x) => x.id === t.propertyId)
  if (!p) return 'Unknown property'
  const unit = findUnitLabel(p, t.unitId)
  return unit ? `${p.name} · ${unit}` : p.name
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function fmtDateLong(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function relativeDay(iso: string): string {
  const t = todayIso()
  if (iso === t) return 'Today'
  const d = new Date(iso + 'T00:00:00')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (iso === tomorrow.toISOString().slice(0, 10)) return 'Tomorrow'
  const yest = new Date()
  yest.setDate(yest.getDate() - 1)
  if (iso === yest.toISOString().slice(0, 10)) return 'Yesterday'
  return fmtDate(iso)
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
}
