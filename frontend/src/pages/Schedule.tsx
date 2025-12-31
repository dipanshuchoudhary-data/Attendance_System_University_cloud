import { useEffect, useState } from "react";
import { api } from "../api/api";

interface ScheduleItem {
  schedule_id: string;
  class_id: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [newSchedule, setNewSchedule] = useState({
    schedule_id: "",
    class_id: "",
    day: "",
    start_time: "",
    end_time: "",
    room: ""
  });

  // Load schedules
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await api.getSchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Add schedule
  const addSchedule = async () => {
    if (!newSchedule.schedule_id || !newSchedule.class_id) {
      alert("Schedule ID and Class ID are required");
      return;
    }

    await fetch("http://127.0.0.1:8000/admin/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSchedule)
    });

    setNewSchedule({
      schedule_id: "",
      class_id: "",
      day: "",
      start_time: "",
      end_time: "",
      room: ""
    });

    loadSchedules();
  };

  // Edit schedule
  const editSchedule = async (schedule_id: string) => {
    const room = prompt("Enter new room");
    if (!room) return;

    await fetch(`http://127.0.0.1:8000/admin/schedules/${schedule_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room })
    });

    setSchedules(prev =>
      prev.map(s =>
        s.schedule_id === schedule_id ? { ...s, room } : s
      )
    );
  };

  // Delete schedule
  const deleteSchedule = async (schedule_id: string) => {
    if (!window.confirm("Delete this schedule?")) return;

    await fetch(`http://127.0.0.1:8000/admin/schedules/${schedule_id}`, {
      method: "DELETE"
    });

    setSchedules(prev => prev.filter(s => s.schedule_id !== schedule_id));
  };

  if (loading) return <p>Loading schedules...</p>;

  return (
    <div>
      <h1>Schedule</h1>

      <h3>Add Schedule</h3>
      <input
        placeholder="Schedule ID"
        value={newSchedule.schedule_id}
        onChange={e =>
          setNewSchedule({ ...newSchedule, schedule_id: e.target.value })
        }
      />
      <input
        placeholder="Class ID"
        value={newSchedule.class_id}
        onChange={e =>
          setNewSchedule({ ...newSchedule, class_id: e.target.value })
        }
      />
      <input
        placeholder="Day"
        value={newSchedule.day}
        onChange={e => setNewSchedule({ ...newSchedule, day: e.target.value })}
      />
      <input
        placeholder="Start Time"
        value={newSchedule.start_time}
        onChange={e =>
          setNewSchedule({ ...newSchedule, start_time: e.target.value })
        }
      />
      <input
        placeholder="End Time"
        value={newSchedule.end_time}
        onChange={e =>
          setNewSchedule({ ...newSchedule, end_time: e.target.value })
        }
      />
      <input
        placeholder="Room"
        value={newSchedule.room}
        onChange={e => setNewSchedule({ ...newSchedule, room: e.target.value })}
      />
      <button onClick={addSchedule}>Add Schedule</button>

      <table className="data-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Day</th>
            <th>Time</th>
            <th>Room</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={5}>No schedules found</td>
            </tr>
          ) : (
            schedules.map(s => (
              <tr key={s.schedule_id}>
                <td>{s.class_id}</td>
                <td>{s.day}</td>
                <td>
                  {s.start_time} – {s.end_time}
                </td>
                <td>{s.room}</td>
                <td>
                  <button onClick={() => editSchedule(s.schedule_id)}>
                    Edit
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteSchedule(s.schedule_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
