/** SF-Symbols-flavoured line icons: 16pt grid, 1.6 stroke, rounded caps. */

const wrap = (body, box = 16) =>
  `<svg viewBox="0 0 ${box} ${box}" fill="none" stroke="currentColor" stroke-width="1.6"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icons = {
  grid: wrap('<rect x="2.2" y="2.2" width="4.8" height="4.8" rx="1.4"/><rect x="9" y="2.2" width="4.8" height="4.8" rx="1.4"/><rect x="2.2" y="9" width="4.8" height="4.8" rx="1.4"/><rect x="9" y="9" width="4.8" height="4.8" rx="1.4"/>'),
  building: wrap('<path d="M2.4 13.8h11.2"/><path d="M3.6 13.8V3.4a1 1 0 0 1 1-1h4.2a1 1 0 0 1 1 1v10.4"/><path d="M9.8 13.8V6.4h2.6a1 1 0 0 1 1 1v6.4"/><path d="M5.6 5.2h2M5.6 7.8h2M5.6 10.4h2"/>'),
  people: wrap('<circle cx="6.2" cy="5.6" r="2.4"/><path d="M2 13.4c0-2.2 1.9-3.6 4.2-3.6s4.2 1.4 4.2 3.6"/><path d="M11 3.6a2.2 2.2 0 0 1 0 4.2M12 9.9c1.4.4 2.4 1.5 2.4 3.1"/>'),
  wrench: wrap('<path d="M10.4 2.4a3.6 3.6 0 0 0-3.2 5.3L2.6 12.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a3.6 3.6 0 0 0 4.5-4.6l-2 2-1.9-.5-.5-1.9z"/>'),
  euro: wrap('<path d="M11.4 4.3a4.6 4.6 0 0 0-6.6 3.7 4.6 4.6 0 0 0 6.6 4.1"/><path d="M2.9 6.9h5.4M2.9 9.3h5.4"/>'),
  chart: wrap('<path d="M2.4 13.6h11.2"/><path d="M4.4 11V7.4M7.4 11V3.8M10.4 11V5.9M13 11V8.8"/>'),
  bell: wrap('<path d="M8 2.2a3.9 3.9 0 0 0-3.9 3.9c0 3.2-1.1 4.3-1.1 4.3h10s-1.1-1.1-1.1-4.3A3.9 3.9 0 0 0 8 2.2z"/><path d="M6.7 12.6a1.5 1.5 0 0 0 2.6 0"/>'),
  gear: wrap('<circle cx="8" cy="8" r="2.1"/><path d="M8 1.9v1.6M8 12.5v1.6M13 5.2l-1.4.8M4.4 10l-1.4.8M13 10.8l-1.4-.8M4.4 6l-1.4-.8"/>'),
  doc: wrap('<path d="M4 2.4h4.6l3.4 3.4v7.8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.4a1 1 0 0 1 1-1z"/><path d="M8.4 2.6v3.4h3.4"/><path d="M5.4 9h5.2M5.4 11.2h3.4"/>'),
  key: wrap('<circle cx="5.4" cy="10.6" r="2.6"/><path d="M7.3 8.7l5.4-5.4M10.6 5.4l1.4 1.4M12.1 3.9l1.4 1.4"/>'),
  calendar: wrap('<rect x="2.3" y="3.4" width="11.4" height="10.3" rx="2"/><path d="M2.3 6.6h11.4M5.4 2.2v2.2M10.6 2.2v2.2"/>'),
  chevron: wrap('<path d="M6 3.6L10.4 8 6 12.4"/>'),
  chevronDown: wrap('<path d="M3.6 6L8 10.4 12.4 6"/>'),
  arrowUp: wrap('<path d="M8 12.6V3.6M4.2 7.4L8 3.6l3.8 3.8"/>'),
  arrowDown: wrap('<path d="M8 3.4v9M4.2 8.6L8 12.4l3.8-3.8"/>'),
  minus: wrap('<path d="M3.6 8h8.8"/>'),
  check: wrap('<path d="M3.4 8.4l3 3 6.2-6.8"/>'),
  checkCircle: wrap('<circle cx="8" cy="8" r="6"/><path d="M5.4 8.2l1.9 1.9 3.5-4"/>'),
  close: wrap('<path d="M3.8 3.8l8.4 8.4M12.2 3.8l-8.4 8.4"/>'),
  sun: wrap('<circle cx="8" cy="8" r="3"/><path d="M8 1.6v1.4M8 13v1.4M2.5 2.5l1 1M12.5 12.5l1 1M1.6 8H3M13 8h1.4M2.5 13.5l1-1M12.5 3.5l1-1"/>'),
  moon: wrap('<path d="M13.2 9.4A5.6 5.6 0 0 1 6.6 2.8a5.6 5.6 0 1 0 6.6 6.6z"/>'),
  auto: wrap('<circle cx="8" cy="8" r="5.8"/><path d="M8 2.2v11.6" /><path d="M8 2.2a5.8 5.8 0 0 1 0 11.6z" fill="currentColor" stroke="none"/>'),
  pin: wrap('<path d="M8 14s4.6-4.2 4.6-7.4A4.6 4.6 0 0 0 8 2a4.6 4.6 0 0 0-4.6 4.6C3.4 9.8 8 14 8 14z"/><circle cx="8" cy="6.5" r="1.7"/>'),
  star: wrap('<path d="M8 2.4l1.7 3.5 3.9.5-2.8 2.7.7 3.8L8 11.1l-3.5 1.8.7-3.8L2.4 6.4l3.9-.5z"/>'),
  bolt: wrap('<path d="M8.9 1.8L3.6 9.2h3.6l-.9 5 5.3-7.4H8z"/>'),
  clock: wrap('<circle cx="8" cy="8" r="5.9"/><path d="M8 4.6V8l2.4 1.6"/>'),
  inbox: wrap('<path d="M2.2 8.6h3l1 2h3.6l1-2h3"/><path d="M3.9 3.2h8.2l2 5.4v3.6a1.2 1.2 0 0 1-1.2 1.2H3.1a1.2 1.2 0 0 1-1.2-1.2V8.6z"/>'),
  filter: wrap('<path d="M2.6 4h10.8M4.6 8h6.8M6.6 12h2.8"/>'),
  export: wrap('<path d="M8 10.4V2.6M5 5.6L8 2.6l3 3"/><path d="M2.8 9.8v2.6a1 1 0 0 0 1 1h8.4a1 1 0 0 0 1-1V9.8"/>'),
  sparkle: wrap('<path d="M8 2l1.3 3.5L12.8 6.8 9.3 8.1 8 11.6 6.7 8.1 3.2 6.8 6.7 5.5z"/><path d="M12.6 11.2l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z"/>'),
};

/**
 * A generated "photograph" for a property: a flat architectural scene
 * driven by the property's hue so every card is distinct but on-system.
 */
export function propertyArt(property) {
  const h = property.hue;
  const id = property.id;
  // Muted, dusk-ish palette — saturated enough to tell buildings apart, calm
  // enough to sit under white type without shouting.
  const sky1 = `hsl(${h} 38% 66%)`;
  const sky2 = `hsl(${(h + 26) % 360} 44% 42%)`;
  const far = `hsl(${h} 22% 33%)`;
  const mid = `hsl(${h} 24% 26%)`;
  const near = `hsl(${h} 26% 19%)`;
  const win = `hsl(${(h + 40) % 360} 70% 78%)`;

  const windows = (x, y, cols, rows, w = 7, gap = 12, step = 16) => {
    let out = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lit = (r * 7 + c * 3 + h) % 5 !== 0;
        out += `<rect x="${x + c * gap}" y="${y + r * step}" width="${w}" height="9" rx="1.6"
                 fill="${win}" opacity="${lit ? 0.8 : 0.2}"/>`;
      }
    }
    return out;
  };

  return `
