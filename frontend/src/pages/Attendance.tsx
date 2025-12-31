import { useEffect, useState } from "react";
import { AttendanceRecord } from "../types";
import { api } from "../api/api";

export default function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAttendance();
        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          setRecords([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading attendance...</p>;

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
          {records.length === 0 ? (
            <tr>
              <td colSpan={4}>No attendance records</td>
            </tr>
          ) : (
            records.map((r, i) => (
              <tr key={i}>
                <td>{r.student_id}</td>
                <td>{r.class_id}</td>
                <td>{r.duration}</td>
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
