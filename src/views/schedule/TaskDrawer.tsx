import { useEffect, useState } from "react";
import { useStore } from "../../data/store";
import type { Task } from "../../data/types";
import { Avatar, Spinner, StatusPill, TaskTypeIcon } from "../../components/ui/bits";
import { Icon } from "../../components/Icon";
import { fmtDuration, fmtTime, fmtDateLong } from "../../lib/format";
import { taskTypeLabel } from "../../data/mockData";
import "./taskdrawer.css";

export function TaskDrawer({
  task,
  onClose,
  onRequestAssign,
}: {
  task: Task | null;
  onClose: () => void;
  onRequestAssign: (taskId: string, anchor: DOMRect) => void;
}) {
  const store = useStore();
  const [timeDraft, setTimeDraft] = useState<string>("");

  useEffect(() => {
    setTimeDraft(task?.startMin != null ? fmtTime(task.startMin) : "");
  }, [task?.id, task?.startMin]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (task) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [task, onClose]);

  if (!task) return null;

  const building = store.buildings.find((b) => b.id === task.buildingId);
  const unit = store.units.find((u) => u.id === task.unitId);
  const assignee = task.assigneeId
    ? store.assignees.find((a) => a.id === task.assigneeId)
    : undefined;
  const busy = store.pending.has(task.id);

  const commitTime = () => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(timeDraft.trim());
    if (!m) {
      setTimeDraft(task.startMin != null ? fmtTime(task.startMin) : "");
      return;
    }
    const min = Math.min(23, +m[1]) * 60 + Math.min(59, +m[2]);
    store.reschedule(task.id, min);
  };

  const attention: string[] = [];
  if (!task.assigneeId) attention.push("Unassigned");
  if (task.guestImpacting && !task.assigneeId) attention.push("Guest-impacting today");
  if (task.startMin == null) attention.push("No scheduled time");
  if (!task.keyReady) attention.push("Key not ready");
  if (task.priority === "urgent") attention.push("Urgent priority");

  return (
    <>
      <div className="drawer__scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Task details">
        <div className="drawer__head">
          <div className="drawer__head-main">
            <TaskTypeIcon type={task.type} size={22} />
            <div>
              <h2 className="drawer__title">
                {taskTypeLabel(task.type)}
                {task.subtype && <span className="drawer__subtype">{task.subtype}</span>}
              </h2>
              <div className="drawer__loc">
                {building?.name} · {unit?.label}
              </div>
            </div>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="drawer__statusrow">
          <StatusPill status={task.status} />
          {task.priority !== "normal" && task.priority !== "low" && (
            <span className={`drawer__prio drawer__prio--${task.priority}`}>
              {task.priority} priority
            </span>
          )}
          <span className="drawer__id">{task.id}</span>
        </div>

        {attention.length > 0 && (
          <div className="drawer__attention">
            <Icon name="flag" size={15} />
            <div className="drawer__attention-tags">
              {attention.map((a) => (
                <span key={a}>{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Assignment */}
        <div className="drawer__section">
          <div className="drawer__section-title">Assignment</div>
          {busy ? (
            <div className="drawer__assignee is-busy">
              <Spinner size={18} /> Saving…
            </div>
          ) : assignee ? (
            <div className="drawer__assignee">
              <Avatar a={assignee} size={40} />
              <div className="drawer__assignee-id">
                <span className="drawer__assignee-name">{assignee.name}</span>
                <span className="drawer__assignee-role">{assignee.role}</span>
              </div>
              <button className="drawer__unassign" onClick={() => store.unassign(task.id)}>
                Unassign
              </button>
            </div>
          ) : (
            <button
              className="drawer__assign"
              onClick={(e) => onRequestAssign(task.id, e.currentTarget.getBoundingClientRect())}
            >
              <Icon name="plus" size={16} strokeWidth={2.4} />
              Assign someone
            </button>
          )}
        </div>

        {/* Timing */}
        <div className="drawer__section">
          <div className="drawer__section-title">Timing</div>
          <div className="drawer__grid">
            <label className="drawer__field">
              <span>Start time</span>
              <input
                value={timeDraft}
                onChange={(e) => setTimeDraft(e.target.value)}
                onBlur={commitTime}
                onKeyDown={(e) => e.key === "Enter" && commitTime()}
                placeholder="HH:MM"
              />
            </label>
            <div className="drawer__field">
              <span>Est. duration</span>
              <div className="drawer__static">{fmtDuration(task.durationMin)}</div>
            </div>
            <div className="drawer__field">
              <span>Ends approx.</span>
              <div className="drawer__static">
                {task.startMin != null ? fmtTime(task.startMin + task.durationMin) : "—"}
              </div>
            </div>
            <div className="drawer__field">
              <span>Date</span>
              <div className="drawer__static">{fmtDateLong(task.date)}</div>
            </div>
          </div>
        </div>

        {/* Booking & guest */}
        {(task.bookingRef || task.guestName) && (
          <div className="drawer__section">
            <div className="drawer__section-title">Booking & guest</div>
            <div className="drawer__grid">
              <Field label="Guest" value={task.guestName} />
              <Field label="Booking ref" value={task.bookingRef} />
              <Field label="Check-in" value={task.checkIn ? fmtDateLong(task.checkIn) : undefined} />
              <Field label="Check-out" value={task.checkOut ? fmtDateLong(task.checkOut) : undefined} />
              <Field label="Nights" value={task.nights?.toString()} />
            </div>
          </div>
        )}

        {/* Operational */}
        <div className="drawer__section">
          <div className="drawer__section-title">Operational</div>
          <div className="drawer__flags">
            <span className={`drawer__flag ${task.keyReady ? "on" : "off"}`}>
              <Icon name="key" size={14} /> Key {task.keyReady ? "ready" : "not ready"}
            </span>
            <span className={`drawer__flag ${task.breezewayPushed ? "on" : "off"}`}>
              <Icon name="bolt" size={14} /> Breezeway {task.breezewayPushed ? "pushed" : "not pushed"}
            </span>
          </div>
          {task.notes && <div className="drawer__notes">“{task.notes}”</div>}
        </div>

        {/* Cross-links */}
        <div className="drawer__links">
          <button className="drawer__link">
            <Icon name="message" size={16} /> Message assignee
          </button>
          <button className="drawer__link">
            <Icon name="dollar" size={16} /> Booking cost
          </button>
        </div>
      </aside>
    </>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="drawer__field">
      <span>{label}</span>
      <div className="drawer__static">{value ?? "—"}</div>
    </div>
  );
}
