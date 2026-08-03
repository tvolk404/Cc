import type { SVGProps } from 'react'

type Icon = (p: SVGProps<SVGSVGElement>) => JSX.Element

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export const HomeIcon: Icon = (p) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
  </svg>
)

export const CardIcon: Icon = (p) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 9.5h19" />
  </svg>
)

export const ListIcon: Icon = (p) => (
  <svg {...base(p)}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const PaymentsIcon: Icon = (p) => (
  <svg {...base(p)}>
    <path d="M4 8h13M4 8l3-3M4 8l3 3" />
    <path d="M20 16H7M20 16l-3-3M20 16l-3 3" />
  </svg>
)

export const CalendarIcon: Icon = (p) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
  </svg>
)

export const RepeatIcon: Icon = (p) => (
  <svg {...base(p)}>
    <path d="M4 9a6 6 0 0 1 10-2l2 2M20 6v3h-3" />
    <path d="M20 15a6 6 0 0 1-10 2l-2-2M4 18v-3h3" />
  </svg>
)

export const CardRepeatIcon: Icon = (p) => (
  <svg {...base(p)}>
    <path d="M20 9a7 7 0 0 0-12-3M4 6v3h3" />
    <rect x="4" y="12" width="16" height="8" rx="2" />
    <path d="M4 15h16" />
  </svg>
)

export const RequestIcon: Icon = (p) => (
  <svg {...base(p)}>
    <rect x="3.5" y="4" width="17" height="16" rx="3" />
    <path d="M8 12l2.5 2.5L16 9" />
  </svg>
)

export const SplitIcon: Icon = (p) => (
  <svg {...base(p)}>
    <path d="M6 20v-6M6 14 3 10h6l-3 4Z" />
    <path d="M12 20V4M18 20v-9M18 11l-2.5-3.5h5L18 11Z" />
  </svg>
)

export const RecipientsIcon: Icon = (p) => (
  <svg {...base(p)}>
    <circle cx="8.5" cy="8" r="3.2" />
    <path d="M3 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M17 14.4c2.3.5 4 2.3 4 4.6" />
  </svg>
)

export const InsightsIcon: Icon = (p) => (
  <svg {...base(p)}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)

export const ChevronDown: Icon = (p) => (
  <svg {...base({ width: 18, height: 18, ...p })}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const ChevronRight: Icon = (p) => (
  <svg {...base({ width: 20, height: 20, ...p })}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const ArrowLeft: Icon = (p) => (
  <svg {...base({ width: 22, height: 22, ...p })}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export const SearchIcon: Icon = (p) => (
  <svg {...base({ width: 19, height: 19, ...p })}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
)

export const FiltersIcon: Icon = (p) => (
  <svg {...base({ width: 18, height: 18, ...p })}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2.2" />
    <circle cx="8" cy="17" r="2.2" />
  </svg>
)

export const DownloadIcon: Icon = (p) => (
  <svg {...base({ width: 18, height: 18, ...p })}>
    <path d="M12 4v10M8 10l4 4 4-4" />
    <path d="M5 19h14" />
  </svg>
)
