import { useMemo, useState } from 'react'
import { Modal, Field } from './ui'
import { Icon } from './icons'
import { CATEGORY_META } from '../store/data'
import { useStore } from '../store/StoreContext'
import { allUnits, todayIso } from '../lib'
import type { ServiceCategory, Task } from '../types'

const CATEGORIES: ServiceCategory[] = ['cleaning', 'maintenance', 'linen', 'inspection', 'custom']

interface Props {
  open: boolean
  onClose: () => void
  onSaved?: (t: Task) => void
  editing?: Task | null
  preset?: { propertyId?: string; unitId?: string; unitTypeId?: string; date?: string }
}

export default function TaskModal({ open, onClose, onSaved, editing, preset }: Props) {
  const { state, addTask, updateTask } = useStore()

  const [title, setTitle] = useState(editing?.title ?? '')
  const [category, setCategory] = useState<ServiceCategory>(editing?.category ?? 'cleaning')
  const [propertyId, setPropertyId] = useState(editing?.propertyId ?? preset?.propertyId ?? state.properties[0]?.id ?? '')
  const [unitId, setUnitId] = useState<string>(editing?.unitId ?? preset?.unitId ?? '')
  const [contractorId, setContractorId] = useState<string>(editing?.contractorId ?? '')
  const [date, setDate] = useState(editing?.date ?? preset?.date ?? todayIso())
  const [time, setTime] = useState(editing?.time ?? '10:00')
  const [durationMin, setDurationMin] = useState(editing?.durationMin ?? 60)
  const [priority, setPriority] = useState<Task['priority']>(editing?.priority ?? 'normal')
  const [recurrence, setRecurrence] = useState<Task['recurrence']>(editing?.recurrence ?? 'none')
  const [notes, setNotes] = useState(editing?.notes ?? '')

  const property = state.properties.find((p) => p.id === propertyId)
  const units = property ? allUnits(property) : []

  // contractors that can service selected category (but allow any)
  const matched = useMemo(
    () => state.contractors.filter((c) => c.categories.includes(category)),
    [state.contractors, category],
  )
  const others = state.contractors.filter((c) => !c.categories.includes(category))

  const canSave = title.trim() && propertyId && date && time

  function save() {
    if (!canSave) return
    const unitType = property?.unitTypes.find((ut) => ut.units.some((u) => u.id === unitId))
    const payload = {
      title: title.trim(), category, propertyId,
      unitId: unitId || undefined, unitTypeId: unitType?.id,
      contractorId: contractorId || undefined,
      date, time, durationMin, priority, recurrence,
      notes: notes.trim() || undefined,
      status: editing?.status ?? ('scheduled' as const),
    }
    if (editing) {
      updateTask(editing.id, payload)
      onSaved?.({ ...editing, ...payload })
    } else {
      const t = addTask(payload)
      onSaved?.(t)
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit task' : 'Schedule a task'}
      subtitle={editing ? 'Update the details of this job.' : 'Create a job and dispatch it to a contractor.'}
      wide
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!canSave} onClick={save}>
            {editing ? 'Save changes' : 'Schedule task'}
          </button>
        </>
      }
    >
      <div className="col gap-16">
        <Field label="What needs doing?">
          <input className="input" placeholder="e.g. Turnover clean after checkout"
            value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </Field>

        <Field label="Category">
          <div className="row gap-8 wrap">
            {CATEGORIES.map((c) => {
              const m = CATEGORY_META[c]
              const Ico = Icon[m.icon]
              const on = category === c
              return (
                <button key={c} onClick={() => setCategory(c)} className="pill" style={{
                  padding: '9px 14px', fontSize: 13.5, cursor: 'pointer', border: '1px solid',
                  borderColor: on ? m.color : 'var(--line-strong)',
                  background: on ? m.bg : 'var(--surface)', color: on ? m.color : 'var(--muted)', fontWeight: 600,
                }}>
                  <Ico size={14} strokeWidth={2} /> {m.label}
                </button>
              )
            })}
          </div>
        </Field>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Property">
            <select className="select" value={propertyId} onChange={(e) => { setPropertyId(e.target.value); setUnitId('') }}>
              {state.properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label={property?.kind === 'multi' ? 'Unit' : 'Unit (whole property)'}>
            <select className="select" value={unitId} onChange={(e) => setUnitId(e.target.value)} disabled={property?.kind !== 'multi'}>
              <option value="">{property?.kind === 'multi' ? 'Whole building / unassigned' : 'Entire property'}</option>
              {units.map(({ unit, typeName }) => (
                <option key={unit.id} value={unit.id}>{unit.label} — {typeName}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Assign contractor" hint="Green matches this category. You can also leave it unassigned.">
          <select className="select" value={contractorId} onChange={(e) => setContractorId(e.target.value)}>
            <option value="">Unassigned</option>
            {matched.length > 0 && (
              <optgroup label="Matches category">
                {matched.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            )}
            {others.length > 0 && (
              <optgroup label="Other contractors">
                {others.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            )}
          </select>
        </Field>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <Field label="Date">
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Time">
            <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
          <Field label="Duration">
            <select className="select" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))}>
              {[30, 45, 60, 90, 120, 180, 240].map((m) => (
                <option key={m} value={m}>{m < 60 ? `${m} min` : `${m / 60} h${m % 60 ? ' 30m' : ''}`}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Priority">
            <div className="seg" style={{ width: '100%' }}>
              {(['low', 'normal', 'high'] as const).map((p) => (
                <button key={p} className={priority === p ? 'active' : ''} style={{ flex: 1, textTransform: 'capitalize' }} onClick={() => setPriority(p)}>{p}</button>
              ))}
            </div>
          </Field>
          <Field label="Repeats">
            <select className="select" value={recurrence} onChange={(e) => setRecurrence(e.target.value as Task['recurrence'])}>
              <option value="none">One-off</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea className="textarea" placeholder="Access codes, guest timing, special instructions…"
            value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
    </Modal>
  )
}
