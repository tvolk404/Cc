import { useMemo, useState } from 'react'
import { Page, PageHeader } from '../../components/Page'
import { Modal, Empty, StatusBadge, CategoryBadge, Avatar } from '../../components/ui'
import { Icon } from '../../components/icons'
import { TaskRow } from '../../components/TaskRow'
import TaskModal from '../../components/TaskModal'
import { useStore } from '../../store/StoreContext'
import { sortTasks, taskWhere, fmtDateLong, todayIso } from '../../lib'
import type { ServiceCategory, Task, TaskStatus } from '../../types'

type Filter = 'all' | 'today' | 'upcoming' | 'unassigned' | 'completed'

export default function Tasks() {
  const { state } = useStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [cat, setCat] = useState<ServiceCategory | 'all'>('all')
  const [q, setQ] = useState('')
  const [create, setCreate] = useState(false)
  const [selected, setSelected] = useState<Task | null>(null)
  const [editing, setEditing] = useState<Task | null>(null)

  const today = todayIso()
  const filtered = useMemo(() => {
    let list = state.tasks
    if (filter === 'today') list = list.filter((t) => t.date === today && t.status !== 'completed')
    else if (filter === 'upcoming') list = list.filter((t) => t.date > today && t.status !== 'completed')
    else if (filter === 'unassigned') list = list.filter((t) => !t.contractorId && t.status !== 'completed')
    else if (filter === 'completed') list = list.filter((t) => t.status === 'completed')
    if (cat !== 'all') list = list.filter((t) => t.category === cat)
    if (q.trim()) {
      const s = q.toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(s) || taskWhere(state, t).toLowerCase().includes(s))
    }
    return sortTasks(list)
  }, [state, filter, cat, q, today])

  const counts = {
    all: state.tasks.length,
    today: state.tasks.filter((t) => t.date === today && t.status !== 'completed').length,
    upcoming: state.tasks.filter((t) => t.date > today && t.status !== 'completed').length,
    unassigned: state.tasks.filter((t) => !t.contractorId && t.status !== 'completed').length,
    completed: state.tasks.filter((t) => t.status === 'completed').length,
  }

  return (
    <Page>
      <PageHeader
        title="Tasks"
        subtitle="Every job across your portfolio, in one board."
        actions={<button className="btn btn-primary" onClick={() => setCreate(true)}><Icon.Plus size={18} /> Schedule task</button>}
      />

      <div className="between wrap gap-12" style={{ marginBottom: 18 }}>
        <div className="seg">
          {([['all', 'All'], ['today', 'Today'], ['upcoming', 'Upcoming'], ['unassigned', 'Unassigned'], ['completed', 'Done']] as [Filter, string][]).map(([k, label]) => (
            <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>
              {label} <span style={{ opacity: 0.6 }}>{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="row gap-10 wrap">
          <div className="row" style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none' }}><Icon.Search size={17} /></span>
            <input className="input" placeholder="Search tasks…" value={q} onChange={(e) => setQ(e.target.value)}
              style={{ paddingLeft: 38, width: 200 }} />
          </div>
          <select className="select" value={cat} onChange={(e) => setCat(e.target.value as any)} style={{ width: 160 }}>
            <option value="all">All categories</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
            <option value="linen">Linen</option>
            <option value="inspection">Inspection</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <Empty icon={<Icon.List size={26} />} title="No tasks match" text="Try a different filter, or schedule something new."
            action={<button className="btn btn-mint" onClick={() => setCreate(true)}><Icon.Plus size={18} /> Schedule task</button>} />
        ) : filtered.map((t) => <TaskRow key={t.id} task={t} onClick={() => setSelected(t)} />)}
      </div>

      <TaskModal open={create} onClose={() => setCreate(false)} />
      {editing && <TaskModal open onClose={() => setEditing(null)} editing={editing} onSaved={(t) => setSelected(t)} />}
      {selected && !editing && (
        <TaskDetail task={selected} onClose={() => setSelected(null)} onEdit={() => setEditing(selected)} />
      )}
    </Page>
  )
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
  scheduled: 'accepted', accepted: 'in_progress', in_progress: 'completed', completed: null, declined: null,
}

function TaskDetail({ task, onClose, onEdit }: { task: Task; onClose: () => void; onEdit: () => void }) {
  const { state, updateTask, removeTask } = useStore()
  const contractor = state.contractors.find((c) => c.id === task.contractorId)
  const next = NEXT_STATUS[task.status]

  return (
    <Modal open onClose={onClose} title={task.title} subtitle={taskWhere(state, task)}
      footer={<>
        <button className="btn btn-ghost" style={{ color: 'var(--danger)', marginRight: 'auto' }}
          onClick={() => { if (confirm('Delete this task?')) { removeTask(task.id); onClose() } }}>
          <Icon.Trash size={15} /> Delete
        </button>
        <button className="btn btn-outline" onClick={onEdit}>Edit</button>
        {next && (
          <button className="btn btn-primary" onClick={() => updateTask(task.id, { status: next })}>
            <Icon.Check size={16} /> Mark {next.replace('_', ' ')}
          </button>
        )}
      </>}>
      <div className="col gap-16">
        <div className="row gap-8 wrap">
          <CategoryBadge category={task.category} />
          <StatusBadge status={task.status} />
          {task.priority === 'high' && <span className="pill" style={{ background: 'var(--danger-soft)', color: 'var(--danger)', fontWeight: 700 }}>High priority</span>}
          {task.recurrence !== 'none' && <span className="pill">Repeats {task.recurrence}</span>}
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InfoTile icon={<Icon.Calendar size={16} />} label="When" value={`${fmtDateLong(task.date)} · ${task.time}`} />
          <InfoTile icon={<Icon.Clock size={16} />} label="Duration" value={task.durationMin < 60 ? `${task.durationMin} min` : `${task.durationMin / 60} h`} />
        </div>

        <div className="card" style={{ padding: 14, background: 'var(--canvas)', border: 'none' }}>
          <div className="eyebrow">Assigned to</div>
          {contractor ? (
            <div className="row gap-12 mt-8">
              <Avatar name={contractor.name} color={contractor.color} size={40} />
              <div>
                <div style={{ fontWeight: 700 }}>{contractor.name}</div>
                <div className="muted tiny">{contractor.contactName} · {contractor.phone}</div>
              </div>
            </div>
          ) : <div className="mt-8" style={{ color: 'var(--amber)', fontWeight: 600 }}>Unassigned — edit to dispatch a crew.</div>}
        </div>

        {task.notes && (
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Notes</div>
            <div className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{task.notes}</div>
          </div>
        )}
      </div>
    </Modal>
  )
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card" style={{ padding: 14, background: 'var(--canvas)', border: 'none' }}>
      <div className="row gap-6 muted" style={{ fontSize: 12, fontWeight: 600 }}>{icon} {label}</div>
      <div style={{ fontWeight: 700, marginTop: 6, fontSize: 14.5 }}>{value}</div>
    </div>
  )
}
