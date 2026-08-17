/**
 * Haven — app shell.
 * Owns routing, view state, the appearance switcher, the sheet and the toast.
 */

import { el, svg, clear, pct, num } from "./ui.js";
import { icons } from "./icons.js";
import { portfolio, workOrders, tenants, properties } from "./data.js";
import { overviewView } from "./views/overview.js";
import { propertiesView, propertySheet } from "./views/properties.js";
import { tenantsView, tenantSheet } from "./views/tenants.js";
import { maintenanceView, workOrderSheet } from "./views/maintenance.js";
import { financesView } from "./views/finances.js";

/* ── Routes ──────────────────────────────────────────────────── */

const ROUTES = [
  {
    section: "Portfolio",
    items: [
      { id: "overview", label: "Overview", icon: "grid", title: "Overview", action: "New property",
        subtitle: () => `${properties.length} properties · ${num(portfolio().units)} units · ${pct(portfolio().occupancy, 1)} let`,
        render: overviewView },
      { id: "properties", label: "Properties", icon: "building", title: "Properties", action: "New property",
        count: () => properties.length,
        subtitle: () => "Buildings, units and valuations",
        render: propertiesView },
      { id: "tenants", label: "Tenants", icon: "people", title: "Tenants & leases", action: "Add tenant",
        count: () => tenants.length,
        subtitle: () => "Contracts, rent roll and arrears",
        render: tenantsView },
    ],
  },
  {
    section: "Operations",
    items: [
      { id: "maintenance", label: "Maintenance", icon: "wrench", title: "Maintenance", action: "New work order",
        count: () => workOrders.filter((w) => w.status !== "done").length,
        subtitle: () => "Work orders across every building",
        render: maintenanceView },
      { id: "finances", label: "Finances", icon: "euro", title: "Finances", action: "Record payment",
        subtitle: () => "Cash flow, cost structure and ledger",
        render: financesView },
    ],
  },
];

const ALL_ROUTES = ROUTES.flatMap((g) => g.items);
const routeById = (id) => ALL_ROUTES.find((r) => r.id === id) ?? ALL_ROUTES[0];

/* ── App state ───────────────────────────────────────────────── */

const state = {
  route: location.hash.slice(1) || "overview",
  query: "",
  theme: localStorage.getItem("haven.theme") || "auto",
  properties: { filter: "All", sort: "value" },
  tenants: { filter: "all", sortKey: "leaseEnd", sortDir: "asc" },
  maintenance: { priority: "all" },
  finances: { range: 12, txFilter: "all" },
};

const dom = {
  app: document.getElementById("app"),
  nav: document.getElementById("nav"),
  content: document.getElementById("content"),
  title: document.getElementById("viewTitle"),
  subtitle: document.getElementById("viewSubtitle"),
  search: document.getElementById("search"),
  themeSeg: document.getElementById("themeSeg"),
  sheet: document.getElementById("sheet"),
  scrim: document.getElementById("scrim"),
  toast: document.getElementById("toast"),
  occupancy: document.getElementById("sidebarOccupancy"),
  primary: document.getElementById("primaryAction"),
  primaryLabel: document.getElementById("primaryActionLabel"),
  toggle: document.getElementById("sidebarToggle"),
  account: document.getElementById("accountBtn"),
};

const ctx = {
  get query() {
    return state.query;
  },
  state,
  navigate,
  setState,
  toast,
  openProperty: (p) => openSheet(p.name, propertySheet(p, ctx), `${p.street} · ${p.city}`),
  openTenant: (t) => openSheet(t.name, tenantSheet(t), "Lease detail"),
  openWorkOrder: (w) => openSheet(w.id, workOrderSheet(w, ctx), "Work order"),
};

function setState(slice, patch) {
  Object.assign(state[slice], patch);
  render();
}

/* ── Rendering ───────────────────────────────────────────────── */

function renderNav() {
  clear(dom.nav);
  for (const group of ROUTES) {
    dom.nav.append(el("div.nav__label", { text: group.section }));
    for (const route of group.items) {
      const count = route.count?.();
      dom.nav.append(
        el(
          "button.nav__item",
          {
            type: "button",
            "aria-current": route.id === state.route ? "page" : null,
            "on:click": () => navigate(route.id),
          },
          [
            svg(icons[route.icon]),
            el("span.nav__text", { text: route.label }),
            count != null ? el("span.nav__count", { text: String(count) }) : null,
          ],
        ),
      );
    }
  }
}

function renderSidebarMeter() {
  const p = portfolio();
  clear(dom.occupancy).append(
    el("div.occupancy-pill__head", {}, [
      el("span", { text: "Occupancy" }),
      el("span.occupancy-pill__value", { text: pct(p.occupancy, 1) }),
    ]),
    el("div.meter", {}, [el("div.meter__fill", { style: { width: pct(p.occupancy, 0) } })]),
    el("div.occupancy-pill__head", {}, [
      el("span", { text: `${p.occupied} let` }),
      el("span", { text: `${p.vacant} vacant` }),
    ]),
  );
}

function renderThemeSwitcher() {
  clear(dom.themeSeg);
  for (const [value, icon, label] of [
    ["light", "sun", "Light"],
    ["auto", "auto", "Match system"],
    ["dark", "moon", "Dark"],
  ]) {
    dom.themeSeg.append(
      el(
        "button",
        {
          type: "button",
          role: "radio",
          title: label,
          "aria-label": label,
          "aria-checked": String(state.theme === value),
          "on:click": () => setTheme(value),
        },
        [svg(icons[icon])],
      ),
    );
  }
}

