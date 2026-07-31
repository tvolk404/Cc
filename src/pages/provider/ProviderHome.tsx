import { useNavigate } from 'react-router-dom'
import { Stat, CategoryBadge, Empty } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useProvider } from './ProviderLayout'
import { useStore } from '../../store/StoreContext'
import { JobCard } from './JobCard'
import { sortTasks, todayIso } from '../../lib'

export default function ProviderHome() {
  const { contractor } = useProvider()
  const { state } = useStore()
  const nav = useNavigate()

  const mine = state.tasks.filter((t) => t.contractorId === contractor.id)
  const today = todayIso()
  const todays = sortTasks(mine.filter((t) => t.date === today && t.status !== 'completed'))
  const pending = mine.filter((t) => t.status === 'scheduled')
  const done = mine.filter((t) => t.status === 'completed').length

  return (
    <div>
      <div className="row gap-16" style={{ marginBottom: 24, alignItems: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: contractor.color, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 22 }}>
          {contractor.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </div>
        <div>
          <div className="h1" style={{ fontSize: 26 }}>Hi, {contractor.name.split(' ')[0]}</div>
          <div className="muted mt-4">Here are the jobs your team has been dispatched.</div>
        </div>
      </div>

      <div className="row gap-8 wrap" style={{ marginBottom: 24 }}>
        {contractor.categories.map((c) => <CategoryBadge key={c} category={c} />)}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 28 }}>
        <Stat label="Due today" value={todays.length} accent="var(--mint-700)" />
        <Stat label="Awaiting response" value={pending.length} accent={pending.length ? 'var(--amber)' : undefined} sub="new requests" />
        <Stat label="Completed" value={done} sub="all time" />
      </div>

      {pending.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="between" style={{ marginBottom: 12 }}>
            <div className="h3">New requests</div>
            <span className="pill" style={{ background: 'var(--amber-soft)', color: 'var(--amber)', fontWeight: 700 }}>{pending.length} to review</span>
          </div>
          <div className="col gap-12">
            {sortTasks(pending).map((t) => <JobCard key={t.id} task={t} />)}
          </div>
        </div>
      )}

      <div className="between" style={{ marginBottom: 12 }}>
        <div className="h3">Today's jobs</div>
        <button className="btn btn-outline btn-sm" onClick={() => nav('/provider/tasks')}>See all jobs <Icon.Arrow size={16} /></button>
      </div>
      {todays.length === 0 ? (
        <div className="card"><Empty icon={<Icon.Check size={26} />} title="Nothing due today" text="You're all caught up. New jobs will appear here the moment a manager assigns them." /></div>
      ) : (
        <div className="col gap-12">{todays.map((t) => <JobCard key={t.id} task={t} />)}</div>
      )}
    </div>
  )
}
