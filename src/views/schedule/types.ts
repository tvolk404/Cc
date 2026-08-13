import type { TaskType } from "../../data/types";

/** Shared task-action handlers threaded from Schedule into sub-views. */
export interface TaskHandlers {
  selection: Set<string>;
  pending: Set<string>;
  toggle: (id: string) => void;
  setMany: (ids: string[], on: boolean) => void;
  openDrawer: (id: string) => void;
  unassign: (id: string) => void;
  requestAssign: (
    taskIds: string[],
    anchor: DOMRect,
    types: TaskType[],
    buildingId?: string,
  ) => void;
}
