import { Routes, Route, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Schedule from "./pages/Schedule";
import Attendance from "./pages/Attendance";
import StudentEnroll from "./pages/StudentEnroll.tsx";
import Login from "./pages/adminLogin";

import AdminGuard from "./auth/AdminGuard";

function AdminLayout() {
  return (
    <AdminGuard>
      <div className="layout">
        <Sidebar />
        <div className="content">
          <Navbar />
          <Outlet /> {/* 🔴 THIS WAS MISSING */}
        </div>
      </div>
    </AdminGuard>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/student-enroll" element={<StudentEnroll />} />

      {/* Admin routes */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="classes" element={<Classes />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="attendance" element={<Attendance />} />
      </Route>
    </Routes>
  );
}
