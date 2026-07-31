import type { ReactNode } from 'react'

export function Page({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 'clamp(20px, 4vw, 40px)', paddingBottom: 100, maxWidth: 1160, width: '100%', margin: '0 auto' }}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="between wrap gap-16" style={{ marginBottom: 28 }}>
      <div>
        <h1 className="h1">{title}</h1>
        {subtitle && <p className="muted mt-4" style={{ fontSize: 15 }}>{subtitle}</p>}
      </div>
      {actions && <div className="row gap-10 wrap">{actions}</div>}
    </div>
  )
}