function render() {
  const route = routeById(state.route);

  document.title = `${route.title} — Haven`;
  dom.title.textContent = route.title;
  dom.subtitle.textContent = route.subtitle?.() ?? "";
  dom.primaryLabel.textContent = route.action;

  renderNav();
  renderSidebarMeter();

  clear(dom.content).append(route.render(ctx));
  dom.content.scrollTop = 0;
}

function navigate(id) {
  if (state.route === id) return;
  state.route = id;
  state.query = "";
  dom.search.value = "";
  history.replaceState(null, "", `#${id}`);
  if (window.matchMedia("(max-width: 900px)").matches) dom.app.dataset.sidebar = "closed";
  render();
}

/* ── Appearance ──────────────────────────────────────────────── */

function setTheme(value) {
  state.theme = value;
  localStorage.setItem("haven.theme", value);
  document.documentElement.dataset.theme = value;
  renderThemeSwitcher();
}

/* ── Sheet ───────────────────────────────────────────────────── */

let lastFocused = null;

function openSheet(title, body, subtitle) {
  lastFocused = document.activeElement;

  clear(dom.sheet).append(
    el("header.sheet__head", {}, [
      el("div", { style: { flex: "1", minWidth: "0" } }, [
        el("h2.sheet__title#sheetTitle", { text: title }),
        subtitle && el("p.card__sub", { text: subtitle }),
      ]),
      el("button.close-btn", { type: "button", "aria-label": "Close", "on:click": closeSheet }, [svg(icons.close)]),
    ]),
    el("div.sheet__body", {}, Array.isArray(body) ? body : [body]),
    el("footer.sheet__foot", {}, [
      el("button.btn", { type: "button", text: "Close", "on:click": closeSheet }),
      el("button.btn.btn--primary", {
        type: "button",
        text: "Open full record",
        "on:click": () => {
          closeSheet();
          toast(`${title} opened in the records app`);
        },
      }),
    ]),
  );

  dom.sheet.hidden = false;
  dom.scrim.hidden = false;
  dom.sheet.classList.remove("is-closing");
  dom.scrim.classList.remove("is-closing");
  dom.sheet.querySelector(".close-btn").focus({ preventScroll: true });
}

function closeSheet() {
  if (dom.sheet.hidden) return;
  dom.sheet.classList.add("is-closing");
  dom.scrim.classList.add("is-closing");
  setTimeout(() => {
    dom.sheet.hidden = true;
    dom.scrim.hidden = true;
    dom.sheet.classList.remove("is-closing");
    dom.scrim.classList.remove("is-closing");
    lastFocused?.focus?.({ preventScroll: true });
  }, 150);
}

/** Keep tab focus inside the sheet while it is open. */
function trapFocus(event) {
  if (dom.sheet.hidden || event.key !== "Tab") return;
  const focusable = dom.sheet.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ── Toast ───────────────────────────────────────────────────── */

let toastTimer;

function toast(message) {
  clearTimeout(toastTimer);
  clear(dom.toast).append(svg(icons.checkCircle), el("span", { text: message }));
  dom.toast.hidden = false;
  dom.toast.classList.remove("is-closing");
  toastTimer = setTimeout(() => {
    dom.toast.classList.add("is-closing");
    setTimeout(() => (dom.toast.hidden = true), 150);
  }, 2600);
}

/* ── Wiring ──────────────────────────────────────────────────── */

let searchTimer;
dom.search.addEventListener("input", (event) => {
  clearTimeout(searchTimer);
  const value = event.target.value;
  searchTimer = setTimeout(() => {
    state.query = value.trim();
    if (["properties", "tenants", "maintenance", "finances"].includes(state.route)) render();
    else if (state.query) navigate("properties");
  }, 140);
});

dom.toggle.addEventListener("click", () => {
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  if (mobile) {
    dom.app.dataset.sidebar = dom.app.dataset.sidebar === "open" ? "closed" : "open";
  } else {
    dom.app.dataset.sidebar = dom.app.dataset.sidebar === "collapsed" ? "" : "collapsed";
  }
});

// Tapping the content area dismisses the overlaid sidebar on narrow screens.
dom.content.addEventListener("pointerdown", () => {
  if (dom.app.dataset.sidebar === "open") dom.app.dataset.sidebar = "closed";
});

dom.primary.addEventListener("click", () => toast(`${routeById(state.route).action} — draft created`));
dom.account.addEventListener("click", () => toast("Signed in as Tomaž Volk"));
dom.scrim.addEventListener("click", closeSheet);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!dom.sheet.hidden) closeSheet();
    else if (document.activeElement === dom.search) {
      dom.search.value = "";
      state.query = "";
      dom.search.blur();
      render();
    }
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    dom.search.focus();
    dom.search.select();
    return;
  }
  // ⌘1…⌘5 jump between sections, the way a Mac app would.
  if ((event.metaKey || event.ctrlKey) && /^[1-5]$/.test(event.key)) {
    event.preventDefault();
    navigate(ALL_ROUTES[Number(event.key) - 1].id);
    return;
  }
  trapFocus(event);
});

window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (id && id !== state.route) {
    state.route = id;
    render();
  }
});

/* ── Boot ────────────────────────────────────────────────────── */

setTheme(state.theme);
render();
