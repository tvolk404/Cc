import type { ReactNode } from "react";
import { Icon, type IconName } from "../Icon";
import { Avatar } from "../ui/bits";
import { assignees } from "../../data/mockData";
import { fmtDateLong } from "../../lib/format";
import "./appshell.css";

export type TopView = "overview" | "schedule" | "assignees";

const NAV: Array<{ view: TopView; icon: IconName; label: string }> = [
  { view: "overview", icon: "grid", label: "Overview" },
  { view: "schedule", icon: "calendar", label: "Schedule" },
  { view: "assignees", icon: "users", label: "Assignees" },
];

const EXTRA_NAV: Array<{ icon: IconName; label: string }> = [
  { icon: "inbox", label: "Inbox" },
  { icon: "dollar", label: "Finance" },
  { icon: "sliders", label: "Settings" },
];

export function AppShell({
  view,
  onView,
  today,
  children,
}: {
  view: TopView;
  onView: (v: TopView) => void;
  today: string;
  children: ReactNode;
}) {
  return (
    <div className="shell">
      {/* ---- Top bar ---- */}
      <header className="topbar">
        <div className="brand">
          <span className="brand__mark">
            <Icon name="bolt" size={19} strokeWidth={2.2} />
          </span>
          <span className="brand__name">Scheduler</span>
          <span className="brand__ver">v7</span>
        </div>

        <div className="topbar__pill">
          <div className="topbar__greet">
            Operations Control Tower
            <span className="topbar__date">
              <span className="topbar__cal">
                <Icon name="calendar" size={15} />
              </span>
              {fmtDateLong(today)}
            </span>
          </div>

          <div className="topbar__status">
            <span className="live-dot" /> Live prototype · in-memory data
          </div>

          <div className="topbar__actions">
            <button className="topbar__bell" aria-label="Notifications">
              <Icon name="bell" size={19} />
            </button>
            <span className="topbar__me">
              <Avatar a={assignees[0]} size={40} />
            </span>
          </div>
        </div>
      </header>

      <div className="shell__body">
        {/* ---- Sidebar ---- */}
        <aside className="sidebar">
          <nav className="navrail">
            {NAV.map((n) => (
              <button
                key={n.view}
                className={`navrail__item ${view === n.view ? "is-active" : ""}`}
                onClick={() => onView(n.view)}
                title={n.label}
                aria-label={n.label}
                aria-current={view === n.view}
              >
                <Icon name={n.icon} size={22} />
                <span className="navrail__tip">{n.label}</span>
              </button>
            ))}
          </nav>

          <nav className="navrail navrail--muted">
            {EXTRA_NAV.map((n) => (
              <button
                key={n.label}
                className="navrail__item navrail__item--muted"
                title={`${n.label} (cross-link)`}
                aria-label={n.label}
              >
                <Icon name={n.icon} size={20} />
                <span className="navrail__tip">{n.label}</span>
              </button>
            ))}
          </nav>

          <div className="teamrail">
            {assignees.slice(0, 8).map((a) => (
              <span key={a.id} className={`teamrail__av ${a.active ? "" : "is-off"}`}>
                <Avatar a={a} size={40} />
              </span>
            ))}
          </div>
        </aside>

        {/* ---- Main ---- */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
