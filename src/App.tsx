import { useCallback, useEffect, useState } from "react";
import { AppShell, type TopView } from "./components/layout/AppShell";
import { StoreProvider, useStore } from "./data/store";
import { emptyFilters, type Filters } from "./lib/derive";
import { Overview } from "./views/Overview";
import { Schedule, type ScheduleSub } from "./views/schedule/Schedule";
import { AssigneesPlaceholder } from "./views/AssigneesPlaceholder";
import { TODAY } from "./data/mockData";

interface Route {
  view: TopView;
  sub: ScheduleSub;
  date: string;
}

function readHash(): Partial<Route> {
  const h = new URLSearchParams(location.hash.replace(/^#/, ""));
  const view = h.get("view") as TopView | null;
  const sub = h.get("sub") as ScheduleSub | null;
  const date = h.get("date");
  return {
    view: view ?? undefined,
    sub: sub ?? undefined,
    date: date ?? undefined,
  };
}

function AppInner() {
  const store = useStore();

  const init = readHash();
  const [view, setView] = useState<TopView>(init.view ?? "overview");
  const [sub, setSub] = useState<ScheduleSub>(init.sub ?? "bookings");
  const [date, setDate] = useState<string>(init.date ?? TODAY);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  // Persist view/sub/date in URL (FR-SCH-1).
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("view", view);
    if (view === "schedule") params.set("sub", sub);
    params.set("date", date);
    const next = `#${params.toString()}`;
    if (location.hash !== next) history.replaceState(null, "", next);
  }, [view, sub, date]);

  // Respond to browser back/forward.
  useEffect(() => {
    const onHash = () => {
      const r = readHash();
      if (r.view) setView(r.view);
      if (r.sub) setSub(r.sub);
      if (r.date) setDate(r.date);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /** Deep-link from Overview into Schedule with an optional filter patch. */
  const goToSchedule = useCallback(
    (nextDate?: string, filterPatch?: Partial<Filters>, nextSub?: ScheduleSub) => {
      if (nextDate) setDate(nextDate);
      if (nextSub) setSub(nextSub);
      if (filterPatch) setFilters({ ...emptyFilters, ...filterPatch });
      setView("schedule");
    },
    [],
  );

  return (
    <AppShell view={view} onView={setView} today={store.today}>
      {view === "overview" && (
        <Overview date={date} onDate={setDate} goToSchedule={goToSchedule} />
      )}
      {view === "schedule" && (
        <Schedule
          date={date}
          onDate={setDate}
          sub={sub}
          onSub={setSub}
          filters={filters}
          onFilters={setFilters}
        />
      )}
      {view === "assignees" && <AssigneesPlaceholder />}
    </AppShell>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
