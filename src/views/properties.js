import { el, svg, eur, eurCompact, pct, num } from "../ui.js";
import { propertyArt } from "../icons.js";
import { card, badge, segmented, emptyState, occupancyMeter } from "../components.js";
import { properties } from "../data.js";

const TYPES = ["All", "Residential", "Commercial", "Mixed use", "Short stay"];

export function propertiesView(ctx) {
  const { filter = "All", sort = "value" } = ctx.state.properties;

  let list = properties.filter((p) => filter === "All" || p.type === filter);
  if (ctx.query) {
    const q = ctx.query.toLowerCase();
    list = list.filter((p) =>
      [p.name, p.city, p.street, p.type, p.manager].some((v) => v.toLowerCase().includes(q)),
    );
  }

  const sorters = {
    value: (a, b) => b.value - a.value,
    yield: (a, b) => b.yield - a.yield,
    occupancy: (a, b) => b.occupied / b.units - a.occupied / a.units,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  list = [...list].sort(sorters[sort]);

  const totals = list.reduce(
    (acc, p) => ({
      value: acc.value + p.value,
      rent: acc.rent + p.monthlyRent,
      units: acc.units + p.units,
      occupied: acc.occupied + p.occupied,
    }),
    { value: 0, rent: 0, units: 0, occupied: 0 },
  );

  const toolbar = el("div.section-head", {}, [
    el("div", {}, [
      el("h2.section-title", { text: `${list.length} propert${list.length === 1 ? "y" : "ies"}` }),
      el("p.card__sub", {
        text: `${eurCompact(totals.value)} book value · ${eur(totals.rent)} monthly rent · ${
          totals.units ? pct(totals.occupied / totals.units, 1) : "—"
        } let`,
      }),
    ]),
    el("div.filters", {}, [
      segmented(
        TYPES.map((t) => ({ value: t, label: t })),
        filter,
        (value) => ctx.setState("properties", { filter: value }),
      ),
      segmented(
        [
          { value: "value", label: "Value" },
          { value: "yield", label: "Yield" },
          { value: "occupancy", label: "Occupancy" },
          { value: "name", label: "A–Z" },
        ],
        sort,
        (value) => ctx.setState("properties", { sort: value }),
      ),
    ]),
  ]);

  const grid = list.length
    ? el(
        "section.grid.grid--cards",
        {},
        list.map((p) => propertyCard(p, ctx)),
      )
    : card("", [
        emptyState(
          "No properties match",
          ctx.query ? `Nothing matches “${ctx.query}”. Try a city or a manager's name.` : "Adjust the filter to see more.",
          "building",
        ),
      ]);

  return el("div.view", {}, [toolbar, grid]);
}

function propertyCard(p, ctx) {
  const occupancy = p.occupied / p.units;
  const tone = occupancy === 1 ? "green" : occupancy >= 0.9 ? "blue" : occupancy >= 0.8 ? "orange" : "red";

  return el(
    "button.card.prop",
    { type: "button", "on:click": () => ctx.openProperty(p), "aria-label": `Open ${p.name}` },
    [
      el("div.prop__art", {}, [
        svg(propertyArt(p)),
        typeTag(p.type),
        el("div.prop__art-label", {}, [
          el("div.prop__name", { text: p.name }),
          el("div.prop__loc", { text: `${p.street} · ${p.city}` }),
        ]),
      ]),
      el("div.prop__body", {}, [
        el("div.prop__stats", {}, [
          stat("Value", eurCompact(p.value)),
          stat("Rent / mo", eurCompact(p.monthlyRent)),
          stat("Yield", `${p.yield.toFixed(1)}%`),
        ]),
        el("div", {}, [
          el("div.breakdown__top", { style: { marginBottom: "5px" } }, [
            el("span.stat__k", { text: "Occupancy" }),
            el("span.breakdown__amt", { text: `${p.occupied}/${p.units}` }),
          ]),
          occupancyMeter(occupancy),
        ]),
        el("div.prop__foot", {}, [
          badge(`${pct(occupancy, 0)} let`, tone),
          el("span.card__sub", { text: `${num(p.sqm)} m² · ${p.manager}` }),
        ]),
      ]),
    ],
  );
}

const typeTag = (text) => el("span.badge.badge--plain.prop__tag", { text });

const stat = (k, v) =>
  el("div.stat", {}, [el("span.stat__k", { text: k }), el("span.stat__v", { text: v })]);

const spec = (k, v) =>
  el("div.stat", {}, [el("span.stat__k", { text: k }), el("span.stat__v", { text: v })]);

/** Detail sheet body for a property. */
export function propertySheet(p, ctx) {
  const occupancy = p.occupied / p.units;
  return [
    el("div.sheet__art", {}, [svg(propertyArt(p))]),
    el("div.spec-grid", {}, [
      spec("Type", p.type),
      spec("Units", `${p.occupied} of ${p.units} let`),
      spec("Floor area", `${num(p.sqm)} m²`),
      spec("Built", String(p.year)),
      spec("Book value", eur(p.value)),
      spec("Monthly rent", eur(p.monthlyRent)),
      spec("Gross yield", `${p.yield.toFixed(1)}%`),
      spec("Manager", p.manager),
    ]),
    el("div", {}, [
      el("div.breakdown__top", { style: { marginBottom: "6px" } }, [
        el("span.stat__k", { text: "Occupancy" }),
        el("span.breakdown__amt", { text: pct(occupancy, 1) }),
      ]),
      occupancyMeter(occupancy),
    ]),
    el("div.filters", {}, [
      badge(`${p.rating.toFixed(1)} ★ tenant rating`, "blue"),
      badge(`${p.street}, ${p.city} (${p.country})`, "gray", true),
    ]),
  ];
}
