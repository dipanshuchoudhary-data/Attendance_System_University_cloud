import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { api } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    attendance: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const students = await api.getStudents();
        const attendance = await api.getAttendance();

        setStats({
          students: students?.length || 0,
          attendance: attendance?.length || 0,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    load();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <StatCard title="Total Students" value={stats.students} />
        <StatCard title="Attendance Records" value={stats.attendance} />
      </div>
    </div>
  );
}
