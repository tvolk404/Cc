import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './icons'
import type { ServiceCategory, TaskStatus } from '../types'
import { CATEGORY_META } from '../store/data'

/* ---------- Modal ---------- */
export function Modal({
  open, onClose, title, subtitle, children, footer, wide,
}: {
  open: boolean; onClose: () => void; title: string; subtitle?: string
  children: ReactNode; footer?: ReactNode; wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="overlay" onClick={onClose}>
      <div className={'modal' + (wide ? ' modal-lg' : '')} onClick={(e) => e.stopPropagation()}>
        <div className="between" style={{ padding: '22px 24px 6px' }}>
          <div>
            <div className="h2">{title}</div>
            {subtitle && <div className="muted tiny mt-4">{subtitle}</div>}
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close">
            <Icon.X size={20} />
          </button>
        </div>
        <div style={{ padding: '14px 24px 24px' }}>{children}</div>
        {footer && (
          <div className="between" style={{ padding: '16px 24px', borderTop: '1px solid var(--line-soft)', gap: 10, justifyContent: 'flex-end' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Field wrappers ---------- */
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="muted" style={{ fontSize: 12 }}>{hint}</span>}
    </label>
  )
}

/* ---------- Category icon chip (replaces emoji) ---------- */
export function CategoryIcon({ category, size = 44 }: { category: ServiceCategory; size?: number }) {
  const m = CATEGORY_META[category]
  const Ico = Icon[m.icon]
  return (
    <span className="ichip" style={{ width: size, height: size, background: m.bg, color: m.color, borderRadius: size <= 26 ? 8 : 12 }}>
      <Ico size={Math.round(size * 0.5)} strokeWidth={1.9} />
    </span>
  )
}

/* ---------- Category badge ---------- */
export function CategoryBadge({ category, size = 'md' }: { category: ServiceCategory; size?: 'sm' | 'md' }) {
  const m = CATEGORY_META[category]
  const Ico = Icon[m.icon]
  return (
    <span className="pill" style={{ background: m.bg, color: m.color, fontWeight: 600, fontSize: size === 'sm' ? 11.5 : 12 }}>
      <Ico size={13} strokeWidth={2} /> {m.label}
    </span>
  )
}

/* ---------- Status badge ---------- */
const STATUS_META: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: 'var(--st-sched)', bg: 'var(--st-sched-bg)' },
  accepted: { label: 'Accepted', color: 'var(--st-accept)', bg: 'var(--st-accept-bg)' },
  in_progress: { label: 'In progress', color: 'var(--st-prog)', bg: 'var(--st-prog-bg)' },
  completed: { label: 'Completed', color: 'var(--st-done)', bg: 'var(--st-done-bg)' },
  declined: { label: 'Declined', color: 'var(--st-decl)', bg: 'var(--st-decl-bg)' },
}
export function StatusBadge({ status }: { status: TaskStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="pill" style={{ background: m.bg, color: m.color, fontWeight: 600 }}>
      <span className="dot" style={{ background: m.color }} /> {m.label}
    </span>
  )
}

/* ---------- Avatar ---------- */
export function Avatar({ name, color, size = 40 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <span className="avatar" style={{ width: size, height: size, background: color || 'var(--ink)', fontSize: size * 0.38 }}>
      {initials}
    </span>
  )
}

/* ---------- Stat card ---------- */
export function Stat({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: ReactNode; accent?: string }) {
  return (
    <div className="card card-pad">
      <div className="eyebrow">{label}</div>
      <div className="h1" style={{ marginTop: 10, color: accent || 'var(--ink)' }}>{value}</div>
      {sub && <div className="muted tiny mt-4">{sub}</div>}
    </div>
  )
}

/* ---------- Empty state ---------- */
export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-ico">{icon}</div>
      <div className="h3">{title}</div>
      <div className="muted mt-4" style={{ maxWidth: 340, margin: '4px auto 0' }}>{text}</div>
      {action && <div className="mt-16">{action}</div>}
    </div>
  )
}

/* ---------- Toast (very small) ---------- */
export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--ink)', color: '#fff', padding: '12px 20px', borderRadius: 999,
      fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow-lg)', zIndex: 90,
      display: 'flex', alignItems: 'center', gap: 8, animation: 'slideUp .2s ease',
    }}>
      <Icon.Check size={17} /> {msg}
    </div>
  )
}
