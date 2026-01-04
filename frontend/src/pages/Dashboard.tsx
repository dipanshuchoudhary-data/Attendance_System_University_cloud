import { useEffect, useState } from "react";
import { api } from "../api/api";

interface ClassItem {
  class_id: string;
  subject_code?: string;
  subject_name?: string;
  professor_name?: string;
  group?: string;
}

interface AttendanceRecord {
  class_id: string;
  date: string;
  present?: string[];
  absent?: string[];
}

export default function Dashboard() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [students, classData, attendanceData] = await Promise.all([
        api.getStudents(),
        api.getClasses(),
        api.getAttendance(),
      ]);

      setStudentsCount(Array.isArray(students) ? students.length : 0);
      setClasses(Array.isArray(classData) ? classData : []);
      setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (err) {
      console.error("Dashboard load failed", err);
      setError("Failed to load dashboard data");
      setStudentsCount(0);
      setClasses([]);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const totalAttendanceRecords = attendance.length;

  const recentAttendance = attendance.slice(-5).reverse();

  if (loading) return <h3>Loading dashboard...</h3>;

  return (
    <div>
      <h1>University Smart Attendance</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ---------- SUMMARY CARDS ---------- */}
      <div style={{ display: "flex", gap: "24px", marginTop: "20px" }}>
        <div className="card">
          <h3>Total Students</h3>
          <p>{studentsCount}</p>
        </div>

        <div className="card">
          <h3>Total Classes</h3>
          <p>{classes.length}</p>
        </div>

        <div className="card">
          <h3>Attendance Records</h3>
          <p>{totalAttendanceRecords}</p>
        </div>
      </div>

      {/* ---------- CLASSES OVERVIEW ---------- */}
      <div style={{ marginTop: "32px" }}>
        <h2>Classes</h2>

        {classes.length === 0 ? (
          <p>No classes available</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Class ID</th>
                <th>Subject</th>
                <th>Professor</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.class_id}>
                  <td>{c.class_id}</td>
                  <td>
                    {c.subject_code}{" "}
                    {c.subject_name ? `– ${c.subject_name}` : ""}
                  </td>
                  <td>{c.professor_name || "—"}</td>
                  <td>{c.group || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------- RECENT ATTENDANCE ---------- */}
      <div style={{ marginTop: "32px" }}>
        <h2>Recent Attendance</h2>

        {recentAttendance.length === 0 ? (
          <p>No attendance records yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Date</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.class_id}</td>
                  <td>{a.date}</td>
                  <td>{a.present?.length || 0}</td>
                  <td>{a.absent?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
