import { useMemo, useState } from "react";
import { useStore } from "../../data/store";
import type { Task, TaskType } from "../../data/types";
import { TaskRow } from "./TaskRow";
import { Icon } from "../../components/Icon";
import { EmptyState } from "../../components/ui/bits";
import type { TaskHandlers } from "./types";
import "./bookings.css";

export function BookingsView({ tasks, h }: { tasks: Task[]; h: TaskHandlers }) {
  const store = useStore();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const groups = useMemo(() => groupTasks(tasks, store), [tasks, store]);

  if (!tasks.length) {
    return (
      <EmptyState
        icon="list"
        title="No tasks match the current filters"
        hint="Try clearing a filter or picking another date."
      />
    );
  }

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="bookings">
      {groups.map((g) => {
        const open = !collapsed.has(g.building.id);
        const allIds = g.tasks.map((t) => t.id);
        const allSelected = allIds.every((id) => h.selection.has(id));
        return (
          <div className="bgroup" key={g.building.id}>
            <div className="bgroup__head">
              <button
                className="bgroup__toggle"
                onClick={() => toggleCollapse(g.building.id)}
                aria-expanded={open}
              >
                <Icon name={open ? "chevron-down" : "chevron-right"} size={18} />
                <span className="bgroup__code">{g.building.code}</span>
                <span className="bgroup__name">{g.building.name}</span>
              </button>
              <div className="bgroup__stats">
                <span className="bgroup__count">{g.tasks.length} tasks</span>
                {g.unassigned > 0 && (
                  <span className="bgroup__un">{g.unassigned} unassigned</span>
                )}
                <button
                  className="bgroup__select"
                  onClick={() => h.setMany(allIds, !allSelected)}
                >
                  {allSelected ? "Deselect" : "Select all"}
                </button>
              </div>
            </div>

            {open && (
              <div className="bgroup__body">
                {g.single ? (
                  <div className="brows">
                    {g.tasks.map((t) => (
                      <TaskRow key={t.id} task={t} h={h} />
                    ))}
                  </div>
                ) : (
                  g.subGroups.map((sg) => (
                    <div className="bsub" key={sg.key}>
                      <div className="bsub__head">
                        <span className="bsub__title">
                          {sg.unitTypeName} · {sg.unitLabel}
                        </span>
                        {sg.unassigned > 0 && (
                          <span className="bsub__un">{sg.unassigned} open</span>
                        )}
                      </div>
                      <div className="brows">
                        {sg.tasks.map((t) => (
                          <TaskRow key={t.id} task={t} h={h} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface SubGroup {
  key: string;
  unitTypeName: string;
  unitLabel: string;
  tasks: Task[];
  unassigned: number;
}
interface Group {
  building: { id: string; name: string; code: string };
  tasks: Task[];
  unassigned: number;
  single: boolean;
  subGroups: SubGroup[];
}

function groupTasks(tasks: Task[], store: ReturnType<typeof useStore>): Group[] {
  const byBuilding = new Map<string, Task[]>();
  for (const t of tasks) {
    const arr = byBuilding.get(t.buildingId) ?? [];
    arr.push(t);
    byBuilding.set(t.buildingId, arr);
  }

  const utName = new Map(store.unitTypes.map((u) => [u.id, u.name]));
  const unitById = new Map(store.units.map((u) => [u.id, u]));

  const groups: Group[] = [];
  for (const [bid, bTasks] of byBuilding) {
    const b = store.buildings.find((b) => b.id === bid)!;
    const unassigned = bTasks.filter((t) => !t.assigneeId).length;
    const unitsInvolved = new Set(bTasks.map((t) => t.unitId));
    // FR-SCH-3: single-unit buildings may be flattened for efficiency.
    const single = unitsInvolved.size <= 1;

    let subGroups: SubGroup[] = [];
    if (!single) {
      const byUnit = new Map<string, Task[]>();
      for (const t of bTasks) {
        const arr = byUnit.get(t.unitId) ?? [];
        arr.push(t);
        byUnit.set(t.unitId, arr);
      }
      subGroups = [...byUnit.entries()]
        .map(([uid, uTasks]) => {
          const u = unitById.get(uid);
          return {
            key: uid,
            unitTypeName: u ? utName.get(u.unitTypeId) ?? "Unit" : "Unit",
            unitLabel: u?.label ?? uid,
            tasks: sortTasks(uTasks),
            unassigned: uTasks.filter((t) => !t.assigneeId).length,
          };
        })
        .sort((a, b) => b.tasks.length - a.tasks.length);
    }

    groups.push({
      building: b,
      tasks: sortTasks(bTasks),
      unassigned,
      single,
      subGroups,
    });
  }

  return groups.sort((a, b) => b.tasks.length - a.tasks.length);
}

const TYPE_RANK: Record<TaskType, number> = {
  checkin: 0,
  turnover: 1,
  checkout: 2,
  inspection: 3,
  maintenance: 4,
};
function sortTasks(ts: Task[]): Task[] {
  return [...ts].sort((a, b) => {
    if (!!a.assigneeId !== !!b.assigneeId) return a.assigneeId ? 1 : -1;
    const r = TYPE_RANK[a.type] - TYPE_RANK[b.type];
    if (r) return r;
    return (a.startMin ?? 9999) - (b.startMin ?? 9999);
  });
}
