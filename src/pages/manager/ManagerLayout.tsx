import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Icon } from '../../components/icons'
import { useStore } from '../../store/StoreContext'

const NAV = [
  { to: '/manager', end: true, label: 'Dashboard', icon: Icon.Grid },
  { to: '/manager/properties', label: 'Properties', icon: Icon.Building },
  { to: '/manager/contractors', label: 'Contractors', icon: Icon.Users },
  { to: '/manager/tasks', label: 'Tasks', icon: Icon.List },
  { to: '/manager/schedule', label: 'Schedule', icon: Icon.Calendar },
]

export default function ManagerLayout() {
  const nav = useNavigate()
  const { resetDemo } = useStore()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar (desktop) */}
      <aside className="mgr-sidebar">
        <div className="row gap-10" style={{ padding: '6px 10px 22px' }}>
          <img src="/logo.svg" width={30} height={30} alt="" />
          <div>
            <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Turnkey</div>
            <div className="muted" style={{ fontSize: 11.5 }}>Manager workspace</div>
          </div>
        </div>

        <nav className="col gap-6">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
              <n.icon size={19} /> {n.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }} className="col gap-6">
          <button className="navlink" onClick={resetDemo}>
            <Icon.Sparkle size={19} /> Reset demo data
          </button>
          <button className="navlink" onClick={() => nav('/')}>
            <Icon.Logout size={19} /> Switch portal
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="mobile-nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => 'mnav' + (isActive ? ' active' : '')}>
            <n.icon size={21} />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        .mgr-sidebar {
          width: 248px; flex-shrink: 0; position: sticky; top: 0; height: 100vh;
          padding: 22px 16px; display: flex; flex-direction: column;
          background: #fff; border-right: 1px solid var(--line);
        }
        .navlink {
          display: flex; align-items: center; gap: 12px; padding: 11px 14px;
          border-radius: 12px; font-weight: 600; font-size: 14.5px; color: var(--slate);
          border: none; background: transparent; width: 100%; text-align: left; transition: .14s;
        }
        .navlink:hover { background: var(--line-soft); color: var(--ink); }
        .navlink.active { background: var(--ink); color: #fff; }
        .mobile-nav { display: none; }
        @media (max-width: 860px) {
          .mgr-sidebar { display: none; }
          .mobile-nav {
            display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
            background: rgba(255,255,255,0.92); backdrop-filter: blur(12px);
            border-top: 1px solid var(--line); padding: 8px 6px calc(8px + env(safe-area-inset-bottom));
          }
          .mnav { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
            color: var(--slate-400); font-size: 10.5px; font-weight: 600; padding: 4px; }
          .mnav.active { color: var(--mint-700); }
        }
      `}</style>
    </div>
  )
}
