/** Hand-rolled SVG charts — no chart library, no runtime dependencies. */

import { el, svg } from "./ui.js";

const VB_W = 720;
const VB_H_DEFAULT = 250;
const PAD = { top: 16, right: 12, bottom: 26, left: 52 };

const niceCeil = (v) => {
  const mag = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / mag) * mag;
};

/** Catmull-Rom → cubic Bézier, so the line curves without overshooting. */
function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * Multi-series area + line chart with a hover readout.
 * @param {{labels:string[], series:{key:string,name:string,color:string,values:number[],area?:boolean}[],
 *          format:(n:number)=>string, ticks?:number}} config
 */
export function areaChart({ labels, series, format, ticks = 4, height = VB_H_DEFAULT }) {
  const VB_H = height;
  const uid = `c${Math.random().toString(36).slice(2, 8)}`;
  const max = niceCeil(Math.max(...series.flatMap((s) => s.values)) * 1.12);
  const innerW = VB_W - PAD.left - PAD.right;
  const innerH = VB_H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (innerW * i) / (labels.length - 1);
  const y = (v) => PAD.top + innerH - (v / max) * innerH;

  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const value = (max / ticks) * i;
    const yy = y(value);
    return `<line class="grid-line" x1="${PAD.left}" y1="${yy}" x2="${VB_W - PAD.right}" y2="${yy}"/>
            <text class="axis-text" x="${PAD.left - 10}" y="${yy + 4}" text-anchor="end">${format(value)}</text>`;
  }).join("");

  const xLabels = labels
    .map((label, i) =>
      i % Math.ceil(labels.length / 12) === 0
        ? `<text class="axis-text" x="${x(i)}" y="${VB_H - 6}" text-anchor="middle">${label}</text>`
        : "",
    )
    .join("");

  const paths = series
    .map((s) => {
      const pts = s.values.map((v, i) => [x(i), y(v)]);
      const line = smoothPath(pts);
      const area = s.area === false
        ? ""
        : `<path class="series-area" d="${line} L${x(pts.length - 1)},${PAD.top + innerH} L${PAD.left},${
            PAD.top + innerH
          } Z" fill="url(#fill-${uid}-${s.key})"/>`;
      return `${area}<path class="series-line" d="${line}" stroke="${s.color}" style="--len:2400"/>`;
    })
    .join("");

  const defs = series
    .map(
      (s) => `<linearGradient id="fill-${uid}-${s.key}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${s.color}" stop-opacity="0.28"/>
        <stop offset="1" stop-color="${s.color}" stop-opacity="0"/>
      </linearGradient>`,
    )
    .join("");

  const markers = series
    .map((s) => `<circle class="dot dot-${s.key}" r="4.5" fill="var(--surface-solid)" stroke="${s.color}" stroke-width="2.5"/>`)
    .join("");

  const node = svg(`
    <svg class="chart" viewBox="0 0 ${VB_W} ${VB_H}" style="height:auto" role="img"
         aria-label="${series.map((s) => s.name).join(" and ")} over ${labels.length} months">
      <defs>${defs}</defs>
      ${gridLines}
      ${paths}
      ${xLabels}
      <g class="marker">
        <line class="rule" y1="${PAD.top}" y2="${PAD.top + innerH}" stroke="var(--label-tertiary)" stroke-width="1" stroke-dasharray="3 3"/>
        ${markers}
      </g>
      <rect class="hot" x="${PAD.left}" y="${PAD.top}" width="${innerW}" height="${innerH}"/>
    </svg>`);

  const tip = el("div.chart-tip");
  const host = el("div.chart-host", {}, [node, tip]);

  const hot = node.querySelector(".hot");
  const rule = node.querySelector(".rule");
  const dots = series.map((s) => node.querySelector(`.dot-${s.key}`));

  const move = (event) => {
    const box = node.getBoundingClientRect();
    const scale = box.width / VB_W;
    const localX = (event.clientX - box.left) / scale;
    const i = Math.max(0, Math.min(labels.length - 1, Math.round(((localX - PAD.left) / innerW) * (labels.length - 1))));

    node.classList.add("is-active");
    rule.setAttribute("x1", x(i));
    rule.setAttribute("x2", x(i));
    dots.forEach((dot, si) => {
      dot.setAttribute("cx", x(i));
      dot.setAttribute("cy", y(series[si].values[i]));
    });

    tip.innerHTML =
      `<div style="color:var(--label-secondary);margin-bottom:2px">${labels[i]}</div>` +
      series
        .map(
          (s) =>
            `<b style="color:${s.color}">${format(s.values[i])}<span style="font-weight:500;color:var(--label-secondary);font-size:11px"> · ${s.name}</span></b>`,
        )
        .join("");
    tip.classList.add("is-visible");
    tip.style.left = `${x(i) * scale}px`;
    tip.style.top = `${y(Math.max(...series.map((s) => s.values[i]))) * scale}px`;
  };

  hot.addEventListener("pointermove", move);
  hot.addEventListener("pointerleave", () => {
    node.classList.remove("is-active");
    tip.classList.remove("is-visible");
  });

  return host;
}

