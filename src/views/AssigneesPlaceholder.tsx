import { Card } from "../components/ui/bits";
import { Icon } from "../components/Icon";
import { useStore } from "../data/store";
import { Avatar } from "../components/ui/bits";
import { assigneeLoads } from "../lib/derive";
import "./assignees-placeholder.css";

/**
 * Assignees is scoped for the next build pass (per the agreed
 * "Overview + Schedule core" scope). This gives an honest, styled
 * preview of the directory rather than a broken/empty route.
 */
export function AssigneesPlaceholder() {
  const store = useStore();
  const todayTasks = store.tasks.filter((t) => t.date === store.today);
  const load = assigneeLoads(todayTasks);

  return (
    <div className="asg-ph">
      <div className="asg-ph__head">
        <div>
          <h1 className="page-title">Assignees</h1>
          <p className="page-sub">Staff workload, profiles, and schedules</p>
        </div>
        <span className="asg-ph__badge">
          <Icon name="bolt" size={14} /> Next build pass
        </span>
      </div>

      <div className="asg-ph__grid">
        {store.assignees.map((a) => (
          <Card key={a.id} className="asg-card">
            <div className="asg-card__top">
              <Avatar a={a} size={52} />
              <div className="asg-card__id">
                <span className="asg-card__name">{a.name}</span>
                <span className="asg-card__role">{a.role}</span>
              </div>
              <span className={`asg-card__dot ${a.active ? "on" : "off"}`} />
            </div>
            <div className="asg-card__meta">
              <span>
                <b>{load.get(a.id) ?? 0}</b> today
              </span>
              <span>
                <b>{a.buildingIds.length}</b> buildings
              </span>
              <span>
                <b>{a.taskTypes.length}</b> task types
              </span>
            </div>
            <div className="asg-card__skills">
              {a.skills.slice(0, 3).map((s) => (
                <span key={s} className="asg-skill">
                  {s}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="asg-ph__note">
        <Icon name="users" size={18} />
        <p>
          The full Assignees experience — searchable directory, profile pages,
          workload-by-building, editable coverage, and multi-format export
          (§12.3 of the PRD) — lands in the next pass. This preview reads live
          from the same in-memory store.
        </p>
      </Card>
    </div>
  );
}
