import { useState } from 'react'
import { Page, PageHeader } from '../../components/Page'
import { Modal, Field, Empty, Avatar, CategoryBadge } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useStore } from '../../store/StoreContext'
import { CATEGORY_META } from '../../store/data'
import type { Contractor, ServiceCategory } from '../../types'

const CATEGORIES: ServiceCategory[] = ['cleaning', 'maintenance', 'linen', 'inspection', 'custom']
const COLORS = ['var(--sky)', 'var(--amber)', 'var(--violet)', 'var(--grape)', 'var(--mint-700)', 'var(--rose)']

export default function Contractors() {
  const { state } = useStore()
  const [add, setAdd] = useState(false)

  return (
    <Page>
      <PageHeader
        title="Contractors"
        subtitle="Companies and crews you dispatch work to."
        actions={<button className="btn btn-primary" onClick={() => setAdd(true)}><Icon.Plus size={18} /> Add contractor</button>}
      />

      {state.contractors.length === 0 ? (
        <div className="card">
          <Empty icon={<Icon.Users size={26} />} title="No contractors yet"
            text="Add the companies that clean, maintain and supply your properties."
            action={<button className="btn btn-mint" onClick={() => setAdd(true)}><Icon.Plus size={18} /> Add contractor</button>} />
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {state.contractors.map((c) => <ContractorCard key={c.id} c={c} />)}
        </div>
      )}

      <AddContractorModal open={add} onClose={() => setAdd(false)} />
    </Page>
  )
}

function ContractorCard({ c }: { c: Contractor }) {
  const { state, removeContractor } = useStore()
  const jobs = state.tasks.filter((t) => t.contractorId === c.id)
  const openJobs = jobs.filter((t) => t.status !== 'completed').length
  return (
    <div className="card card-pad card-hover">
      <div className="between">
        <div className="row gap-12">
          <Avatar name={c.name} color={c.color} size={48} />
          <div>
            <div className="h3">{c.name}</div>
            <div className="muted tiny">{c.contactName}</div>
          </div>
        </div>
        <span className="pill" style={{ background: c.active ? 'var(--ok-soft)' : 'var(--line-soft)', color: c.active ? 'var(--ok)' : 'var(--slate)', fontWeight: 700 }}>
          <span className="dot" style={{ background: c.active ? 'var(--ok)' : 'var(--slate-400)' }} /> {c.active ? 'Active' : 'Invited'}
        </span>
      </div>

      <div className="row gap-6 wrap mt-16">
        {c.categories.map((cat) => <CategoryBadge key={cat} category={cat} size="sm" />)}
      </div>

      <div className="row gap-16 mt-16 muted tiny wrap">
        <span className="row gap-6"><Icon.Star size={13} /> {c.rating.toFixed(1)}</span>
        <span className="row gap-6"><Icon.List size={13} /> {openJobs} open job{openJobs !== 1 ? 's' : ''}</span>
      </div>

      <div className="row gap-16 mt-16 muted" style={{ fontSize: 12.5, borderTop: '1px solid var(--line-soft)', paddingTop: 14, flexWrap: 'wrap' }}>
        <span className="row gap-6"><Icon.Mail size={13} /> {c.email}</span>
        <span className="row gap-6"><Icon.Phone size={13} /> {c.phone}</span>
      </div>

      <div className="between mt-16">
        <span className="tiny muted">{jobs.length} total job{jobs.length !== 1 ? 's' : ''}</span>
        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}
          onClick={() => { if (confirm(`Remove ${c.name}?`)) removeContractor(c.id) }}>
          <Icon.Trash size={14} /> Remove
        </button>
      </div>
    </div>
  )
}

function AddContractorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addContractor } = useStore()
  const [name, setName] = useState(''); const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState(''); const [phone, setPhone] = useState('')
  const [cats, setCats] = useState<ServiceCategory[]>(['cleaning'])
  const [color, setColor] = useState(COLORS[0])

  const canSave = name.trim() && cats.length > 0

  function toggle(c: ServiceCategory) {
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }
  function reset() { setName(''); setContactName(''); setEmail(''); setPhone(''); setCats(['cleaning']); setColor(COLORS[0]) }

  function save() {
    if (!canSave) return
    addContractor({
      name: name.trim(), contactName: contactName.trim() || name.trim(),
      email: email.trim(), phone: phone.trim(), categories: cats, color,
      rating: 5, active: false,
    })
    reset(); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add a contractor" subtitle="Onboard a company or crew — they'll appear in the service portal."
      wide
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!canSave} onClick={save}>Add contractor</button>
      </>}>
      <div className="col gap-16">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Company / crew name"><input className="input" placeholder="Sparkle Cleaning Co." value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
          <Field label="Contact person"><input className="input" placeholder="Marta Novak" value={contactName} onChange={(e) => setContactName(e.target.value)} /></Field>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Email"><input className="input" type="email" placeholder="hello@company.com" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Phone"><input className="input" placeholder="+31 6 …" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        </div>

        <Field label="Services provided" hint="Tasks in these categories will be matched to this contractor.">
          <div className="row gap-8 wrap">
            {CATEGORIES.map((c) => {
              const m = CATEGORY_META[c]; const on = cats.includes(c)
              return (
                <button key={c} onClick={() => toggle(c)} className="pill" style={{
                  padding: '9px 14px', fontSize: 13.5, cursor: 'pointer', border: '1.5px solid',
                  borderColor: on ? m.color : 'var(--line)', background: on ? m.soft : '#fff',
                  color: on ? m.color : 'var(--slate)', fontWeight: 700,
                }}>{m.emoji} {m.label}</button>
              )
            })}
          </div>
        </Field>

        <Field label="Brand colour">
          <div className="row gap-8">
            {COLORS.map((k) => (
              <button key={k} onClick={() => setColor(k)} style={{
                width: 36, height: 36, borderRadius: 10, background: k, cursor: 'pointer',
                border: color === k ? '3px solid var(--ink)' : '3px solid transparent',
              }} />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  )
}
