import { CategoryBadge, CategoryIcon, StatusBadge } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useStore } from '../../store/StoreContext'
import { taskWhere, relativeDay } from '../../lib'
import type { Task } from '../../types'

export function JobCard({ task }: { task: Task }) {
  const { state, updateTask } = useStore()
  const where = taskWhere(state, task)
  const dur = task.durationMin < 60 ? `${task.durationMin} min` : `${task.durationMin / 60} h`

  return (
    <div className="card card-pad">
      <div className="between wrap gap-12">
        <div className="row gap-12" style={{ minWidth: 0 }}>
          <CategoryIcon category={task.category} size={44} />
          <div style={{ minWidth: 0 }}>
            <div className="h3">{task.title}</div>
            <div className="muted tiny row gap-8 mt-4 wrap">
              <span className="row gap-6"><Icon.Pin size={13} /> {where}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="row gap-8 wrap mt-16">
        <span className="pill"><Icon.Calendar size={13} /> {relativeDay(task.date)}</span>
        <span className="pill"><Icon.Clock size={13} /> {task.time} · {dur}</span>
        <CategoryBadge category={task.category} size="sm" />
        {task.priority === 'high' && <span className="pill" style={{ background: 'var(--danger-soft)', color: 'var(--danger)', fontWeight: 700 }}>High priority</span>}
        {task.recurrence !== 'none' && <span className="pill">Repeats {task.recurrence}</span>}
      </div>

      {task.notes && (
        <div className="mt-16" style={{ background: 'var(--canvas)', borderRadius: 12, padding: '12px 14px' }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Manager notes</div>
          <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.45 }}>{task.notes}</div>
        </div>
      )}

      {/* Actions by status */}
      <div className="row gap-8 wrap mt-16" style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 16 }}>
        {task.status === 'scheduled' && (
          <>
            <button className="btn btn-mint" onClick={() => updateTask(task.id, { status: 'accepted' })}><Icon.Check size={16} /> Accept job</button>
            <button className="btn btn-outline" onClick={() => updateTask(task.id, { status: 'declined' })}><Icon.X size={16} /> Decline</button>
          </>
        )}
        {task.status === 'accepted' && (
          <button className="btn btn-primary" onClick={() => updateTask(task.id, { status: 'in_progress' })}><Icon.Play size={16} /> Start work</button>
        )}
        {task.status === 'in_progress' && (
          <button className="btn btn-mint" onClick={() => updateTask(task.id, { status: 'completed' })}><Icon.Check size={16} /> Mark complete</button>
        )}
        {task.status === 'completed' && (
          <span className="row gap-8" style={{ color: 'var(--ok)', fontWeight: 700, fontSize: 14 }}><Icon.Check size={17} /> Job completed — nice work!</span>
        )}
        {task.status === 'declined' && (
          <button className="btn btn-ghost" onClick={() => updateTask(task.id, { status: 'scheduled' })}>Reconsider</button>
        )}
      </div>
    </div>
  )
}
