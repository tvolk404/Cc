import { useMemo } from "react";
import { useStore } from "../../data/store";
import { MultiSelect } from "../../components/ui/MultiSelect";
import { Icon } from "../../components/Icon";
import { activeFilterCount, emptyFilters, type Filters } from "../../lib/derive";
import {
  assigneeOptions,
  buildingOptions,
  companyOptions,
  taskTypeOptions,
  unitOptions,
  unitTypeOptions,
} from "../../lib/options";
import { taskTypeLabel } from "../../data/mockData";
import type { TaskType } from "../../data/types";
import "./filterbar.css";

interface Chip {
  key: string;
  label: string;
  next: Filters;
}

export function FilterBar({
  filters,
  onFilters,
}: {
  filters: Filters;
  onFilters: (f: Filters) => void;
}) {
  const store = useStore();
  const set = (patch: Partial<Filters>) => onFilters({ ...filters, ...patch });

  // Units narrow to selected buildings for usability.
  const unitOpts = useMemo(() => {
    const us = filters.buildingIds.length
      ? store.units.filter((u) => filters.buildingIds.includes(u.buildingId))
      : store.units;
    return unitOptions(us, store.buildings);
  }, [filters.buildingIds, store.units, store.buildings]);

  const count = activeFilterCount(filters);
  const chips = useMemo(() => buildChips(filters, store), [filters, store]);

  return (
    <div className="filterbar">
      <div className="filterbar__search">
        <Icon name="search" size={16} />
        <input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search buildings"
        />
        {filters.search && (
          <button onClick={() => set({ search: "" })} aria-label="Clear search">
            <Icon name="x" size={14} />
          </button>
        )}
      </div>

      <div className="filterbar__selects">
        <MultiSelect
          label="Company"
          options={companyOptions(store.companies)}
          selected={filters.companyIds}
          onChange={(v) => set({ companyIds: v })}
          width={150}
        />
        <MultiSelect
          label="Building"
          options={buildingOptions(store.buildings)}
          selected={filters.buildingIds}
          onChange={(v) => set({ buildingIds: v })}
        />
        <MultiSelect
          label="Unit type"
          options={unitTypeOptions(store.unitTypes)}
          selected={filters.unitTypeIds}
          onChange={(v) => set({ unitTypeIds: v })}
          width={150}
        />
        <MultiSelect
          label="Unit"
          options={unitOpts}
          selected={filters.unitIds}
          onChange={(v) => set({ unitIds: v })}
          width={140}
        />
        <MultiSelect
          label="Task type"
          options={taskTypeOptions()}
          selected={filters.taskTypes}
          onChange={(v) => set({ taskTypes: v as TaskType[] })}
          width={160}
        />
        <MultiSelect
          label="Assignee"
          options={assigneeOptions(store.assignees)}
          selected={filters.assigneeIds}
          onChange={(v) => set({ assigneeIds: v })}
        />
        <button
          className={`filterbar__unassigned ${filters.unassignedOnly ? "is-on" : ""}`}
          onClick={() => set({ unassignedOnly: !filters.unassignedOnly })}
          aria-pressed={filters.unassignedOnly}
        >
          <span className="filterbar__switch" />
          Unassigned only
        </button>
      </div>

      {count > 0 && (
        <div className="filterbar__active">
          {chips.map((c) => (
            <button key={c.key} className="fchip" onClick={() => onFilters(c.next)}>
              <span className="fchip__label">{c.label}</span>
              <Icon name="x" size={12} strokeWidth={2.6} />
            </button>
          ))}
          <button className="fchip fchip--clear" onClick={() => onFilters(emptyFilters)}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function buildChips(f: Filters, store: ReturnType<typeof useStore>): Chip[] {
  const out: Chip[] = [];
  const bName = new Map(store.buildings.map((b) => [b.id, b.name]));
  const utName = new Map(store.unitTypes.map((u) => [u.id, u.name]));
  const uLabel = new Map(store.units.map((u) => [u.id, u.label]));
  const aName = new Map(store.assignees.map((a) => [a.id, a.name]));
  const coName = new Map(store.companies.map((c) => [c.id, c.name]));

  const drop = <K extends keyof Filters>(key: K, id: string): Filters => ({
    ...f,
    [key]: (f[key] as string[]).filter((x) => x !== id),
  });

  for (const id of f.companyIds)
    out.push({ key: `co-${id}`, label: coName.get(id) ?? id, next: drop("companyIds", id) });
  for (const id of f.buildingIds)
    out.push({ key: `b-${id}`, label: bName.get(id) ?? id, next: drop("buildingIds", id) });
  for (const id of f.unitTypeIds)
    out.push({ key: `ut-${id}`, label: utName.get(id) ?? id, next: drop("unitTypeIds", id) });
  for (const id of f.unitIds)
    out.push({ key: `u-${id}`, label: uLabel.get(id) ?? id, next: drop("unitIds", id) });
  for (const id of f.taskTypes)
    out.push({ key: `tt-${id}`, label: taskTypeLabel(id), next: drop("taskTypes", id) });
  for (const id of f.assigneeIds)
    out.push({
      key: `a-${id}`,
      label: id === "unassigned" ? "Unassigned" : aName.get(id) ?? id,
      next: drop("assigneeIds", id),
    });
  if (f.unassignedOnly)
    out.push({ key: "unonly", label: "Unassigned only", next: { ...f, unassignedOnly: false } });
  if (f.search.trim())
    out.push({ key: "search", label: `“${f.search}”`, next: { ...f, search: "" } });

  return out;
}
