import { el, svg, eur, longDate, avatar } from "../ui.js";
import { icons } from "../icons.js";
import { card, cardHead, badge, kpiTile, emptyState, segmented, WO_LABEL } from "../components.js";
import { workOrders, propertyById } from "../data.js";

const COLUMNS = [
  { key: "open", title: "Open", color: "var(--red)" },
  { key: "progress", title: "In progress", color: "var(--orange)" },
  { key: "done", title: "Completed", color: "var(--green)" },
];

const PRIORITY_ORDER = { urgent: 0, high: 1, normal: 2, low: 3 };
const PRIORITY_LABEL = { urgent: "Urgent", high: "High", normal: "Normal", low: "Low" };

export function maintenanceView(ctx) {
  const { priority = "all" } = ctx.state.maintenance;

  let items = workOrders.map((w) => ({ ...w, property: propertyById(w.propertyId) }));
  if (priority !== "all") items = items.filter((w) => w.priority === priority);
  if (ctx.query) {
    const q = ctx.query.toLowerCase();
    items = items.filter((w) =>
      [w.title, w.id, w.category, w.assignee, w.property.name, w.unit].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }
  items.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const open = workOrders.filter((w) => w.status !== "done");
  const spend = workOrders.reduce((n, w) => n + w.cost, 0);

  const kpis = el("section.grid.grid--kpi", {}, [
    kpiTile({
      label: "Open tickets",
      value: String(open.length),
      icon: "wrench",
      tint: "linear-gradient(160deg, var(--orange), var(--pink))",
      change: -18.2,
      changeNote: "vs last month",
      inverse: true,
    }),
    kpiTile({
      label: "Urgent",
      value: String(workOrders.filter((w) => w.priority === "urgent" && w.status !== "done").length),
      icon: "bolt",
      tint: "linear-gradient(160deg, var(--red), var(--orange))",
      foot: el("div.kpi__foot", {}, [badge("SLA 24 h", "red"), el("span", { text: "response target" })]),
    }),
    kpiTile({
      label: "Median resolution",
      value: "3.4 d",
      icon: "clock",
      tint: "linear-gradient(160deg, var(--blue), var(--indigo))",
      change: -9.1,
      changeNote: "faster than July",
      inverse: true,
    }),
    kpiTile({
      label: "Repair spend",
      value: eur(spend),
      icon: "euro",
      tint: "linear-gradient(160deg, var(--teal), var(--blue))",
      change: 6.3,
      changeNote: "vs last month",
      inverse: true,
    }),
  ]);

  const head = el("div.section-head", {}, [
    el("div", {}, [
      el("h2.section-title", { text: "Work orders" }),
      el("p.card__sub", { text: `${items.length} shown · updated 4 min ago` }),
    ]),
    segmented(
      [
        { value: "all", label: "All" },
        { value: "urgent", label: "Urgent" },
        { value: "high", label: "High" },
        { value: "normal", label: "Normal" },
        { value: "low", label: "Low" },
      ],
      priority,
      (value) => ctx.setState("maintenance", { priority: value }),
    ),
  ]);

  const board = el(
    "section.board",
    {},
    COLUMNS.map((col) => {
      const colItems = items.filter((w) => w.status === col.key);
      return card("column card--tight", [
        el("div.column__head", {}, [
          el("div.column__title", {}, [
            el("span.column__dot", { style: { "--c": col.color } }),
            col.title,
          ]),
          el("span.nav__count", { text: String(colItems.length) }),
        ]),
        colItems.length
          ? el("div.column__body", {}, colItems.map((w) => ticket(w, ctx)))
          : emptyState("Clear", "Nothing in this column right now.", "checkCircle"),
      ]);
    }),
  );

  return el("div.view", {}, [kpis, head, board]);
}

function ticket(w, ctx) {
  return el("button.ticket", { type: "button", "on:click": () => ctx.openWorkOrder(w) }, [
    el("div.ticket__top", {}, [
      el("span.ticket__id", { text: w.id }),
      badge(w.category, "gray", true),
    ]),
    el("div", {}, [
      el("div.ticket__title", { text: w.title }),
      el("div.ticket__sub", { text: `${w.property.name} · ${w.unit}` }),
    ]),
    el("div.ticket__foot", {}, [
      el(`span.priority.priority--${w.priority}`, {}, [el("i"), PRIORITY_LABEL[w.priority]]),
      el("div.cell-person", {}, [avatar(w.assignee, true)]),
    ]),
  ]);
}

/** Detail sheet body for a work order. */
export function workOrderSheet(w, ctx) {
  const property = w.property ?? propertyById(w.propertyId);
  return [
    el("div.filters", {}, [
      badge(WO_LABEL[w.status], w.status === "done" ? "green" : w.status === "open" ? "red" : "orange"),
      badge(PRIORITY_LABEL[w.priority], w.priority === "urgent" ? "red" : w.priority === "high" ? "orange" : "blue"),
      badge(w.category, "gray", true),
    ]),
    el("div", {}, [
      el("div", { style: { font: "var(--t-title-3)" }, text: w.title }),
      el("div.card__sub", { text: `${property.name} · ${w.unit} · ${property.city}` }),
    ]),
    el("div.spec-grid", {}, [
      spec("Ticket", w.id),
      spec("Opened", longDate(w.opened)),
      spec("Assignee", w.assignee),
      spec("Estimated cost", w.cost ? eur(w.cost) : "Pending quote"),
    ]),
    el("div.list", { style: { borderRadius: "var(--r-md)", background: "var(--fill-quaternary)", overflow: "hidden" } }, [
      timelineRow("Reported by tenant", longDate(w.opened), "inbox"),
      timelineRow("Assigned to " + w.assignee, longDate(w.opened), "people"),
      w.status !== "open" ? timelineRow("Contractor scheduled", "Two days later", "calendar") : null,
      w.status === "done" ? timelineRow("Signed off", "Closed", "checkCircle") : null,
    ].filter(Boolean)),
  ];
}

function timelineRow(title, sub, icon) {
  return el("div.row", {}, [
    el("span.kpi__glyph", { style: { background: "var(--fill-secondary)", color: "var(--label-secondary)" } }, [
      svg(icons[icon]),
    ]),
    el("div.row__main", {}, [
      el("div.row__title", { text: title }),
      el("div.row__sub", { text: sub }),
    ]),
  ]);
}

const spec = (k, v) =>
  el("div.stat", {}, [el("span.stat__k", { text: k }), el("span.stat__v", { text: v })]);
