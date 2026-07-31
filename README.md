# Turnkey — Property Operations Scheduler

A scheduling hub for **property managers** and the **service teams** they dispatch
work to (cleaning, maintenance, linen, inspections or custom jobs). Two entry
points, one shared source of truth. Visual language inspired by the N26 design
system — minimalist, generous whitespace, soft rounded surfaces and a signature
mint accent.

## Two portals

| Portal | Who it's for | What they do |
| --- | --- | --- |
| **Manager workspace** (`/manager`) | Property managers | Add properties & units, onboard contractors, schedule and track every task. |
| **Service workspace** (`/provider`) | Contractors / service companies | See assigned jobs, accept/decline, and move them from *in progress* to *complete*. |

Pick a portal from the landing page (`/`). State is shared through `localStorage`,
so a task scheduled in the manager portal shows up instantly in the provider
portal (and syncs live across browser tabs).

## Features

- **Properties, added manually** — two types:
  - **Single unit** — a home let as one whole unit (beds/baths/status).
  - **Multi unit** — a building broken into **unit types** (e.g. *Studio*,
    *Two-Bed Loft*), each holding **specific units** (e.g. *Apt 101*) with their
    own status.
- **Contractors** — add companies/crews, match them to service categories, and
  dispatch jobs. They appear as selectable identities in the service portal.
- **Task scheduling** — category, property + specific unit, assigned contractor,
  date/time/duration, priority and recurrence (one-off, daily, weekly, monthly).
- **Views** — dashboard, filterable task board, and a week calendar you can
  click to add tasks.
- **Live status flow** — `scheduled → accepted → in progress → completed`
  (or `declined`), driven from either portal.

## Tech

- React 18 + TypeScript + Vite
- React Router for the two portals
- A single design-system CSS file (`src/index.css`) — no UI framework
- Client-side store backed by `localStorage` (`src/store/`)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the production build
```

Use **Reset demo data** in the manager sidebar to restore the seeded example
portfolio at any time.

## Project structure

```
src/
  index.css              Design system (tokens, buttons, cards, inputs, modal…)
  types.ts               Domain model
  lib.ts                 Date/formatting/lookup helpers
  store/                 localStorage-backed shared state + seed data
  components/            Reusable UI (Modal, TaskModal, TaskRow, icons…)
  pages/
    Landing.tsx          Portal chooser
    manager/             Dashboard, Properties, PropertyDetail, Contractors, Tasks, Schedule
    provider/            Overview + My jobs (with contractor switcher)
```
