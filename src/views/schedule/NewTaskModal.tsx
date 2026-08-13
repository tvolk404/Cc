import { useMemo, useState } from "react";
import { useStore } from "../../data/store";
import type { NewTaskInput } from "../../data/store";
import type { TaskType } from "../../data/types";
import { Icon } from "../../components/Icon";
import { taskTypeLabel } from "../../data/mockData";
import { fmtDateLong } from "../../lib/format";
import "./newtask.css";

const TYPES: TaskType[] = ["turnover", "checkin", "checkout", "maintenance", "inspection"];
const MAINT_SUB = ["Plumbing", "HVAC", "Electrical", "Appliance", "General"];

export function NewTaskModal({
  date,
  onClose,
  onCreated,
}: {
  date: string;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const store = useStore();
  const [type, setType] = useState<TaskType>("turnover");
  const [buildingId, setBuildingId] = useState(store.buildings[0].id);
  const [unitId, setUnitId] = useState("");
  const [subtype, setSubtype] = useState(MAINT_SUB[0]);
  const [time, setTime] = useState("");
  const [guest, setGuest] = useState("");
  const [ref, setRef] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const buildingUnits = useMemo(
    () => store.units.filter((u) => u.buildingId === buildingId),
    [store.units, buildingId],
  );

  const hasBooking = type === "turnover" || type === "checkin" || type === "checkout";

  const submit = async () => {
    if (!unitId) {
      setErr("Pick a unit.");
      return;
    }
    setSaving(true);
    setErr(null);
    let startMin: number | undefined;
    const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
    if (m) startMin = Math.min(23, +m[1]) * 60 + Math.min(59, +m[2]);

    const input: NewTaskInput = {
      date,
      buildingId,
      unitId,
      type,
      subtype: type === "maintenance" ? subtype : undefined,
      startMin,
      guestName: hasBooking ? guest || undefined : undefined,
      bookingRef: hasBooking ? ref || undefined : undefined,
      notes: notes || undefined,
    };
    const task = await store.createTask(input);
    setSaving(false);
    onCreated(task.id);
  };

  return (
    <>
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal" role="dialog" aria-label="New task">
        <div className="modal__head">
          <div>
            <h2 className="modal__title">New task</h2>
            <p className="modal__sub">{fmtDateLong(date)}</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__field modal__field--full">
            <label>Task type</label>
            <div className="typegrid">
              {TYPES.map((t) => (
                <button
                  key={t}
                  className={`typegrid__opt ${type === t ? "is-on" : ""}`}
                  onClick={() => setType(t)}
                  style={{ ["--tt" as string]: `var(--tt-${ttVar(t)})` }}
                >
                  <i />
                  {taskTypeLabel(t)}
                </button>
              ))}
            </div>
          </div>

          {type === "maintenance" && (
            <div className="modal__field modal__field--full">
              <label>Subtype</label>
              <select value={subtype} onChange={(e) => setSubtype(e.target.value)}>
                {MAINT_SUB.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <div className="modal__field">
            <label>Building</label>
            <select
              value={buildingId}
              onChange={(e) => {
                setBuildingId(e.target.value);
                setUnitId("");
              }}
            >
              {store.buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal__field">
            <label>Unit</label>
            <select value={unitId} onChange={(e) => setUnitId(e.target.value)}>
              <option value="">Select a unit…</option>
              {buildingUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal__field">
            <label>Scheduled time <span className="modal__opt">optional</span></label>
            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="HH:MM" />
          </div>

          {hasBooking && (
            <>
              <div className="modal__field">
                <label>Guest name <span className="modal__opt">optional</span></label>
                <input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="e.g. J. Carter" />
              </div>
              <div className="modal__field">
                <label>Booking ref <span className="modal__opt">optional</span></label>
                <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="BK-12345" />
              </div>
            </>
          )}

          <div className="modal__field modal__field--full">
            <label>Notes <span className="modal__opt">optional</span></label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Access details, special requests…" />
          </div>
        </div>

        <div className="modal__foot">
          {err && <span className="modal__err">{err}</span>}
          <div className="modal__foot-actions">
            <button className="modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="modal__submit" onClick={submit} disabled={saving}>
              {saving ? "Creating…" : "Create task"}
              {!saving && <Icon name="plus" size={15} strokeWidth={2.6} />}
            </button>
          </div>
        </div>
      </div>
    </>
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
