/** Tiny DOM + formatting helpers. No framework, no dependencies. */

/**
 * Create an element.
 * @param {string} tag  e.g. "div.card.kpi" or "button.btn#save"
 * @param {object} [props] attributes; `class`, `html`, `text`, `on:<event>`, `data-*`
 * @param {(Node|string|null|false)[]} [children]
 */
export function el(tag, props = {}, children = []) {
  const [name, ...tokens] = tag.split(/(?=[.#])/);
  const node = document.createElement(name || "div");

  for (const token of tokens) {
    if (token[0] === ".") node.classList.add(token.slice(1));
    else node.id = token.slice(1);
  }

  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === "text") node.textContent = value;
    else if (key === "html") node.innerHTML = value;
    else if (key === "class") node.className = [node.className, value].filter(Boolean).join(" ");
    else if (key === "style" && typeof value === "object") applyStyle(node, value);
    else if (key.startsWith("on:")) node.addEventListener(key.slice(3), value);
    else node.setAttribute(key, value === true ? "" : String(value));
  }

  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** `Object.assign(style, …)` silently drops `--custom` props — route those through setProperty. */
function applyStyle(node, style) {
  for (const [prop, value] of Object.entries(style)) {
    if (value == null) continue;
    if (prop.startsWith("--")) node.style.setProperty(prop, String(value));
    else node.style[prop] = value;
  }
}

/** Parse a trusted SVG/HTML string into a node. */
export function svg(markup) {
  const t = document.createElement("template");
  t.innerHTML = markup.trim();
  return t.content.firstElementChild;
}

export const clear = (node) => {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
};

/* ── Formatting ──────────────────────────────────────────────── */

const LOCALE = "en-IE"; // English wording, euro formatting, dot decimals

const money0 = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const money2 = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const eur = (n, decimals = false) => (decimals ? money2 : money0).format(n);

/** 6_420_000 → "€6.42M" — for tiles where width is precious. */
export function eurCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1e6) return `€${(n / 1e6).toFixed(abs >= 1e7 ? 1 : 2)}M`;
  if (abs >= 1e3) return `€${(n / 1e3).toFixed(abs >= 1e5 ? 0 : 1)}k`;
  return eur(n);
}

export const pct = (n, digits = 1) =>
  `${(n * 100).toLocaleString(LOCALE, { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;

export const num = (n) => n.toLocaleString(LOCALE);

export const shortDate = (iso) =>
  new Date(iso).toLocaleDateString(LOCALE, { day: "numeric", month: "short" });

export const longDate = (iso) =>
  new Date(iso).toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });

export const initials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

/** Stable 1–5 bucket so an avatar keeps its colour between renders. */
export const hueOf = (seed) => {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return (h % 5) + 1;
};

export const avatar = (name, small = false) =>
  el(`span.avatar${small ? ".avatar--sm" : ""}`, {
    "data-hue": hueOf(name),
    "aria-hidden": "true",
    text: initials(name),
  });

/**
 * The demo's "today". The fixtures in data.js are authored against this date so
 * the dashboard always tells the same story; swap it for `new Date()` once the
 * data comes from a real API.
 */
export const TODAY = new Date("2026-08-17T00:00:00Z");

/** Days from TODAY to an ISO date (negative = in the past). */
export const daysUntil = (iso) =>
  Math.round((new Date(`${iso}T00:00:00Z`) - TODAY) / 86_400_000);
