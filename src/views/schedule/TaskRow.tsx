import { useStore } from "../../data/store";
import type { Task } from "../../data/types";
import { Avatar, Spinner, StatusPill, TaskTypeIcon, PriorityDot } from "../../components/ui/bits";
import { Icon } from "../../components/Icon";
import { fmtDuration, fmtTime } from "../../lib/format";
import { taskTypeLabel } from "../../data/mockData";
import type { TaskHandlers } from "./types";
import "./taskrow.css";

export function TaskRow({ task, h }: { task: Task; h: TaskHandlers }) {
  const store = useStore();
  const unit = store.units.find((u) => u.id === task.unitId);
  const building = store.buildings.find((b) => b.id === task.buildingId);
  const assignee = task.assigneeId
    ? store.assignees.find((a) => a.id === task.assigneeId)
    : undefined;
  const busy = h.pending.has(task.id);
  const selected = h.selection.has(task.id);

  return (
    <div
      className={`trow ${selected ? "is-selected" : ""} ${!task.assigneeId ? "is-unassigned" : ""}`}
    >
      <label className="trow__check" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => h.toggle(task.id)}
          aria-label={`Select ${taskTypeLabel(task.type)}`}
        />
        <span />
      </label>

      <button className="trow__main" onClick={() => h.openDrawer(task.id)}>
        <TaskTypeIcon type={task.type} size={18} />
        <span className="trow__info">
          <span className="trow__title">
            {taskTypeLabel(task.type)}
            {task.subtype && <span className="trow__subtype">· {task.subtype}</span>}
            <PriorityDot priority={task.priority} />
          </span>
          <span className="trow__meta">
            {building?.code} · {unit?.label}
            {task.guestName && <> · {task.guestName}</>}
          </span>
        </span>
      </button>

      <span className="trow__time">
        <Icon name="clock" size={13} />
        {fmtTime(task.startMin)}
        <span className="trow__dur">{fmtDuration(task.durationMin)}</span>
      </span>

      <StatusPill status={task.status} />

      <div className="trow__assign">
        {busy ? (
          <span className="trow__busy">
            <Spinner size={15} />
          </span>
        ) : assignee ? (
          <div className="trow__assignee">
            <Avatar a={assignee} size={30} />
            <span className="trow__aname">{assignee.name.split(" ")[0]}</span>
            <button
              className="trow__unassign"
              onClick={() => h.unassign(task.id)}
              aria-label="Unassign"
              title="Unassign"
            >
              <Icon name="x" size={13} />
            </button>
          </div>
        ) : (
          <button
            className="trow__assign-btn"
            onClick={(e) =>
              h.requestAssign(
                [task.id],
                e.currentTarget.getBoundingClientRect(),
                [task.type],
                task.buildingId,
              )
            }
          >
            <Icon name="plus" size={14} strokeWidth={2.6} />
            Assign
          </button>
        )}
      </div>
    </div>
  );
}
