import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getStudents, getClasses, getAttendance } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    attendance: 0
  });

  useEffect(() => {
    Promise.all([getStudents(), getAttendance()]).then(([s, a]) => {
      setStats({
        students: s.length,
        classes: 0,
        attendance: a.length
      });
    });
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
