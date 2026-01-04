import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ---------- BRAND ---------- */}
      <div className="sidebar-header">
        <h2>Smart Attendance</h2>
        <p>Admin Panel</p>
      </div>

      {/* ---------- NAV ---------- */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end className="nav-link">
               Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/students" className="nav-link">
               Students
            </NavLink>
          </li>

          <li>
            <NavLink to="/classes" className="nav-link">
               Classes
            </NavLink>
          </li>

          <li>
            <NavLink to="/schedule" className="nav-link">
               Schedule
            </NavLink>
          </li>

          <li>
            <NavLink to="/take-attendance" className="nav-link highlight">
               Take Attendance
            </NavLink>
          </li>

          <li>
            <NavLink to="/attendance" className="nav-link">
               Attendance Records
            </NavLink>
          </li>

          <li>
            <NavLink to="/student-enroll" className="nav-link">
               Student Enrollment
            </NavLink>
          </li>
        </ul>
      </nav>

    </aside>
  );
}
