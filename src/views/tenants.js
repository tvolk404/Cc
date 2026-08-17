import { el, eur, longDate, daysUntil, avatar, pct } from "../ui.js";
import {
  card, cardHead, badge, segmented, dataTable, personCell, emptyState,
  kpiTile, TENANT_TONE, TENANT_LABEL,
} from "../components.js";
import { tenants, propertyById } from "../data.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "current", label: "Current" },
  { value: "notice", label: "On notice" },
  { value: "late", label: "Late" },
];

export function tenantsView(ctx) {
  const { filter = "all", sortKey = "leaseEnd", sortDir = "asc" } = ctx.state.tenants;

  let rows = tenants.map((t) => ({ ...t, property: propertyById(t.propertyId), days: daysUntil(t.leaseEnd) }));
  if (filter !== "all") rows = rows.filter((t) => t.status === filter);
  if (ctx.query) {
    const q = ctx.query.toLowerCase();
    rows = rows.filter((t) =>
      [t.name, t.unit, t.property.name, t.property.city].some((v) => v.toLowerCase().includes(q)),
    );
  }

  const dir = sortDir === "asc" ? 1 : -1;
  rows.sort((a, b) => {
    const av = sortKey === "property" ? a.property.name : a[sortKey];
    const bv = sortKey === "property" ? b.property.name : b[sortKey];
    if (typeof av === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  const monthlyRoll = tenants.reduce((n, t) => n + t.rent, 0);
  const late = tenants.filter((t) => t.status === "late");
  const arrears = late.reduce((n, t) => n + t.rent, 0);

  const kpis = el("section.grid.grid--kpi", {}, [
    kpiTile({
      label: "Active leases",
      value: String(tenants.length),
      icon: "doc",
      tint: "linear-gradient(160deg, var(--blue), var(--indigo))",
      change: 7.7,
      changeNote: "vs last quarter",
    }),
    kpiTile({
      label: "Contracted rent",
      value: eur(monthlyRoll),
      icon: "euro",
      tint: "linear-gradient(160deg, var(--green), var(--mint))",
      change: 1.9,
      changeNote: "vs last month",
    }),
    kpiTile({
      label: "In arrears",
      value: eur(arrears),
      icon: "bell",
      tint: "linear-gradient(160deg, var(--red), var(--orange))",
      foot: el("div.kpi__foot", {}, [
        badge(`${late.length} tenant${late.length === 1 ? "" : "s"}`, "red"),
        el("span", { text: "chase scheduled" }),
      ]),
    }),
    kpiTile({
      label: "Renewal rate",
      value: pct(0.82, 0),
      icon: "key",
      tint: "linear-gradient(160deg, var(--teal), var(--blue))",
      change: 4.5,
      changeNote: "trailing 12 months",
    }),
  ]);

  const table = card("card--flush", [
    cardHead(
      "Tenants",
      `${rows.length} shown`,
      segmented(FILTERS, filter, (value) => ctx.setState("tenants", { filter: value })),
    ),
    rows.length
      ? dataTable({
          columns: [
            { key: "name", label: "Tenant", render: (t) => personCell(t.name, `Score ${t.score}`) },
            { key: "unit", label: "Unit", render: (t) => el("span.cell-dim", { text: t.unit }) },
            { key: "property", label: "Property", render: (t) => t.property.name },
            {
              key: "rent",
              label: "Rent / mo",
              align: "right",
              render: (t) => el("span.cell-strong", { text: eur(t.rent) }),
            },
            { key: "since", label: "Tenant since", render: (t) => longDate(t.since) },
            {
              key: "leaseEnd",
              label: "Lease ends",
              render: (t) =>
                el("div.cell-person", {}, [
                  el("span", { text: longDate(t.leaseEnd) }),
                  badge(t.days < 0 ? "expired" : `${t.days} d`, t.days < 30 ? "red" : t.days < 90 ? "orange" : "gray", true),
                ]),
            },
            {
              key: "status",
              label: "Status",
              sortable: false,
              render: (t) => badge(TENANT_LABEL[t.status], TENANT_TONE[t.status]),
            },
            {
              key: "actions",
              label: "",
              sortable: false,
              render: (t) =>
                el("button.btn.btn--plain.btn--sm", {
                  type: "button",
                  text: "Open",
                  "on:click": () => ctx.openTenant(t),
                }),
            },
          ],
          rows,
          sort: { key: sortKey, dir: sortDir },
          onSort: (key) =>
            ctx.setState("tenants", {
              sortKey: key,
              sortDir: sortKey === key && sortDir === "asc" ? "desc" : "asc",
            }),
        })
      : emptyState("No tenants match", "Try clearing the filter or the search field.", "people"),
  ]);

  return el("div.view", {}, [kpis, table]);
}

/** Detail sheet body for a tenant. */
export function tenantSheet(t) {
  const property = t.property ?? propertyById(t.propertyId);
  const days = t.days ?? daysUntil(t.leaseEnd);
  return [
    el("div.cell-person", { style: { gap: "14px" } }, [
      avatar(t.name),
      el("div", {}, [
        el("div", { style: { font: "var(--t-headline)" }, text: t.name }),
        el("div.card__sub", { text: `${property.name} · ${t.unit} · ${property.city}` }),
      ]),
      el("div", { style: { marginLeft: "auto" } }, [badge(TENANT_LABEL[t.status], TENANT_TONE[t.status])]),
    ]),
    el("div.spec-grid", {}, [
      spec("Monthly rent", eur(t.rent)),
      spec("Tenant since", longDate(t.since)),
      spec("Lease ends", longDate(t.leaseEnd)),
      spec("Days remaining", days < 0 ? "Expired" : `${days}`),
      spec("Payment score", `${t.score}/100`),
      spec("Deposit", eur(t.rent * 2)),
    ]),
    el("div", {}, [
      el("div.breakdown__top", { style: { marginBottom: "6px" } }, [
        el("span.stat__k", { text: "Payment reliability" }),
        el("span.breakdown__amt", { text: `${t.score}%` }),
      ]),
      el("div.breakdown__bar", {}, [
        el("div.breakdown__fill", {
          style: {
            width: `${t.score}%`,
            "--c": t.score >= 90 ? "var(--green)" : t.score >= 75 ? "var(--orange)" : "var(--red)",
          },
        }),
      ]),
    ]),
  ];
}

const spec = (k, v) =>
  el("div.stat", {}, [el("span.stat__k", { text: k }), el("span.stat__v", { text: v })]);
