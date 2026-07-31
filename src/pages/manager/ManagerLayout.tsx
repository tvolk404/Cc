import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Icon } from '../../components/icons'
import { useStore } from '../../store/StoreContext'
import { logoUrl } from '../../brand'

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
    <div className="mgr-shell">
      <aside className="mgr-sidebar">
        <div className="mgr-brand">
          <img src={logoUrl} width={30} height={30} alt="" />
          <div className="nl-label">
            <div style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: 16 }}>Turnkey</div>
            <div className="faint" style={{ fontSize: 11 }}>Manager</div>
          </div>
        </div>

        <nav className="col gap-4" style={{ marginTop: 8 }}>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')} title={n.label}>
              <n.icon size={19} /> <span className="nl-label">{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mgr-foot col gap-4">
          <button className="navlink" onClick={resetDemo} title="Reset demo data">
            <Icon.Sparkle size={19} /> <span className="nl-label">Reset demo</span>
          </button>
          <button className="navlink" onClick={() => nav('/')} title="Switch portal">
            <Icon.Logout size={19} /> <span className="nl-label">Switch portal</span>
          </button>
        </div>
      </aside>

      <div className="mgr-main">
        <Outlet />
      </div>

      <style>{`
        .mgr-shell { display: flex; min-height: 100vh; }
        .mgr-sidebar {
          width: var(--sidebar-w); flex-shrink: 0; position: sticky; top: 0; height: 100vh;
          padding: 20px 14px; display: flex; flex-direction: column;
          background: var(--surface); border-right: 1px solid var(--line);
        }
        .mgr-brand { display: flex; align-items: center; gap: 11px; padding: 6px 10px 16px; }
        .mgr-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .mgr-foot { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--line); }
        .navlink {
          display: flex; align-items: center; gap: 13px; padding: 10px 13px;
          border-radius: 12px; font-weight: 600; font-size: 14.5px; color: var(--muted);
          border: none; background: transparent; width: 100%; text-align: left; transition: .13s;
        }
        .navlink:hover { background: rgba(23,22,28,0.05); color: var(--ink); }
        .navlink.active { background: var(--ink); color: #fff; }
        /* Icon-rail collapse on narrow screens — stays a web app, never a bottom bar */
        @media (max-width: 980px) {
          .mgr-sidebar { width: 72px; padding: 16px 12px; align-items: center; }
          .mgr-brand { padding: 6px 0 14px; justify-content: center; }
          .nl-label { display: none; }
          .navlink { justify-content: center; padding: 12px; gap: 0; }
        }
      `}</style>
    </div>
  )
}
