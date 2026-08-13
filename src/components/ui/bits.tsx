// Small reusable UI atoms shared across views.
import type { CSSProperties, ReactNode } from "react";
import type { Assignee, Priority, Task, TaskType } from "../../data/types";
import { statusLabel, taskTypeLabel } from "../../data/mockData";
import { Icon, type IconName } from "../Icon";
import "./bits.css";

export function Avatar({
  a,
  size = 34,
  ring,
}: {
  a: Pick<Assignee, "emoji" | "avatarBg" | "name">;
  size?: number;
  ring?: string;
}) {
  return (
    <span
      className="avatar"
      title={a.name}
      style={{
        width: size,
        height: size,
        background: a.avatarBg,
        fontSize: size * 0.52,
        boxShadow: ring ? `0 0 0 2px ${ring}` : undefined,
      }}
    >
      {a.emoji}
    </span>
  );
}

export function AvatarStack({
  people,
  size = 30,
  max = 5,
}: {
  people: Array<Pick<Assignee, "emoji" | "avatarBg" | "name">>;
  size?: number;
  max?: number;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className="avatar-stack">
      {shown.map((p, i) => (
        <span key={i} className="avatar-stack__item">
          <Avatar a={p} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span
          className="avatar-stack__item avatar-more"
          style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}

const TT_ICON: Record<TaskType, IconName> = {
  turnover: "clean",
  checkin: "checkin",
  checkout: "checkout",
  maintenance: "wrench",
  inspection: "clipboard",
};

export function TaskTypeIcon({ type, size = 16 }: { type: TaskType; size?: number }) {
  return (
    <span
      className="tt-icon"
      style={{ ["--tt" as string]: `var(--tt-${ttVar(type)})`, width: size + 14, height: size + 14 }}
    >
      <Icon name={TT_ICON[type]} size={size} />
    </span>
  );
}
function ttVar(t: TaskType) {
  return {
    turnover: "clean",
    checkin: "checkin",
    checkout: "checkout",
    maintenance: "maintenance",
    inspection: "inspection",
  }[t];
}

export function TaskTypeChip({ type }: { type: TaskType }) {
  return (
    <span className="tt-chip" style={{ ["--tt" as string]: `var(--tt-${ttVar(type)})` }}>
      <i />
      {taskTypeLabel(type)}
    </span>
  );
}

export function StatusPill({ status }: { status: Task["status"] }) {
  return <span className={`status-pill status-pill--${status}`}>{statusLabel(status)}</span>;
}

export function PriorityDot({ priority }: { priority: Priority }) {
  if (priority === "normal" || priority === "low") return null;
  return (
    <span className={`prio prio--${priority}`} title={`${priority} priority`}>
      {priority === "urgent" ? "Urgent" : "High"}
    </span>
  );
}

export function IconButton({
  name,
  label,
  onClick,
  size = 42,
  variant = "soft",
}: {
  name: IconName;
  label: string;
  onClick?: () => void;
  size?: number;
  variant?: "soft" | "dark" | "ghost";
}) {
  return (
    <button
      className={`icon-btn icon-btn--${variant}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      aria-label={label}
      title={label}
      type="button"
    >
      <Icon name={name} size={size * 0.42} strokeWidth={2.4} />
    </button>
  );
}

export function Card({
  children,
  className = "",
  style,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  pad?: boolean;
}) {
  return (
    <section className={`card ${pad ? "card--pad" : ""} ${className}`} style={style}>
      {children}
    </section>
  );
}

export function CardHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="card-head">
      <div>
        <h3 className="card-title">{title}</h3>
        {sub && <p className="card-sub">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/** Horizontal mini bar showing total with an "unassigned" overlay segment. */
export function LoadBar({
  total,
  unassigned,
  max,
  color = "var(--navy)",
}: {
  total: number;
  unassigned: number;
  max: number;
  color?: string;
}) {
  const pct = max ? (total / max) * 100 : 0;
  const uPct = total ? (unassigned / total) * 100 : 0;
  return (
    <div className="loadbar" title={`${total} tasks · ${unassigned} unassigned`}>
      <div className="loadbar__track">
        <div className="loadbar__fill" style={{ width: `${pct}%`, background: color }}>
          <div className="loadbar__unassigned" style={{ width: `${uPct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return <span className="spinner" style={{ width: size, height: size }} aria-label="loading" />;
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: IconName;
  title: string;
  hint?: string;
}) {
  return (
    <div className="empty">
      <span className="empty__icon">
        <Icon name={icon} size={26} />
      </span>
      <p className="empty__title">{title}</p>
      {hint && <p className="empty__hint">{hint}</p>}
    </div>
  );
}
