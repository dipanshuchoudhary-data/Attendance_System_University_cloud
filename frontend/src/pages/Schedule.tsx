import { useState } from "react";
import { createSchedule } from "../api/api";
import { Schedule } from "../types";

export default function SchedulePage() {
  const [form, setForm] = useState<Schedule>({
    class_id: "",
    day: "Monday",
    start_time: "",
    end_time: "",
    room: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await createSchedule(form);
    alert("Schedule added");
  };

  return (
    <div>
      <h1>Schedule</h1>

      <div className="form-grid">
        <input name="class_id" placeholder="Class ID" onChange={handleChange} />
        <select name="day" onChange={handleChange}>
          {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <input name="start_time" placeholder="Start Time (14:15)" onChange={handleChange} />
        <input name="end_time" placeholder="End Time (15:10)" onChange={handleChange} />
        <input name="room" placeholder="Room (I1-308)" onChange={handleChange} />
        <button onClick={submit}>Add Schedule</button>
      </div>
    </div>
  );
}
