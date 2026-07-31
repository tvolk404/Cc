import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, PageHeader } from '../../components/Page'
import { Modal, Field, Empty } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useStore } from '../../store/StoreContext'
import { GRADIENTS, GRADIENT_KEYS } from '../../store/data'
import { propUnitCount } from '../../lib'
import type { Property, PropertyKind } from '../../types'

export default function Properties() {
  const { state } = useStore()
  const nav = useNavigate()
  const [add, setAdd] = useState(false)

  return (
    <Page>
      <PageHeader
        title="Properties"
        subtitle="Your portfolio — single homes and multi-unit buildings."
        actions={<button className="btn btn-primary" onClick={() => setAdd(true)}><Icon.Plus size={18} /> Add property</button>}
      />

      {state.properties.length === 0 ? (
        <div className="card">
          <Empty icon={<Icon.Building size={26} />} title="No properties yet"
            text="Add your first property to start scheduling work across its units."
            action={<button className="btn btn-mint" onClick={() => setAdd(true)}><Icon.Plus size={18} /> Add property</button>} />
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {state.properties.map((p) => (
            <PropertyCard key={p.id} p={p} onClick={() => nav(`/manager/properties/${p.id}`)} />
          ))}
        </div>
      )}

      <AddPropertyModal open={add} onClose={() => setAdd(false)} />
    </Page>
  )
}

function PropertyCard({ p, onClick }: { p: Property; onClick: () => void }) {
  const units = propUnitCount(p)
  return (
    <button onClick={onClick} className="card card-hover" style={{ padding: 0, overflow: 'hidden', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--line)' }}>
      <div style={{ height: 118, background: GRADIENTS[p.photo], position: 'relative' }}>
        <span className="pill" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.9)', color: 'var(--ink)', fontWeight: 700 }}>
          {p.kind === 'multi' ? <><Icon.Layers size={13} /> Multi-unit</> : <><Icon.Home size={13} /> Single unit</>}
        </span>
      </div>
      <div className="card-pad">
        <div className="h3">{p.name}</div>
        <div className="muted tiny row gap-6 mt-4"><Icon.Pin size={13} /> {p.address}, {p.city}</div>
        <div className="row gap-8 mt-16 wrap">
          <span className="pill"><Icon.Door size={13} /> {units} unit{units !== 1 ? 's' : ''}</span>
          {p.kind === 'multi' && <span className="pill"><Icon.Layers size={13} /> {p.unitTypes.length} type{p.unitTypes.length !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </button>
  )
}

function AddPropertyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProperty, addUnitType } = useStore()
  const nav = useNavigate()
  const [kind, setKind] = useState<PropertyKind>('single')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [beds, setBeds] = useState(2)
  const [baths, setBaths] = useState(1)
  const [photo, setPhoto] = useState(GRADIENT_KEYS[0])
  // optional first unit type for multi
  const [firstType, setFirstType] = useState('')

  const canSave = name.trim() && address.trim() && city.trim()

  function reset() {
    setKind('single'); setName(''); setAddress(''); setCity(''); setBeds(2); setBaths(1); setPhoto(GRADIENT_KEYS[0]); setFirstType('')
  }

  function save(goToDetail: boolean) {
    if (!canSave) return
    const p = addProperty({
      name: name.trim(), kind, address: address.trim(), city: city.trim(), photo,
      unitTypes: [],
      ...(kind === 'single' ? { beds, baths, singleStatus: 'ready' as const } : {}),
    })
    if (kind === 'multi' && firstType.trim()) {
      addUnitType(p.id, { name: firstType.trim(), beds, baths })
    }
    reset()
    onClose()
    if (goToDetail) nav(`/manager/properties/${p.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add a property" subtitle="Add each property manually — pick its type below."
      wide
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-outline" disabled={!canSave} onClick={() => save(false)}>Save</button>
          <button className="btn btn-primary" disabled={!canSave} onClick={() => save(true)}>Save & set up units</button>
        </>
      }>
      <div className="col gap-16">
        <Field label="Property type">
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <KindOption active={kind === 'single'} onClick={() => setKind('single')}
              icon={<Icon.Home size={22} />} title="Single unit" text="A home or apartment let as one whole unit." />
            <KindOption active={kind === 'multi'} onClick={() => setKind('multi')}
              icon={<Icon.Layers size={22} />} title="Multi unit" text="A building with unit types, each holding specific units." />
          </div>
        </Field>

        <Field label="Property name">
          <input className="input" placeholder="e.g. Riverside Lofts" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </Field>

        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <Field label="Address"><input className="input" placeholder="14 Canal Street" value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
          <Field label="City"><input className="input" placeholder="Amsterdam" value={city} onChange={(e) => setCity(e.target.value)} /></Field>
        </div>

        {kind === 'single' ? (
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Field label="Bedrooms"><input type="number" min={0} className="input" value={beds} onChange={(e) => setBeds(Number(e.target.value))} /></Field>
            <Field label="Bathrooms"><input type="number" min={0} className="input" value={baths} onChange={(e) => setBaths(Number(e.target.value))} /></Field>
          </div>
        ) : (
          <Field label="First unit type (optional)" hint="You can add more types and their units after saving.">
            <input className="input" placeholder="e.g. Studio, 1-Bedroom Deluxe" value={firstType} onChange={(e) => setFirstType(e.target.value)} />
          </Field>
        )}

        <Field label="Cover colour">
          <div className="row gap-8 wrap">
            {GRADIENT_KEYS.map((k) => (
              <button key={k} onClick={() => setPhoto(k)} style={{
                width: 44, height: 44, borderRadius: 12, background: GRADIENTS[k], cursor: 'pointer',
                border: photo === k ? '3px solid var(--ink)' : '3px solid transparent',
                boxShadow: photo === k ? '0 0 0 2px #fff inset' : 'none',
              }} />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  )
}

function KindOption({ active, onClick, icon, title, text }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; text: string }) {
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', border: '1.5px solid', borderColor: active ? 'var(--mint-600)' : 'var(--line)',
      background: active ? 'var(--mint-tint)' : '#fff', borderRadius: 16, padding: 16, cursor: 'pointer', transition: '.15s',
    }}>
      <div style={{ color: active ? 'var(--mint-700)' : 'var(--slate)' }}>{icon}</div>
      <div className="h3" style={{ marginTop: 10 }}>{title}</div>
      <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.4 }}>{text}</div>
    </button>
  )
}
