import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore } from "../../data/store";
import type { TaskType } from "../../data/types";
import { Avatar } from "../../components/ui/bits";
import { Icon } from "../../components/Icon";
import "./assignmenu.css";

export interface AssignTarget {
  taskIds: string[];
  anchor: DOMRect;
  /** task type(s) in the target set, for eligibility hinting */
  types: TaskType[];
  buildingId?: string;
  alreadyAssigned: number;
}

export function AssignMenu({
  target,
  onClose,
  onPick,
}: {
  target: AssignTarget;
  onClose: () => void;
  onPick: (assigneeId: string) => void;
}) {
  const store = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const w = 300;
    const gap = 8;
    let left = target.anchor.left;
    if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12;
    let top = target.anchor.bottom + gap;
    const h = ref.current?.offsetHeight ?? 360;
    if (top + h > window.innerHeight - 12) top = target.anchor.top - h - gap;
    setPos({ top: Math.max(12, top), left: Math.max(12, left) });
  }, [target]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  // rank eligible assignees first
  const ranked = store.assignees
    .map((a) => {
      const skill = target.types.every((t) => a.taskTypes.includes(t));
      const covers = target.buildingId ? a.buildingIds.includes(target.buildingId) : true;
      const eligible = a.active && skill && covers;
      return { a, eligible, score: (a.active ? 2 : 0) + (skill ? 2 : 0) + (covers ? 1 : 0) };
    })
    .filter(({ a }) => !q || a.name.toLowerCase().includes(q.toLowerCase()))
    .sort((x, y) => y.score - x.score);

  return (
    <div className="assignmenu" ref={ref} style={{ top: pos.top, left: pos.left }} role="dialog">
      <div className="assignmenu__head">
        <span>
          Assign {target.taskIds.length > 1 ? `${target.taskIds.length} tasks` : "task"}
        </span>
        <button onClick={onClose} aria-label="Close">
          <Icon name="x" size={15} />
        </button>
      </div>
      {target.alreadyAssigned > 0 && (
        <div className="assignmenu__warn">
          <Icon name="flag" size={13} />
          {target.alreadyAssigned} already assigned — this will reassign them.
        </div>
      )}
      <div className="assignmenu__search">
        <Icon name="search" size={14} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search staff"
        />
      </div>
      <div className="assignmenu__list">
        {ranked.map(({ a, eligible }) => (
          <button
            key={a.id}
            className={`assignmenu__opt ${eligible ? "" : "is-ineligible"}`}
            onClick={() => onPick(a.id)}
          >
            <Avatar a={a} size={32} />
            <span className="assignmenu__who">
              <span className="assignmenu__name">{a.name}</span>
              <span className="assignmenu__role">{a.role}</span>
            </span>
            {eligible ? (
              a.active && <span className="assignmenu__tag ok">Eligible</span>
            ) : (
              <span className="assignmenu__tag no">
                {!a.active ? "Inactive" : "Off-scope"}
              </span>
            )}
          </button>
        ))}
        {!ranked.length && <div className="assignmenu__none">No staff match “{q}”.</div>}
      </div>
    </div>
  );
}