<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" role="img"
     aria-label="Illustration of ${property.name}">
  <defs>
    <linearGradient id="sky-${id}" x1="0.1" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/>
    </linearGradient>
    <linearGradient id="haze-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0.16"/>
    </linearGradient>
  </defs>

  <rect width="320" height="180" fill="url(#sky-${id})"/>
  <circle cx="256" cy="38" r="17" fill="#fff" opacity="0.34"/>
  <rect y="96" width="320" height="84" fill="url(#haze-${id})"/>

  <!-- distant skyline -->
  <g fill="${far}" opacity="0.42">
    <rect x="-4" y="80" width="46" height="100" rx="3"/>
    <rect x="240" y="66" width="48" height="114" rx="3"/>
    <rect x="292" y="98" width="32" height="82" rx="3"/>
  </g>

  <!-- side wing, behind -->
  <g>
    <rect x="176" y="88" width="66" height="92" rx="4" fill="${mid}"/>
    ${windows(188, 102, 2, 4)}
  </g>

  <!-- hero block -->
  <g>
    <rect x="62" y="44" width="104" height="136" rx="5" fill="${near}"/>
    <rect x="58" y="40" width="112" height="7" rx="3.5" fill="${far}"/>
    ${windows(76, 60, 3, 7)}
  </g>

  <!-- low street-level volume -->
  <rect x="18" y="130" width="52" height="50" rx="4" fill="${mid}"/>
  ${windows(28, 142, 2, 2, 6, 14, 18)}

  <rect y="176" width="320" height="4" fill="${near}" opacity="0.6"/>
</svg>`;
}
