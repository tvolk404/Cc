import { CategoryIcon, StatusBadge, Avatar } from './ui'
import { Icon } from './icons'
import { useStore } from '../store/StoreContext'
import { taskWhere, relativeDay } from '../lib'
import type { Task } from '../types'

export function TaskRow({ task, onClick }: { task: Task; onClick?: () => void }) {
  const { state } = useStore()
  const contractor = state.contractors.find((c) => c.id === task.contractorId)
  return (
    <div className="lrow taskrow" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', gridTemplateColumns: 'auto 1fr auto' }}>
      <CategoryIcon category={task.category} size={46} />
      <div style={{ minWidth: 0 }}>
        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          <span className="h3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</span>
          {task.priority === 'high' && <span className="pill" style={{ background: 'var(--danger-soft)', color: 'var(--danger)', fontWeight: 700, fontSize: 11 }}>High</span>}
        </div>
        <div className="muted tiny row gap-8 mt-4" style={{ flexWrap: 'wrap' }}>
          <span className="row gap-6"><Icon.Pin size={13} /> {taskWhere(state, task)}</span>
          <span className="row gap-6"><Icon.Clock size={13} /> {relativeDay(task.date)} · {task.time}</span>
        </div>
      </div>
      <div className="row gap-12" style={{ justifySelf: 'end' }}>
        <div className="col" style={{ alignItems: 'flex-end', gap: 8 }}>
          <StatusBadge status={task.status} />
          <div className="row gap-6">
            {contractor
              ? <><Avatar name={contractor.name} color={contractor.color} size={22} /><span className="tiny muted" style={{ maxWidth: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contractor.name}</span></>
              : <span className="tiny" style={{ color: 'var(--amber)' }}>Unassigned</span>}
          </div>
        </div>
      </div>
      <style>{`.taskrow:hover { background: var(--line-soft); }`}</style>
    </div>
  )
}