/** Vertical bars, one series, with value labels on hover. */
export function barChart({ labels, values, color = "var(--blue)", format, height = VB_H_DEFAULT }) {
  const VB_H = height;
  const max = niceCeil(Math.max(...values) * 1.15);
  const innerW = VB_W - PAD.left - PAD.right;
  const innerH = VB_H - PAD.top - PAD.bottom;
  const slot = innerW / values.length;
  const barW = Math.min(34, slot * 0.56);
  const y = (v) => PAD.top + innerH - (v / max) * innerH;

  const grid = Array.from({ length: 5 }, (_, i) => {
    const value = (max / 4) * i;
    return `<line class="grid-line" x1="${PAD.left}" y1="${y(value)}" x2="${VB_W - PAD.right}" y2="${y(value)}"/>
            <text class="axis-text" x="${PAD.left - 10}" y="${y(value) + 4}" text-anchor="end">${format(value)}</text>`;
  }).join("");

  const bars = values
    .map((v, i) => {
      const cx = PAD.left + slot * i + slot / 2;
      return `<g>
        <rect class="bar" x="${cx - barW / 2}" y="${y(v)}" width="${barW}" height="${Math.max(2, PAD.top + innerH - y(v))}"
              rx="5" fill="${color}" style="animation-delay:${i * 32}ms"><title>${labels[i]}: ${format(v)}</title></rect>
        <text class="axis-text" x="${cx}" y="${VB_H - 6}" text-anchor="middle">${labels[i]}</text>
      </g>`;
    })
    .join("");

  return el("div.chart-host", {}, [
    svg(`<svg class="chart" viewBox="0 0 ${VB_W} ${VB_H}" style="height:auto" role="img"
              aria-label="Bar chart">${grid}${bars}</svg>`),
  ]);
}

/** Donut with a centred readout. `segments` = [{label, value, color}] */
export function donut({ segments, size = 148, thickness = 16, centerValue, centerLabel }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;

  let offset = 0;
  const arcs = segments
    .map((s) => {
      const len = (s.value / total) * c;
      const arc = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none"
        stroke="${s.color}" stroke-width="${thickness}" stroke-linecap="round"
        stroke-dasharray="${Math.max(0, len - 3)} ${c - Math.max(0, len - 3)}"
        stroke-dashoffset="${-offset}" transform="rotate(-90 ${size / 2} ${size / 2})"><title>${s.label}</title></circle>`;
      offset += len;
      return arc;
    })
    .join("");

  const node = el("div.donut", { style: { width: `${size}px`, height: `${size}px` } }, [
    svg(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${centerLabel}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--fill-tertiary)" stroke-width="${thickness}"/>
        ${arcs}
      </svg>`),
    el("div.donut__center", {}, [
      el("div.donut__value", { text: centerValue }),
      el("div.donut__label", { text: centerLabel }),
    ]),
  ]);
  return node;
}

/** Labelled progress rows — the "where the money went" pattern. */
export function breakdown(rows, format) {
  const max = Math.max(...rows.map((r) => r.amount));
  return el(
    "div.breakdown",
    {},
    rows.map((r, i) =>
      el("div.breakdown__row", {}, [
        el("div.breakdown__top", {}, [
          el("span", { text: r.label }),
          el("span.breakdown__amt", { text: format(r.amount) }),
        ]),
        el("div.breakdown__bar", {}, [
          el("div.breakdown__fill", {
            style: {
              width: `${(r.amount / max) * 100}%`,
              "--c": r.color,
              animationDelay: `${i * 60}ms`,
            },
          }),
        ]),
      ]),
    ),
  );
}

/** 40×16 sparkline for table cells and tiles. */
export function sparkline(values, color = "var(--blue)", w = 64, h = 20) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [
    (w * i) / (values.length - 1),
    h - 2 - ((v - min) / span) * (h - 4),
  ]);
  return svg(`<svg class="chart" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <path d="${smoothPath(pts)}" fill="none" stroke="${color}" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`);
}
