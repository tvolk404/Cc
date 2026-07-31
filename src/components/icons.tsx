interface IconProps { size?: number; className?: string; strokeWidth?: number }

const base = (size = 20, sw = 1.8) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const Icon = {
  Grid: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
  ),
  Home: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>
  ),
  Building: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/><path d="M10 21v-3h4v3"/></svg>
  ),
  Users: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M17.5 20a5.5 5.5 0 0 0-2.2-4.4"/></svg>
  ),
  Calendar: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>
  ),
  List: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>
  ),
  Plus: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M12 5v14M5 12h14"/></svg>
  ),
  Check: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M5 12.5l4.5 4.5L19 6"/></svg>
  ),
  X: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M6 6l12 12M18 6L6 18"/></svg>
  ),
  Clock: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
  ),
  Pin: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
  ),
  Bolt: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M13 2L4 13h6l-1 9 9-11h-6l1-9z"/></svg>
  ),
  Chevron: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M9 6l6 6-6 6"/></svg>
  ),
  ChevronDown: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M6 9l6 6 6-6"/></svg>
  ),
  Arrow: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  ),
  Back: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
  ),
  Bell: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
  ),
  Search: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
  ),
  Trash: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>
  ),
  Star: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3z"/></svg>
  ),
  Phone: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M4 5c0 9 6 15 15 15l1.5-3.5-4-1.5-1.5 2c-2.5-1-4.5-3-5.5-5.5l2-1.5L10 5H6.5z"/></svg>
  ),
  Mail: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg>
  ),
  Play: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M7 5l12 7-12 7V5z"/></svg>
  ),
  Sparkle: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/></svg>
  ),
  Layers: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>
  ),
  Door: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16M14 12h.01"/></svg>
  ),
  Logout: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 12H3M6 8l-4 4 4 4"/></svg>
  ),
  Wrench: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M14.7 6.3a4 4 0 0 0 5 5L21 12l-8 8-2-2 5-5-1-1-5 5-2-2 8-8 1.7-.7z"/></svg>
  ),
  Broom: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M19 4l-7 7"/><path d="M11.5 9.5l3 3"/><path d="M5 20c-.5-2.5.5-4.5 2.5-6l3 3C9 19 7 20 5 20z"/><path d="M10.5 11l2.5 2.5"/></svg>
  ),
  Bed: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><path d="M3 8v11M3 12h18v7M21 19v-4a3 3 0 0 0-3-3H10v4"/><path d="M6.5 12V9.5A1.5 1.5 0 0 1 8 8h.5"/></svg>
  ),
  Dots: ({ size, strokeWidth }: IconProps) => (
    <svg {...base(size, strokeWidth)}><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></svg>
  ),
}
