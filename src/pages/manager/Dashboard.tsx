import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, PageHeader } from '../../components/Page'
import { Stat, Empty } from '../../components/ui'
import { Icon } from '../../components/icons'
import { TaskRow } from '../../components/TaskRow'
import TaskModal from '../../components/TaskModal'
import { useStore } from '../../store/StoreContext'
import { propUnitCount, sortTasks, todayIso } from '../../lib'

export default function Dashboard() {
  const { state } = useStore()
  const nav = useNavigate()
  const [modal, setModal] = useState(false)

  const today = todayIso()
  const todays = sortTasks(state.tasks.filter((t) => t.date === today && t.status !== 'completed'))
  const upcoming = sortTasks(state.tasks.filter((t) => t.date > today && t.status !== 'completed')).slice(0, 5)
  const open = state.tasks.filter((t) => t.status !== 'completed')
  const unassigned = state.tasks.filter((t) => !t.contractorId && t.status !== 'completed').length
  const units = state.properties.reduce((n, p) => n + propUnitCount(p), 0)

  return (
    <Page>
      <PageHeader
        title="Good day, manager 👋"
        subtitle="Here's what's happening across your portfolio today."
        actions={<button className="btn btn-primary" onClick={() => setModal(true)}><Icon.Plus size={18} /> Schedule task</button>}
      />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 24 }}>
        <Stat label="Properties" value={state.properties.length} sub={`${units} units total`} />
        <Stat label="Open tasks" value={open.length} sub={`${todays.length} due today`} accent="var(--mint-700)" />
        <Stat label="Contractors" value={state.contractors.length} sub={`${state.contractors.filter((c) => c.active).length} active`} />
        <Stat label="Needs a crew" value={unassigned} sub="unassigned tasks" accent={unassigned ? 'var(--amber)' : undefined} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)' }}>
        {/* Today */}
        <div className="card">
          <div className="between" style={{ padding: '20px 22px 12px' }}>
            <div>
              <div className="h3">Today's schedule</div>
              <div className="muted tiny mt-4">{todays.length} task{todays.length !== 1 ? 's' : ''} on the board</div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => nav('/manager/schedule')}>Open calendar <Icon.Arrow size={16} /></button>
          </div>
          {todays.length === 0 ? (
            <Empty icon={<Icon.Check size={26} />} title="All clear for today" text="Nothing scheduled. Enjoy the calm — or plan ahead." />
          ) : (
            <div>{todays.map((t) => <TaskRow key={t.id} task={t} onClick={() => nav('/manager/tasks')} />)}</div>
          )}
        </div>

        {/* Side column */}
        <div className="col gap-16">
          <div className="card">
            <div className="h3" style={{ padding: '20px 22px 12px' }}>Coming up</div>
            {upcoming.length === 0 ? (
              <div className="muted tiny" style={{ padding: '0 22px 22px' }}>No upcoming tasks scheduled.</div>
            ) : (
              upcoming.map((t) => <TaskRow key={t.id} task={t} onClick={() => nav('/manager/tasks')} />)
            )}
          </div>

          <div className="card card-pad" style={{ background: 'linear-gradient(135deg,#0a0e17,#2a3142)', color: '#fff' }}>
            <div className="h3" style={{ color: '#fff' }}>Quick actions</div>
            <div className="col gap-8 mt-16">
              <QuickAction label="Add a property" onClick={() => nav('/manager/properties')} icon={<Icon.Building size={18} />} />
              <QuickAction label="Add a contractor" onClick={() => nav('/manager/contractors')} icon={<Icon.Users size={18} />} />
              <QuickAction label="Schedule a task" onClick={() => setModal(true)} icon={<Icon.Calendar size={18} />} />
            </div>
          </div>
        </div>
      </div>

      <TaskModal open={modal} onClose={() => setModal(false)} />
    </Page>
  )
}

function QuickAction({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button onClick={onClick} className="between" style={{
      width: '100%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff',
      padding: '13px 16px', borderRadius: 14, fontWeight: 600, fontSize: 14.5, cursor: 'pointer',
    }}>
      <span className="row gap-10">{icon} {label}</span>
      <Icon.Arrow size={17} />
    </button>
  )
}
