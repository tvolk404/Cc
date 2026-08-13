// ============================================================
// Scheduler v7 — In-memory store (prototype backend)
// Simulates API latency and optimistic updates as described in
// §9 "Current Prototype Constraints" of the PRD.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Task, TaskType } from "./types";
import {
  assignees as seedAssignees,
  buildings,
  companies,
  generateTasks,
  TODAY,
  unitTypes,
  units,
} from "./mockData";

/** Fake network latency so optimistic UI is observable. */
const latency = () => 260 + Math.random() * 340;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface NewTaskInput {
  date: string;
  buildingId: string;
  unitId: string;
  type: TaskType;
  subtype?: string;
  startMin?: number;
  guestName?: string;
  bookingRef?: string;
  notes?: string;
}

interface StoreValue {
  tasks: Task[];
  pending: Set<string>; // task ids with an in-flight mutation
  today: string;
  // static reference
  companies: typeof companies;
  buildings: typeof buildings;
  unitTypes: typeof unitTypes;
  units: typeof units;
  assignees: typeof seedAssignees;
  // mutations
  assign: (taskId: string, assigneeId: string) => Promise<void>;
  unassign: (taskId: string) => Promise<void>;
  reschedule: (taskId: string, startMin: number | undefined) => Promise<void>;
  bulkAssign: (taskIds: string[], assigneeId: string) => Promise<void>;
  createTask: (input: NewTaskInput) => Promise<Task>;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => generateTasks());
  const [pending, setPending] = useState<Set<string>>(new Set());
  const idSeq = useRef(1_000_000);

  const mark = useCallback((ids: string[], on: boolean) => {
    setPending((prev) => {
      const next = new Set(prev);
      for (const id of ids) (on ? next.add(id) : next.delete(id));
      return next;
    });
  }, []);

  const patch = useCallback((id: string, fn: (t: Task) => Task) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? fn(t) : t)));
  }, []);

  const assign = useCallback(
    async (taskId: string, assigneeId: string) => {
      mark([taskId], true);
      await wait(latency());
      patch(taskId, (t) => ({ ...t, assigneeId, status: "assigned" }));
      mark([taskId], false);
    },
    [mark, patch],
  );

  const unassign = useCallback(
    async (taskId: string) => {
      mark([taskId], true);
      await wait(latency());
      patch(taskId, (t) => ({ ...t, assigneeId: undefined, status: "unassigned" }));
      mark([taskId], false);
    },
    [mark, patch],
  );

  const reschedule = useCallback(
    async (taskId: string, startMin: number | undefined) => {
      mark([taskId], true);
      await wait(latency() * 0.6);
      patch(taskId, (t) => ({ ...t, startMin }));
      mark([taskId], false);
    },
    [mark, patch],
  );

  const bulkAssign = useCallback(
    async (taskIds: string[], assigneeId: string) => {
      mark(taskIds, true);
      await wait(latency());
      setTasks((prev) =>
        prev.map((t) =>
          taskIds.includes(t.id) ? { ...t, assigneeId, status: "assigned" } : t,
        ),
      );
      mark(taskIds, false);
    },
    [mark],
  );

  const createTask = useCallback(
    async (input: NewTaskInput): Promise<Task> => {
      await wait(latency());
      const durationMin =
        { turnover: 90, checkin: 30, checkout: 30, maintenance: 60, inspection: 45 }[
          input.type
        ];
      const task: Task = {
        id: `t-${idSeq.current++}`,
        type: input.type,
        subtype: input.subtype,
        status: "unassigned",
        priority: "normal",
        durationMin,
        date: input.date,
        startMin: input.startMin,
        buildingId: input.buildingId,
        unitId: input.unitId,
        bookingRef: input.bookingRef,
        guestName: input.guestName,
        breezewayPushed: false,
        keyReady: false,
        notes: input.notes,
        guestImpacting:
          input.date === TODAY &&
          (input.type === "checkin" ||
            input.type === "checkout" ||
            input.type === "turnover"),
      };
      setTasks((prev) => [task, ...prev]);
      return task;
    },
    [],
  );

  const value = useMemo<StoreValue>(
    () => ({
      tasks,
      pending,
      today: TODAY,
      companies,
      buildings,
      unitTypes,
      units,
      assignees: seedAssignees,
      assign,
      unassign,
      reschedule,
      bulkAssign,
      createTask,
    }),
    [tasks, pending, assign, unassign, reschedule, bulkAssign, createTask],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
