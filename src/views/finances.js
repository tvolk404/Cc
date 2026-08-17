import { el, eur, eurCompact, pct, longDate } from "../ui.js";
import { areaChart, barChart, breakdown, donut } from "../charts.js";
import { card, cardHead, badge, kpiTile, dataTable, emptyState, segmented } from "../components.js";
import { monthly, expenseBreakdown, transactions, propertyById, properties } from "../data.js";

const RANGES = [
  { value: 6, label: "6 M" },
  { value: 12, label: "12 M" },
];

export function financesView(ctx) {
  const { range = 12, txFilter = "all" } = ctx.state.finances;
  const window = monthly.slice(-range);

  const income = window.reduce((n, m) => n + m.income, 0);
  const expense = window.reduce((n, m) => n + m.expense, 0);
  const noi = income - expense;
  const margin = noi / income;

  const kpis = el("section.grid.grid--kpi", {}, [
    kpiTile({
      label: `Income · ${range} months`,
      value: eurCompact(income),
      icon: "euro",
      tint: "linear-gradient(160deg, var(--green), var(--mint))",
      change: 4.2,
      changeNote: "vs prior period",
    }),
    kpiTile({
      label: "Operating cost",
      value: eurCompact(expense),
      icon: "wrench",
      tint: "linear-gradient(160deg, var(--orange), var(--pink))",
      change: -2.8,
      changeNote: "vs prior period",
      inverse: true,
    }),
    kpiTile({
      label: "Net operating income",
      value: eurCompact(noi),
      icon: "chart",
      tint: "linear-gradient(160deg, var(--blue), var(--indigo))",
      change: 6.5,
      changeNote: "vs prior period",
    }),
    kpiTile({
      label: "NOI margin",
      value: pct(margin, 1),
      icon: "sparkle",
      tint: "linear-gradient(160deg, var(--purple), var(--indigo))",
      foot: el("div.kpi__foot", {}, [badge("Target 66%", "blue"), el("span", { text: "portfolio goal" })]),
    }),
  ]);

  const trend = card("", [
    cardHead(
      "Net operating income",
      "Income less operating cost, per month",
      segmented(RANGES, range, (value) => ctx.setState("finances", { range: value })),
    ),
    barChart({
      labels: window.map((m) => m.month),
      values: window.map((m) => m.income - m.expense),
      color: "var(--blue)",
      format: (v) => eurCompact(v),
    }),
  ]);

  const split = card("", [
    cardHead("Cost structure", "Trailing month"),
    el("div.donut-wrap", {}, [
      donut({
        segments: expenseBreakdown.map((e) => ({ label: e.label, value: e.amount, color: e.color })),
        centerValue: eurCompact(expenseBreakdown.reduce((n, e) => n + e.amount, 0)),
        centerLabel: "total cost",
        size: 140,
      }),
      breakdown(expenseBreakdown, (n) => eur(n)),
    ]),
  ]);

  const cashflow = card("", [
    cardHead(
      "Cash flow",
      `Income and cost, last ${range} months`,
      el("div.legend", {}, [
        el("span", {}, [el("i", { style: { "--c": "var(--green)" } }), "Income"]),
        el("span", {}, [el("i", { style: { "--c": "var(--red)" } }), "Cost"]),
      ]),
    ),
    areaChart({
      labels: window.map((m) => m.month),
      series: [
        { key: "in", name: "Income", color: "var(--green)", values: window.map((m) => m.income) },
        { key: "out", name: "Cost", color: "var(--red)", values: window.map((m) => m.expense) },
      ],
      format: (v) => eurCompact(v),
      height: 170, // full-bleed card: keep the chart wide rather than tall
    }),
  ]);

  /* ── Transactions ──────────────────────────────────────── */
  let rows = transactions.map((t) => ({ ...t, property: t.propertyId ? propertyById(t.propertyId) : null }));
  if (txFilter !== "all") rows = rows.filter((t) => t.type === txFilter);
  if (ctx.query) {
    const q = ctx.query.toLowerCase();
    rows = rows.filter((t) =>
      [t.label, t.method, t.property?.name ?? ""].some((v) => v.toLowerCase().includes(q)),
    );
  }

  const ledger = card("card--flush", [
    cardHead(
      "Recent transactions",
      `${rows.length} entries`,
      el("div.filters", {}, [
        segmented(
          [
            { value: "all", label: "All" },
            { value: "income", label: "Income" },
            { value: "expense", label: "Cost" },
          ],
          txFilter,
          (value) => ctx.setState("finances", { txFilter: value }),
        ),
        el("button.btn.btn--sm", {
          type: "button",
          text: "Export",
          "on:click": () => ctx.toast("Statement exported as CSV"),
        }),
      ]),
    ),
    rows.length
      ? dataTable({
          columns: [
            { key: "date", label: "Date", sortable: false, render: (t) => longDate(t.date) },
            { key: "label", label: "Description", sortable: false, render: (t) => el("span.cell-strong", { text: t.label }) },
            { key: "property", label: "Property", sortable: false, render: (t) => t.property?.name ?? "Portfolio" },
            { key: "method", label: "Method", sortable: false, render: (t) => el("span.cell-dim", { text: t.method }) },
            {
              key: "amount",
              label: "Amount",
              align: "right",
              sortable: false,
              render: (t) =>
                el("span.cell-strong", {
                  text: `${t.amount > 0 ? "+" : ""}${eur(t.amount)}`,
                  style: { color: t.amount > 0 ? "var(--green)" : "var(--red)" },
                }),
            },
          ],
          rows,
          sort: { key: "date", dir: "desc" },
          onSort: () => {},
        })
      : emptyState("No transactions", "Nothing matches the current filter.", "euro"),
  ]);

  /* ── Per-property contribution ─────────────────────────── */
  const contribution = card("", [
    cardHead("Income by property", "Monthly rent roll"),
    breakdown(
      [...properties]
        .sort((a, b) => b.monthlyRent - a.monthlyRent)
        .map((p) => ({ label: p.name, amount: p.monthlyRent, color: `hsl(${p.hue} 62% 52%)` })),
      (n) => eur(n),
    ),
  ]);

  return el("div.view", {}, [
    kpis,
    el("section.grid.grid--split", {}, [trend, split]),
    cashflow,
    el("section.grid.grid--split", {}, [ledger, contribution]),
  ]);
}
