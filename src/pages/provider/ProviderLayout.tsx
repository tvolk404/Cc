import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { Icon } from '../../components/icons'
import { Avatar } from '../../components/ui'
import { useStore } from '../../store/StoreContext'
import type { Contractor } from '../../types'

const KEY = 'turnkey.provider.id'

export interface ProviderCtx { contractor: Contractor }
export const useProvider = () => useOutletContext<ProviderCtx>()

export default function ProviderLayout() {
  const { state, updateContractor } = useStore()
  const nav = useNavigate()
  const [id, setId] = useState<string>(() => localStorage.getItem(KEY) || state.contractors[0]?.id || '')
  const [switcher, setSwitcher] = useState(false)

  useEffect(() => { if (id) localStorage.setItem(KEY, id) }, [id])
  // mark active when viewing the portal as this contractor
  useEffect(() => { if (id) updateContractor(id, { active: true }) }, [id])

  const contractor = state.contractors.find((c) => c.id === id) || state.contractors[0]

  if (!contractor) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div className="card card-pad" style={{ textAlign: 'center', maxWidth: 360 }}>
          <div className="h3">No contractors yet</div>
          <p className="muted mt-8">A property manager needs to add your company first.</p>
          <button className="btn btn-primary mt-16" onClick={() => nav('/')}>Back to start</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)' }}>
      {/* Top bar */}
      <header style={{ background: '#fff', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="between" style={{ maxWidth: 960, margin: '0 auto', padding: '14px 20px' }}>
          <div className="row gap-10">
            <img src="/logo.svg" width={28} height={28} alt="" />
            <div>
              <div style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: 15 }}>Turnkey</div>
              <div className="muted" style={{ fontSize: 11 }}>Service workspace</div>
            </div>
          </div>

          <div className="row gap-8" style={{ position: 'relative' }}>
            <button className="row gap-8" onClick={() => setSwitcher((s) => !s)} style={{ background: 'var(--line-soft)', border: 'none', borderRadius: 999, padding: '6px 12px 6px 6px', cursor: 'pointer' }}>
              <Avatar name={contractor.name} color={contractor.color} size={30} />
              <span style={{ fontWeight: 700, fontSize: 13.5, maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contractor.name}</span>
              <Icon.ChevronDown size={16} />
            </button>
            {switcher && (
              <div className="card" style={{ position: 'absolute', top: 48, right: 0, width: 250, padding: 8, boxShadow: 'var(--shadow-lg)', zIndex: 40 }}>
                <div className="eyebrow" style={{ padding: '6px 10px' }}>Viewing as</div>
                {state.contractors.map((c) => (
                  <button key={c.id} className="row gap-10" onClick={() => { setId(c.id); setSwitcher(false) }}
                    style={{ width: '100%', textAlign: 'left', background: c.id === id ? 'var(--line-soft)' : 'transparent', border: 'none', borderRadius: 10, padding: 10, cursor: 'pointer' }}>
                    <Avatar name={c.name} color={c.color} size={30} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{c.categories.length} service{c.categories.length !== 1 ? 's' : ''}</div>
                    </div>
                    {c.id === id && <Icon.Check size={16} />}
                  </button>
                ))}
                <button className="row gap-10" onClick={() => nav('/')} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', borderTop: '1px solid var(--line-soft)', marginTop: 4, padding: 10, cursor: 'pointer', color: 'var(--slate)', fontWeight: 600, fontSize: 13.5 }}>
                  <Icon.Logout size={17} /> Switch portal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
          <div className="row gap-4" style={{ gap: 4 }}>
            <PTab to="/provider" end label="Overview" icon={<Icon.Grid size={17} />} />
            <PTab to="/provider/tasks" label="My jobs" icon={<Icon.List size={17} />} />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(20px, 4vw, 36px) 20px 60px' }}>
        <Outlet context={{ contractor } satisfies ProviderCtx} />
      </main>

      <style>{`
        .ptab { display: flex; align-items: center; gap: 8px; padding: 12px 14px; font-weight: 600;
          font-size: 14px; color: var(--slate); border-bottom: 2.5px solid transparent; margin-bottom: -1px; }
        .ptab.active { color: var(--ink); border-color: var(--ink); }
      `}</style>
    </div>
  )
}

function PTab({ to, end, label, icon }: { to: string; end?: boolean; label: string; icon: React.ReactNode }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => 'ptab' + (isActive ? ' active' : '')}>
      {icon} {label}
    </NavLink>
  )
}
