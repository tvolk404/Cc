import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  CardIcon,
  ListIcon,
  PaymentsIcon,
  CalendarIcon,
  RepeatIcon,
  CardRepeatIcon,
  RequestIcon,
  SplitIcon,
  RecipientsIcon,
  InsightsIcon,
  ChevronDown,
} from '../icons'

const WiseWordmark = () => (
  <svg viewBox="0 0 96 24" fill="none" aria-label="Wise">
    <path
      d="M13.2 2.5 4.7 12l3.6 4.6H3.9L2 12l4.7-5.2H2.4l.8-4.3h10Z"
      fill="#163300"
    />
    <text
      x="18"
      y="18.5"
      fontFamily="Inter, sans-serif"
      fontWeight="800"
      fontSize="20"
      fill="#163300"
    >
      wise
    </text>
  </svg>
)

const primary = [
  { to: '/home', label: 'Home', icon: HomeIcon },
  { to: '/cards', label: 'Cards', icon: CardIcon },
  { to: '/transactions', label: 'Transactions', icon: ListIcon },
]

const paymentsChildren = [
  { to: '/payments/scheduled', label: 'Scheduled', icon: CalendarIcon },
  { to: '/payments/direct-debits', label: 'Direct Debits', icon: RepeatIcon },
  {
    to: '/payments/recurring-card',
    label: 'Recurring card payments',
    icon: CardRepeatIcon,
  },
  { to: '/payments/requests', label: 'Payment requests', icon: RequestIcon },
  { to: '/payments/bill-splits', label: 'Bill splits', icon: SplitIcon },
]

const secondary = [
  { to: '/recipients', label: 'Recipients', icon: RecipientsIcon },
  { to: '/insights', label: 'Insights', icon: InsightsIcon },
]

export default function Sidebar() {
  const location = useLocation()
  const paymentsActive = location.pathname.startsWith('/payments')
  const [paymentsOpen, setPaymentsOpen] = useState(true)

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <WiseWordmark />
      </div>

      <nav className="nav">
        {primary.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'nav__item' + (isActive ? ' nav__item--active' : '')
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}

        <button
          className={
            'nav__item nav__item--parent' +
            (paymentsActive ? ' nav__item--active' : '')
          }
          onClick={() => setPaymentsOpen((v) => !v)}
        >
          <span className="nav__item-left">
            <PaymentsIcon />
            <span>Payments</span>
          </span>
          <ChevronDown
            className={'nav__chevron' + (paymentsOpen ? ' nav__chevron--open' : '')}
          />
        </button>

        {paymentsOpen && (
          <div className="nav__sub">
            {paymentsChildren.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  'nav__item' + (isActive ? ' nav__item--active' : '')
                }
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {secondary.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'nav__item' + (isActive ? ' nav__item--active' : '')
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
