/** Reusable pieces shared across views. */

import { el, svg, eur, pct, avatar } from "./ui.js";
import { icons } from "./icons.js";

export const card = (className = "", children = []) =>
  el(`div.card${className ? "." + className.split(" ").join(".") : ""}`, {}, children);

export const cardHead = (title, sub, trailing) =>
  el("div.card__head", {}, [
    el("div", {}, [el("h3.card__title", { text: title }), sub && el("p.card__sub", { text: sub })]),
    trailing,
  ]);

export const sectionHead = (title, trailing) =>
  el("div.section-head", {}, [el("h2.section-title", { text: title }), trailing]);

export function delta(value, { suffix = "vs last month", inverse = false } = {}) {
  const up = value > 0;
  const good = inverse ? !up : up;
  const kind = value === 0 ? "flat" : good ? "up" : "down";
  return el("div.kpi__foot", {}, [
    el(`span.delta.delta--${kind}`, {}, [
      svg(value === 0 ? icons.minus : up ? icons.arrowUp : icons.arrowDown),
      `${up ? "+" : ""}${value.toFixed(1)}%`,
    ]),
    el("span", { text: suffix }),
  ]);
}

/**
 * @param {{label:string, value:string, icon:keyof typeof icons, tint:string,
 *          change?:number, changeNote?:string, inverse?:boolean, foot?:Node}} config
 */
export function kpiTile({ label, value, icon, tint, change, changeNote, inverse, foot }) {
  return card("kpi", [
    el("div.kpi__top", {}, [
      el("span.kpi__glyph", { style: { background: tint } }, [svg(icons[icon])]),
      el("span.kpi__label", { text: label }),
    ]),
    el("div.kpi__value", { text: value }),
    foot ?? (change === undefined ? null : delta(change, { suffix: changeNote, inverse })),
  ]);
}

export const badge = (text, tone = "gray", plain = false) =>
  el(`span.badge.badge--${tone}${plain ? ".badge--plain" : ""}`, { text });

export const TENANT_TONE = { current: "green", notice: "orange", late: "red", vacant: "gray" };
export const TENANT_LABEL = { current: "Current", notice: "On notice", late: "Late", vacant: "Vacant" };
export const WO_TONE = { open: "red", progress: "orange", done: "green" };
export const WO_LABEL = { open: "Open", progress: "In progress", done: "Completed" };

export const chevron = () => {
  const node = svg(icons.chevron);
  node.classList.add("row__chev");
  return node;
};

/** Generic tappable list row. */
export function row({ leading, title, sub, trailing, onClick }) {
  const kids = [
    leading,
    el("div.row__main", {}, [
      el("div.row__title", { text: title }),
      sub && el("div.row__sub", { text: sub }),
    ]),
    trailing && el("div.row__meta", {}, Array.isArray(trailing) ? trailing : [trailing]),
    onClick && chevron(),
  ];
  return onClick
    ? el("button.row.row--button", { type: "button", "on:click": onClick }, kids)
    : el("div.row", {}, kids);
}

export const money = (n) =>
  el("span.row__amount", {
    text: `${n > 0 ? "+" : ""}${eur(n)}`,
    style: { color: n > 0 ? "var(--green)" : n < 0 ? "var(--red)" : "inherit" },
  });

export function emptyState(title, text, icon = "inbox") {
  return el("div.empty", {}, [
    el("div.empty__glyph", {}, [svg(icons[icon])]),
    el("div.empty__title", { text: title }),
    el("p.empty__text", { text }),
  ]);
}

/** Segmented control. `options` = [{value,label}] */
export function segmented(options, active, onChange, extraClass = "") {
  const node = el(`div.seg${extraClass ? "." + extraClass : ""}`, { role: "radiogroup" });
  for (const opt of options) {
    node.append(
      el("button", {
        type: "button",
        role: "radio",
        "aria-checked": String(opt.value === active),
        text: opt.label,
        "on:click": () => onChange(opt.value),
      }),
    );
  }
  return node;
}

export const personCell = (name, sub) =>
  el("div.cell-person", {}, [
    avatar(name, true),
    el("div", {}, [
      el("div.cell-strong", { text: name }),
      sub && el("div.cell-dim", { style: { fontSize: "12px" }, text: sub }),
    ]),
  ]);

/**
 * Sortable table.
 * @param {{columns:{key,label,align?,render?,sortable?}[], rows:object[],
 *          sort:{key,dir}, onSort:(key)=>void}} config
 */
export function dataTable({ columns, rows, sort, onSort }) {
  const head = el(
    "tr",
    {},
    columns.map((col) =>
      el("th", { style: col.align === "right" ? { textAlign: "right" } : null }, [
        col.sortable === false
          ? col.label
          : el(
              "button",
              { type: "button", "on:click": () => onSort(col.key) },
              [
                col.label,
                sort.key === col.key
                  ? el("span", { "data-dir": sort.dir, text: sort.dir === "asc" ? "↑" : "↓" })
                  : null,
              ],
            ),
      ]),
    ),
  );

  const body = el(
    "tbody",
    {},
    rows.map((r) =>
      el(
        "tr",
        {},
        columns.map((col) => {
          const content = col.render ? col.render(r) : r[col.key];
          return el("td", { class: col.align === "right" ? "num" : "" }, [
            content instanceof Node ? content : String(content ?? "—"),
          ]);
        }),
      ),
    ),
  );

  return el("div.table-wrap", {}, [el("table.data", {}, [el("thead", {}, [head]), body])]);
}

export const occupancyMeter = (ratio) =>
  el("div.meter", { role: "meter", "aria-valuenow": Math.round(ratio * 100) }, [
    el("div.meter__fill", { style: { width: pct(ratio, 0) } }),
  ]);
