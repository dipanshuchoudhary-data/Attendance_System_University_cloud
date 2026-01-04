import { useEffect, useState } from "react";
import { api } from "../api/api";

/* ---------- TYPES ---------- */
interface ScheduleItem {
  schedule_id: string;
  class_id: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
}

interface ClassItem {
  class_id: string;
}

/* ---------- INITIAL STATE ---------- */
const emptyForm: ScheduleItem = {
  schedule_id: "",
  class_id: "",
  day: "",
  start_time: "",
  end_time: "",
  room: "",
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ScheduleItem>(emptyForm);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  /* ---------- LOAD DATA ---------- */
  const loadAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [scheduleData, classData] = await Promise.all([
        api.getSchedules(),
        api.getClasses(),
      ]);

      setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
      setClasses(Array.isArray(classData) ? classData : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load schedules");
      setSchedules([]);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FORM HANDLERS ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(false);
  };

  const submitForm = async () => {
    if (!form.schedule_id || !form.class_id) {
      alert("Schedule ID and Class are required");
      return;
    }

    try {
      if (editing) {
        await api.editSchedule(form.schedule_id, form);
      } else {
        await api.addSchedule(form);
      }

      resetForm();
      loadAll();
    } catch (err) {
      alert("Operation failed");
    }
  };

  const startEdit = (item: ScheduleItem) => {
    setForm(item);
    setEditing(true);
  };

  const deleteSchedule = async (schedule_id: string) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await api.deleteSchedule(schedule_id);
      loadAll();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <h3>Loading schedules...</h3>;

  return (
    <div>
      <h1>Schedule</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ---------- ADD / EDIT FORM ---------- */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3>{editing ? "Edit Schedule" : "Add Schedule"}</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
          <input
            name="schedule_id"
            placeholder="Schedule ID"
            value={form.schedule_id}
            onChange={handleChange}
            disabled={editing}
          />

          <select
            name="class_id"
            value={form.class_id}
            onChange={handleChange}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.class_id} value={c.class_id}>
                {c.class_id}
              </option>
            ))}
          </select>

          <input
            name="day"
            placeholder="Day (e.g. Monday)"
            value={form.day}
            onChange={handleChange}
          />

          <input
            name="room"
            placeholder="Room"
            value={form.room}
            onChange={handleChange}
          />

          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
          />

          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button onClick={submitForm}>
            {editing ? "Update Schedule" : "Add Schedule"}
          </button>

          {editing && (
            <button onClick={resetForm} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      {schedules.length === 0 ? (
        <p>No schedules found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Schedule ID</th>
              <th>Class</th>
              <th>Day</th>
              <th>Time</th>
              <th>Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.schedule_id}>
                <td>{s.schedule_id}</td>
                <td>{s.class_id}</td>
                <td>{s.day}</td>
                <td>
                  {s.start_time} – {s.end_time}
                </td>
                <td>{s.room}</td>
                <td>
                  <button onClick={() => startEdit(s)}>Edit</button>
                  <button
                    onClick={() => deleteSchedule(s.schedule_id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
