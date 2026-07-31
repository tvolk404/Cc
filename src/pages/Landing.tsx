import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/icons'
import { logoUrl } from '../brand'

function Logo() {
  return (
    <div className="row gap-10">
      <img src={logoUrl} width={34} height={34} alt="" />
      <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>Turnkey</span>
    </div>
  )
}

export default function Landing() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100%', background: 'radial-gradient(1200px 600px at 80% -10%, #e9fff8 0%, transparent 55%), var(--canvas)' }}>
      <header className="between" style={{ maxWidth: 1120, margin: '0 auto', padding: '26px 24px' }}>
        <Logo />
        <div className="row gap-8">
          <button className="btn btn-ghost btn-sm" onClick={() => nav('/provider')}>For service teams</button>
          <button className="btn btn-primary btn-sm" onClick={() => nav('/manager')}>Open app</button>
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 720 }}>
          <div className="pill" style={{ background: 'var(--mint-soft)', color: 'var(--mint-700)', fontWeight: 700 }}>
            <Icon.Bolt size={14} /> Property operations, scheduled
          </div>
          <h1 className="h1" style={{ fontSize: 'clamp(38px, 6vw, 60px)', lineHeight: 1.02, marginTop: 20 }}>
            Every clean, fix and turnover — <span style={{ color: 'var(--mint-700)' }}>handled on time.</span>
          </h1>
          <p className="muted" style={{ fontSize: 18, marginTop: 20, maxWidth: 560, lineHeight: 1.5 }}>
            Turnkey is the scheduling hub for property managers and the service teams they rely on.
            Plan cleaning, maintenance and linen across every unit — and dispatch it to the right crew in seconds.
          </p>
        </div>

        {/* Two entry points */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: 44 }}>
          <EntryCard
            onClick={() => nav('/manager')}
            gradient="linear-gradient(135deg,#0a0e17,#2a3142)"
            eyebrow="Portal one"
            icon={<Icon.Building size={26} />}
            title="I manage properties"
            text="Add properties, build unit maps, onboard contractors and schedule every task across your portfolio."
            cta="Enter manager workspace"
          />
          <EntryCard
            onClick={() => nav('/provider')}
            gradient="linear-gradient(135deg,#1de9b6,#10c99c)"
            dark
            eyebrow="Portal two"
            icon={<Icon.Wrench size={26} />}
            title="I provide services"
            text="See jobs assigned to your company, accept them, and mark work in progress or complete."
            cta="Enter service workspace"
          />
        </div>

        {/* Feature strip */}
        <div className="grid mt-24" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', marginTop: 56 }}>
          <Feature icon={<Icon.Layers size={20} />} title="Single & multi-unit" text="Model unit types and specific units for buildings of any size." />
          <Feature icon={<Icon.Calendar size={20} />} title="Smart scheduling" text="One-off or recurring tasks with time, duration and priority." />
          <Feature icon={<Icon.Users size={20} />} title="Contractor network" text="Add companies, match them to service categories, dispatch instantly." />
          <Feature icon={<Icon.Bell size={20} />} title="Live status" text="Watch jobs move from scheduled to done — in real time." />
        </div>
      </main>
    </div>
  )
}

function EntryCard({ onClick, gradient, dark, eyebrow, icon, title, text, cta }: {
  onClick: () => void; gradient: string; dark?: boolean; eyebrow: string
  icon: React.ReactNode; title: string; text: string; cta: string
}) {
  const fg = dark ? 'var(--ink)' : '#fff'
  return (
    <button onClick={onClick} className="card-hover" style={{
      textAlign: 'left', border: 'none', borderRadius: 'var(--r-xl)', padding: 30,
      background: gradient, color: fg, cursor: 'pointer', minHeight: 260,
      display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: dark ? 'rgba(10,14,23,0.12)' : 'rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center' }}>
        {icon}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7 }}>{eyebrow}</div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>{title}</div>
        <div style={{ opacity: 0.8, marginTop: 8, fontSize: 15, lineHeight: 1.45 }}>{text}</div>
        <div className="row gap-8" style={{ marginTop: 20, fontWeight: 700 }}>
          {cta} <Icon.Arrow size={18} />
        </div>
      </div>
    </button>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card card-pad">
      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--mint-tint)', color: 'var(--mint-700)', display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div className="h3" style={{ marginTop: 14 }}>{title}</div>
      <div className="muted tiny mt-4" style={{ lineHeight: 1.45 }}>{text}</div>
    </div>
  )
}
