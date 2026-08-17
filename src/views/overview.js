import { el, svg, eur, eurCompact, pct, num, daysUntil, avatar } from "../ui.js";
import { icons } from "../icons.js";
import { areaChart, donut, breakdown, sparkline } from "../charts.js";
import {
  card, cardHead, kpiTile, badge, row, money, delta,
  sectionHead, emptyState, TENANT_TONE, TENANT_LABEL,
} from "../components.js";
import { properties, tenants, workOrders, monthly, expenseBreakdown, activity, portfolio, propertyById } from "../data.js";

const ACTIVITY_TINT = {
  payment: ["var(--green)", "euro"],
  maintenance: ["var(--orange)", "wrench"],
  lease: ["var(--blue)", "doc"],
  viewing: ["var(--purple)", "calendar"],
  alert: ["var(--red)", "bell"],
};

export function overviewView(ctx) {
  const p = portfolio();
  const last = monthly.at(-1);
  const prev = monthly.at(-2);
  const revenueChange = ((last.income - prev.income) / prev.income) * 100;

  /* ── KPI row ───────────────────────────────────────────── */
  const kpis = el("section.grid.grid--kpi", {}, [
    kpiTile({
      label: "Portfolio value",
      value: eurCompact(p.value),
      icon: "building",
      tint: "linear-gradient(160deg, var(--blue), var(--indigo))",
      change: 2.4,
      changeNote: "vs Q2 valuation",
    }),
    kpiTile({
      label: "Monthly income",
      value: eurCompact(last.income),
      icon: "euro",
      tint: "linear-gradient(160deg, var(--green), var(--mint))",
      change: revenueChange,
      changeNote: "vs July",
    }),
    kpiTile({
      label: "Occupancy",
      value: pct(p.occupancy, 1),
      icon: "key",
      tint: "linear-gradient(160deg, var(--teal), var(--blue))",
      foot: el("div.kpi__foot", {}, [
        badge(`${p.vacant} vacant`, p.vacant > 8 ? "orange" : "gray"),
        el("span", { text: `of ${num(p.units)} units` }),
      ]),
    }),
    kpiTile({
      label: "Open work orders",
      value: String(p.open),
      icon: "wrench",
      tint: "linear-gradient(160deg, var(--orange), var(--pink))",
      change: -18.2,
      changeNote: "vs last month",
      inverse: true,
    }),
  ]);

  /* ── Revenue chart ─────────────────────────────────────── */
  const chart = card("", [
    cardHead(
      "Income vs. operating cost",
      "Rolling 12 months · all properties",
      el("div.legend", {}, [
        el("span", {}, [el("i", { style: { "--c": "var(--blue)" } }), "Income"]),
        el("span", {}, [el("i", { style: { "--c": "var(--orange)" } }), "Operating cost"]),
      ]),
    ),
    areaChart({
      labels: monthly.map((m) => m.month),
      series: [
        { key: "income", name: "Income", color: "var(--blue)", values: monthly.map((m) => m.income) },
        { key: "expense", name: "Cost", color: "var(--orange)", values: monthly.map((m) => m.expense) },
      ],
      format: (v) => eurCompact(v),
    }),
    el("div.spec-grid", {}, [
      stat("Net op. income", eur(p.noi), delta(3.1, { suffix: "MoM" })),
      stat("Rent collected", pct(p.collected, 1), badge("On track", "green")),
      stat("Average yield", "6.0%", badge("Above target", "blue")),
      stat("Cost ratio", pct(last.expense / last.income, 1), badge("Improving", "green")),
    ]),
  ]);

  /* ── Occupancy donut ───────────────────────────────────── */
  const byType = ["Residential", "Commercial", "Mixed use", "Short stay"].map((type, i) => ({
    label: type,
    value: properties.filter((x) => x.type === type).reduce((n, x) => n + x.units, 0),
    color: ["var(--blue)", "var(--purple)", "var(--teal)", "var(--orange)"][i],
  }));

  const vacancies = properties
    .filter((x) => x.occupied < x.units)
    .map((x) => ({ ...x, free: x.units - x.occupied }))
    .sort((a, b) => b.free - a.free);

  const occupancy = card("", [
    cardHead("Units", `${num(p.occupied)} let · ${p.vacant} available`),
    el("div.donut-wrap", { style: { justifyContent: "center" } }, [
      donut({ segments: byType, centerValue: num(p.units), centerLabel: "units" }),
      el(
        "div.breakdown",
        {},
        byType.map((t) =>
          el("div.breakdown__row", {}, [
            el("div.breakdown__top", {}, [
              el("span", {}, [
                el("i", {
                  style: {
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "3px",
                    background: t.color,
                    marginRight: "7px",
                  },
                }),
                t.label,
              ]),
              el("span.breakdown__amt", { text: String(t.value) }),
            ]),
          ]),
        ),
      ),
    ]),
    el("div", { style: { borderTop: "0.5px solid var(--separator)", paddingTop: "var(--sp-4)" } }, [
      el("div.stat__k", { style: { marginBottom: "var(--sp-3)" }, text: "Where the vacancies are" }),
      el(
        "div.breakdown",
        {},
        vacancies.map((v) =>
          el("div.breakdown__row", {}, [
            el("div.breakdown__top", {}, [
              el("span", { text: `${v.name} · ${v.city}` }),
              el("span.breakdown__amt", { text: `${v.free} free` }),
            ]),
            el("div.breakdown__bar", {}, [
              el("div.breakdown__fill", {
                style: { width: pct(v.free / v.units, 0), "--c": `hsl(${v.hue} 62% 52%)` },
              }),
            ]),
          ]),
        ),
      ),
    ]),
  ]);

  /* ── Activity feed ─────────────────────────────────────── */
  const feed = card("card--flush", [
    cardHead("Activity", "Live from the portfolio", el("button.btn.btn--plain.btn--sm", {
      type: "button", text: "Mark all read", "on:click": () => ctx.toast("Activity marked as read"),
    })),
    el(
      "div.list",
      {},
      activity.map((a) => {
        const [tint, icon] = ACTIVITY_TINT[a.kind];
        return row({
          leading: el("span.kpi__glyph", { style: { background: tint } }, [svg(icons[icon])]),
          title: a.title,
          sub: `${a.sub} · ${a.time}`,
          trailing: a.amount ? money(a.amount) : null,
        });
      }),
    ),
  ]);

  /* ── Lease expiries ────────────────────────────────────── */
  const expiring = tenants
    .map((t) => ({ ...t, days: daysUntil(t.leaseEnd) }))
    .filter((t) => t.days <= 120)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  const leases = card("card--flush", [
    cardHead("Leases ending soon", "Next 120 days"),
    expiring.length
      ? el(
          "div.list",
          {},
          expiring.map((t) =>
            row({
              leading: avatar(t.name),
              title: t.name,
              sub: `${propertyById(t.propertyId).name} · ${t.unit}`,
              trailing: [
                badge(t.days < 0 ? "Expired" : `${t.days} d`, t.days < 30 ? "red" : t.days < 60 ? "orange" : "gray"),
              ],
              onClick: () => ctx.openTenant(t),
            }),
          ),
        )
      : emptyState("Nothing expiring", "No leases end in the next four months."),
    el("div.card__foot", {}, [
      el("button.btn.btn--plain.btn--sm", {
        type: "button", text: "View all tenants", "on:click": () => ctx.navigate("tenants"),
      }),
    ]),
  ]);

  /* ── Top performers ────────────────────────────────────── */
  const top = [...properties].sort((a, b) => b.yield - a.yield).slice(0, 5);
  const performers = card("card--flush", [
    cardHead("Highest yielding", "Gross yield, trailing 12 months"),
    el(
      "div.list",
      {},
      top.map((prop) =>
        row({
          leading: el("span.kpi__glyph", {
            style: { background: `hsl(${prop.hue} 62% 52%)` },
          }, [svg(icons.building)]),
          title: prop.name,
          sub: `${prop.city} · ${prop.units} units`,
          trailing: [
            sparkline(
              monthly.slice(-8).map((m, i) => m.income * (0.9 + ((prop.hue + i * 13) % 21) / 100)),
              `hsl(${prop.hue} 62% 52%)`,
            ),
            el("span.row__amount", { text: `${prop.yield.toFixed(1)}%` }),
          ],
          onClick: () => ctx.openProperty(prop),
        }),
      ),
    ),
  ]);

  /* ── Cost breakdown ────────────────────────────────────── */
  const costs = card("", [
    cardHead("Where cost went", "August · portfolio-wide"),
    breakdown(expenseBreakdown, (n) => eur(n)),
  ]);

  /* ── Attention strip ───────────────────────────────────── */
  const urgent = workOrders.filter((w) => w.priority === "urgent" && w.status !== "done");
  const late = tenants.filter((t) => t.status === "late");
  const attention =
    urgent.length || late.length
      ? card("card--tight", [
          el("div.card__head", {}, [
            el("div", {}, [
              el("h3.card__title", {}, [
                el("span", { style: { color: "var(--orange)" }, text: "Needs attention" }),
              ]),
              el("p.card__sub", {
                text: `${urgent.length} urgent work order${urgent.length === 1 ? "" : "s"} · ${late.length} late payment${late.length === 1 ? "" : "s"}`,
              }),
            ]),
            el("div.filters", {}, [
              el("button.btn.btn--sm", { type: "button", text: "Work orders", "on:click": () => ctx.navigate("maintenance") }),
              el("button.btn.btn--sm", { type: "button", text: "Arrears", "on:click": () => ctx.navigate("tenants") }),
            ]),
          ]),
          el(
            "div.filters",
            {},
            [
              ...urgent.map((w) => badge(`${w.id} · ${w.title}`, "red")),
              ...late.map((t) => badge(`${t.name} · ${TENANT_LABEL[t.status]}`, TENANT_TONE[t.status])),
            ],
          ),
        ])
      : null;

  return el("div.view", {}, [
    kpis,
    attention,
    el("section.grid.grid--split", {}, [chart, occupancy]),
    el("section.grid.grid--split", {}, [feed, leases]),
    sectionHead("Portfolio detail"),
    el("section.grid.grid--halves", {}, [performers, costs]),
  ]);
}

function stat(label, value, trailing) {
  return el("div.stat", {}, [
    el("span.stat__k", { text: label }),
    el("span.stat__v", { text: value }),
    trailing,
  ]);
}
