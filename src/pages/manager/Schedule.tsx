import { useState } from 'react'
import { Page, PageHeader } from '../../components/Page'
import { Icon } from '../../components/icons'
import TaskModal from '../../components/TaskModal'
import { useStore } from '../../store/StoreContext'
import { CATEGORY_META } from '../../store/data'
import { sortTasks, taskWhere, todayIso } from '../../lib'
import type { Task } from '../../types'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = (x.getDay() + 6) % 7 // Monday = 0
  x.setDate(x.getDate() - day)
  x.setHours(0, 0, 0, 0)
  return x
}
const isoOf = (d: Date) => d.toISOString().slice(0, 10)

export default function Schedule() {
  const { state } = useStore()
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [preset, setPreset] = useState<{ date: string } | null>(null)
  const [editing, setEditing] = useState<Task | null>(null)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(d.getDate() + i); return d
  })
  const today = todayIso()
  const rangeLabel = `${MONTHS[weekStart.getMonth()].slice(0, 3)} ${weekStart.getDate()} – ${MONTHS[days[6].getMonth()].slice(0, 3)} ${days[6].getDate()}`

  function shift(n: number) {
    const d = new Date(weekStart); d.setDate(d.getDate() + n * 7); setWeekStart(d)
  }

  return (
    <Page>
      <PageHeader
        title="Schedule"
        subtitle="Plan the week — click any day to add a task."
        actions={
          <div className="row gap-8">
            <button className="btn btn-outline btn-sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
            <div className="row gap-6">
              <button className="btn btn-icon btn-outline" onClick={() => shift(-1)}><Icon.Back size={18} /></button>
              <button className="btn btn-icon btn-outline" onClick={() => shift(1)}><Icon.Chevron size={18} /></button>
            </div>
          </div>
        }
      />

      <div className="between" style={{ marginBottom: 14 }}>
        <div className="h3">{rangeLabel}, {weekStart.getFullYear()}</div>
        <button className="btn btn-primary btn-sm" onClick={() => setPreset({ date: today })}><Icon.Plus size={16} /> Schedule task</button>
      </div>

      <div className="week-grid">
        {days.map((d) => {
          const iso = isoOf(d)
          const dayTasks = sortTasks(state.tasks.filter((t) => t.date === iso))
          const isToday = iso === today
          return (
            <div key={iso} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 220, borderColor: isToday ? 'var(--mint-600)' : 'var(--line)' }}>
              <div className="between" style={{ padding: '12px 14px', background: isToday ? 'var(--mint-tint)' : 'transparent', borderBottom: '1px solid var(--line-soft)' }}>
                <div className="row gap-8">
                  <span className="tiny muted" style={{ fontWeight: 700 }}>{DAYS[(d.getDay() + 6) % 7]}</span>
                  <span style={{ fontWeight: 800, color: isToday ? 'var(--mint-700)' : 'var(--ink)' }}>{d.getDate()}</span>
                </div>
                <button className="btn btn-icon btn-ghost" style={{ padding: 6 }} onClick={() => setPreset({ date: iso })} aria-label="Add task">
                  <Icon.Plus size={16} />
                </button>
              </div>
              <div className="col gap-8" style={{ padding: 10, flex: 1 }}>
                {dayTasks.length === 0 ? (
                  <button onClick={() => setPreset({ date: iso })} style={{ flex: 1, border: '1.5px dashed var(--line)', background: 'transparent', borderRadius: 12, color: 'var(--slate-400)', fontSize: 12.5, cursor: 'pointer', minHeight: 60 }}>
                    + Add
                  </button>
                ) : dayTasks.map((t) => {
                  const m = CATEGORY_META[t.category]
                  return (
                    <button key={t.id} onClick={() => setEditing(t)} style={{
                      textAlign: 'left', border: 'none', borderLeft: `3px solid ${m.color}`, background: m.bg,
                      borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
                    }}>
                      <div className="row gap-6" style={{ fontSize: 11.5, fontWeight: 700, color: m.color }}>
                        <span>{t.time}</span>
                        {t.status === 'completed' && <Icon.Check size={12} />}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 12.5, marginTop: 2, color: 'var(--ink)', lineHeight: 1.25 }}>{t.title}</div>
                      <div className="muted" style={{ fontSize: 10.5, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{taskWhere(state, t)}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {preset && <TaskModal open onClose={() => setPreset(null)} preset={preset} />}
      {editing && <TaskModal open onClose={() => setEditing(null)} editing={editing} />}

      <style>{`
        .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px; }
        @media (max-width: 1100px) { .week-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 760px) { .week-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 460px) { .week-grid { grid-template-columns: 1fr; } }
      `}</style>
    </Page>
  )
}
