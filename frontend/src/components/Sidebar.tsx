import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">Dashboard</Link>
      <Link to="/students">Students</Link>
      <Link to="/classes">Classes</Link>
      <Link to="/schedule">Schedule</Link>
      <Link to="/attendance">Attendance</Link>
    </div>
  );
}
