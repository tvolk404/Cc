# Scheduler v7 — Operations Control Tower

A multi-view property-operations scheduling workspace for hospitality teams:
plan, assign, and monitor tasks (turnover cleans, check-ins/outs, inspections,
maintenance) across buildings, units, and assignees.

Built in the **Skead** neumorphic design language (lime-green accents, rounded
cards, soft shadows). See `design-reference/` for the original style study.

> **Status:** functional **prototype**. Data is an in-memory store with
> simulated API latency and optimistic updates — no real backend, auth, or
> persistence yet (those are Phase 1 of the PRD roadmap).

## What's built (this pass)

Scope: **Overview + Schedule core**.

### Overview — operational awareness
- Daily KPI header (total tasks, % assigned gauge, check-ins, active buildings)
- **Attention feed** with severity-ranked, click-to-resolve items (unassigned
  check-ins, same-day turnovers, urgent work, building hotspots, missing times…)
- Building pressure, task-type breakdown, assignee load (with unassigned bucket)
- Day-activity strip, 7-day risk horizon, monthly demand heatmap
- Every insight deep-links into Schedule with the matching filter applied

### Schedule — day-level execution
- Date rail with per-day total/unassigned counts (state persisted in the URL)
- Full filter bar: company, building, unit type, unit, task type, assignee,
  unassigned-only, building search — with removable chips + clear-all
- **Bookings** — grouped by building → unit type → unit, collapsible, inline
  assign/unassign, group selection
- **Unit View** — time-based timeline with drag-to-reschedule (15-min snap),
  current-time line, and an unscheduled tray
- **Calendar** — monthly intensity heatmap with a day drawer grouped by building
- **Bulk actions** — selection toolbar with task-type mix, day/building
  "select similar" scope, and bulk assign (warns on reassignment)
- **Task drawer** — booking/guest, editable timing, key & Breezeway state,
  notes, attention flags, assignment, cross-links
- **New task** modal and **CSV export** of the filtered set

Assignees is stubbed with a styled directory preview (full profiles, editing,
schedules, and multi-format export land in the next pass).

## Tech

React 18 · TypeScript · Vite. No UI framework — hand-rolled components and CSS
tokens derived from the Skead system (`src/styles/tokens.css`).

```
src/
  data/        types, deterministic mock dataset, in-memory store
  lib/         derived counts, attention scoring, formatting, filter options
  components/  icons, shared UI atoms, layout shell, multi-select
  views/       Overview, Schedule (+ sub-views), Assignees preview
```

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the build
```

`npm run build` emits a static bundle in `dist/` — deploy to any static host
(Vercel, Netlify, GitHub Pages, S3). `vite.config.ts` uses `base: "./"` so it
works from any sub-path.
