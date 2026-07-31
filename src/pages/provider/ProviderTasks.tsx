import { useMemo, useState } from 'react'
import { Empty } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useProvider } from './ProviderLayout'
import { useStore } from '../../store/StoreContext'
import { JobCard } from './JobCard'
import { sortTasks, todayIso } from '../../lib'
import type { TaskStatus } from '../../types'

type Tab = 'active' | 'new' | 'today' | 'done'

export default function ProviderTasks() {
  const { contractor } = useProvider()
  const { state } = useStore()
  const [tab, setTab] = useState<Tab>('active')

  const mine = useMemo(() => state.tasks.filter((t) => t.contractorId === contractor.id), [state.tasks, contractor.id])
  const today = todayIso()

  const activeStatuses: TaskStatus[] = ['scheduled', 'accepted', 'in_progress']
  const list = useMemo(() => {
    let l = mine
    if (tab === 'active') l = mine.filter((t) => activeStatuses.includes(t.status))
    else if (tab === 'new') l = mine.filter((t) => t.status === 'scheduled')
    else if (tab === 'today') l = mine.filter((t) => t.date === today && t.status !== 'completed')
    else l = mine.filter((t) => t.status === 'completed')
    return sortTasks(l)
  }, [mine, tab, today])

  const counts = {
    active: mine.filter((t) => activeStatuses.includes(t.status)).length,
    new: mine.filter((t) => t.status === 'scheduled').length,
    today: mine.filter((t) => t.date === today && t.status !== 'completed').length,
    done: mine.filter((t) => t.status === 'completed').length,
  }

  return (
    <div>
      <div className="between wrap gap-12" style={{ marginBottom: 20 }}>
        <div>
          <div className="h1" style={{ fontSize: 26 }}>My jobs</div>
          <div className="muted mt-4">Everything dispatched to {contractor.name}.</div>
        </div>
        <div className="seg">
          {([['active', 'Active'], ['new', 'New'], ['today', 'Today'], ['done', 'Done']] as [Tab, string][]).map(([k, label]) => (
            <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
              {label} <span style={{ opacity: 0.6 }}>{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card">
          <Empty icon={<Icon.List size={26} />} title="No jobs here"
            text={tab === 'done' ? 'Completed jobs will be listed here.' : 'When a property manager assigns work, it shows up right away.'} />
        </div>
      ) : (
        <div className="col gap-12">{list.map((t) => <JobCard key={t.id} task={t} />)}</div>
      )}
    </div>
  )
}
