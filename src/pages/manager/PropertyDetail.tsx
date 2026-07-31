import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Page } from '../../components/Page'
import { Modal, Field, Empty } from '../../components/ui'
import { Icon } from '../../components/icons'
import { TaskRow } from '../../components/TaskRow'
import TaskModal from '../../components/TaskModal'
import { useStore } from '../../store/StoreContext'
import { GRADIENTS } from '../../store/data'
import { propUnitCount, sortTasks } from '../../lib'
import type { Unit } from '../../types'

const UNIT_STATUS: Record<Unit['status'], { label: string; color: string; bg: string }> = {
  ready: { label: 'Ready', color: 'var(--ok)', bg: 'var(--ok-soft)' },
  occupied: { label: 'Occupied', color: 'var(--sky)', bg: 'var(--sky-soft)' },
  cleaning: { label: 'Cleaning', color: 'var(--mint-700)', bg: 'var(--mint-soft)' },
  maintenance: { label: 'Maintenance', color: 'var(--amber)', bg: 'var(--amber-soft)' },
}

export default function PropertyDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { state, addUnitType, addUnit, removeProperty } = useStore()
  const p = state.properties.find((x) => x.id === id)

  const [typeModal, setTypeModal] = useState(false)
  const [unitFor, setUnitFor] = useState<string | null>(null)
  const [taskPreset, setTaskPreset] = useState<{ propertyId: string; unitId?: string; unitTypeId?: string } | null>(null)

  if (!p) return <Page><div className="card card-pad">Property not found. <button className="btn btn-ghost" onClick={() => nav('/manager/properties')}>Back</button></div></Page>

  const tasks = sortTasks(state.tasks.filter((t) => t.propertyId === p.id))
  const units = propUnitCount(p)

  return (
    <Page>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16, paddingLeft: 8 }} onClick={() => nav('/manager/properties')}>
        <Icon.Back size={17} /> All properties
      </button>

      {/* Hero */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: 130, background: GRADIENTS[p.photo] }} />
        <div className="card-pad between wrap gap-16" style={{ marginTop: -34 }}>
          <div className="row gap-16" style={{ alignItems: 'flex-end' }}>
            <div style={{ width: 68, height: 68, borderRadius: 18, background: '#fff', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              {p.kind === 'multi' ? <Icon.Layers size={30} /> : <Icon.Home size={30} />}
            </div>
            <div>
              <div className="h2">{p.name}</div>
              <div className="muted tiny row gap-6 mt-4"><Icon.Pin size={13} /> {p.address}, {p.city}</div>
            </div>
          </div>
          <div className="row gap-8 wrap">
            <span className="pill">{p.kind === 'multi' ? 'Multi-unit' : 'Single unit'}</span>
            <span className="pill"><Icon.Door size={13} /> {units} unit{units !== 1 ? 's' : ''}</span>
            <button className="btn btn-primary btn-sm" onClick={() => setTaskPreset({ propertyId: p.id })}><Icon.Plus size={16} /> Schedule task</button>
          </div>
        </div>
      </div>

      <div className="split">
        {/* Units column */}
        <div className="col gap-16">
          {p.kind === 'single' ? (
            <div className="card card-pad">
              <div className="h3">Unit details</div>
              <div className="row gap-16 mt-16 wrap">
                <span className="pill"><Icon.Home size={13} /> {p.beds} bed</span>
                <span className="pill">🛁 {p.baths} bath</span>
                {p.singleStatus && <span className="pill" style={{ background: UNIT_STATUS[p.singleStatus].bg, color: UNIT_STATUS[p.singleStatus].color, fontWeight: 700 }}><span className="dot" style={{ background: UNIT_STATUS[p.singleStatus].color }} /> {UNIT_STATUS[p.singleStatus].label}</span>}
              </div>
            </div>
          ) : (
            <>
              <div className="between">
                <div className="h3">Unit types</div>
                <button className="btn btn-outline btn-sm" onClick={() => setTypeModal(true)}><Icon.Plus size={16} /> Add unit type</button>
              </div>

              {p.unitTypes.length === 0 ? (
                <div className="card">
                  <Empty icon={<Icon.Layers size={26} />} title="No unit types yet"
                    text="Group your units by type — e.g. Studio, 1-Bedroom — then add specific units to each."
                    action={<button className="btn btn-mint" onClick={() => setTypeModal(true)}><Icon.Plus size={16} /> Add unit type</button>} />
                </div>
              ) : p.unitTypes.map((ut) => (
                <div className="card" key={ut.id}>
                  <div className="between card-pad" style={{ paddingBottom: 12 }}>
                    <div>
                      <div className="h3">{ut.name}</div>
                      <div className="muted tiny mt-4">{ut.beds} bed · {ut.baths} bath · {ut.units.length} unit{ut.units.length !== 1 ? 's' : ''}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setUnitFor(ut.id)}><Icon.Plus size={15} /> Unit</button>
                  </div>
                  {ut.units.length > 0 && (
                    <div style={{ padding: '0 12px 12px' }}>
                      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                        {ut.units.map((u) => {
                          const s = UNIT_STATUS[u.status]
                          return (
                            <button key={u.id} className="card-hover" onClick={() => setTaskPreset({ propertyId: p.id, unitId: u.id, unitTypeId: ut.id })}
                              style={{ textAlign: 'left', border: '1px solid var(--line)', background: '#fff', borderRadius: 12, padding: 12, cursor: 'pointer' }}>
                              <div className="between">
                                <span style={{ fontWeight: 700, fontSize: 14 }}>{u.label}</span>
                                <span className="dot" style={{ background: s.color }} />
                              </div>
                              <div className="muted" style={{ fontSize: 11.5, marginTop: 6 }}>{u.floor ? `Floor ${u.floor} · ` : ''}{s.label}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Tasks column */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="h3" style={{ padding: '20px 22px 12px' }}>Scheduled here</div>
          {tasks.length === 0 ? (
            <div className="muted tiny" style={{ padding: '0 22px 22px' }}>No tasks scheduled for this property yet.</div>
          ) : tasks.slice(0, 8).map((t) => <TaskRow key={t.id} task={t} onClick={() => nav('/manager/tasks')} />)}
        </div>
      </div>

      <div className="mt-24">
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}
          onClick={() => { if (confirm(`Delete ${p.name} and its tasks?`)) { removeProperty(p.id); nav('/manager/properties') } }}>
          <Icon.Trash size={15} /> Delete property
        </button>
      </div>

      {/* Add unit type modal */}
      <AddTypeModal open={typeModal} onClose={() => setTypeModal(false)} onAdd={(v) => addUnitType(p.id, v)} />

      {/* Add unit modal */}
      <AddUnitModal open={!!unitFor} onClose={() => setUnitFor(null)} onAdd={(v) => { if (unitFor) addUnit(p.id, unitFor, v) }} />

      {/* Task modal */}
      {taskPreset && (
        <TaskModal open onClose={() => setTaskPreset(null)} preset={taskPreset} />
      )}
    </Page>
  )
}

function AddTypeModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (v: { name: string; beds: number; baths: number }) => void }) {
  const [name, setName] = useState(''); const [beds, setBeds] = useState(1); const [baths, setBaths] = useState(1)
  return (
    <Modal open={open} onClose={onClose} title="Add unit type" subtitle="A category of units in this building."
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!name.trim()} onClick={() => { onAdd({ name: name.trim(), beds, baths }); setName(''); setBeds(1); setBaths(1); onClose() }}>Add type</button>
      </>}>
      <div className="col gap-16">
        <Field label="Type name"><input className="input" placeholder="e.g. Studio, Penthouse" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Bedrooms"><input type="number" min={0} className="input" value={beds} onChange={(e) => setBeds(Number(e.target.value))} /></Field>
          <Field label="Bathrooms"><input type="number" min={0} className="input" value={baths} onChange={(e) => setBaths(Number(e.target.value))} /></Field>
        </div>
      </div>
    </Modal>
  )
}

function AddUnitModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (v: Omit<Unit, 'id'>) => void }) {
  const [label, setLabel] = useState(''); const [floor, setFloor] = useState(''); const [status, setStatus] = useState<Unit['status']>('ready')
  return (
    <Modal open={open} onClose={onClose} title="Add unit" subtitle="A specific, bookable unit within this type."
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!label.trim()} onClick={() => { onAdd({ label: label.trim(), floor: floor.trim() || undefined, status }); setLabel(''); setFloor(''); setStatus('ready'); onClose() }}>Add unit</button>
      </>}>
      <div className="col gap-16">
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <Field label="Unit label"><input className="input" placeholder="e.g. Apt 101" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus /></Field>
          <Field label="Floor"><input className="input" placeholder="1" value={floor} onChange={(e) => setFloor(e.target.value)} /></Field>
        </div>
        <Field label="Status">
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value as Unit['status'])}>
            <option value="ready">Ready</option><option value="occupied">Occupied</option>
            <option value="cleaning">Cleaning</option><option value="maintenance">Maintenance</option>
          </select>
        </Field>
      </div>
    </Modal>
  )
}
