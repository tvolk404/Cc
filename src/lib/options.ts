// Build MultiSelect option lists from store reference data.
import type { Option } from "../components/ui/MultiSelect";
import { taskTypeLabel } from "../data/mockData";
import type { Assignee, Building, Company, TaskType, Unit, UnitType } from "../data/types";

const TASK_TYPES: TaskType[] = [
  "turnover",
  "checkin",
  "checkout",
  "maintenance",
  "inspection",
];

export function companyOptions(companies: Company[]): Option[] {
  return companies.map((c) => ({ value: c.id, label: c.name }));
}
export function buildingOptions(buildings: Building[]): Option[] {
  return buildings.map((b) => ({ value: b.id, label: b.name, hint: b.code }));
}
export function unitTypeOptions(unitTypes: UnitType[]): Option[] {
  return unitTypes.map((u) => ({ value: u.id, label: u.name }));
}
export function unitOptions(units: Unit[], buildings: Building[]): Option[] {
  const code = new Map(buildings.map((b) => [b.id, b.code]));
  return units.map((u) => ({
    value: u.id,
    label: u.label,
    hint: code.get(u.buildingId),
  }));
}
export function taskTypeOptions(): Option[] {
  return TASK_TYPES.map((t) => ({ value: t, label: taskTypeLabel(t) }));
}
export function assigneeOptions(assignees: Assignee[]): Option[] {
  return [
    { value: "unassigned", label: "Unassigned", hint: "special" },
    ...assignees.map((a) => ({ value: a.id, label: a.name, hint: a.role })),
  ];
}
