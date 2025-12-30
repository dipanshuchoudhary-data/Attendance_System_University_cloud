import { useEffect, useState } from "react";
import { Attendance } from "../types";
import { getAttendance } from "../api/api";

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);

  useEffect(() => {
    getAttendance().then(setRecords);
  }, []);

  return (
    <div>
      <h1>Attendance</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Class</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.student_id}</td>
              <td>{r.class_id}</td>
              <td>{r.presence_duration}s</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
