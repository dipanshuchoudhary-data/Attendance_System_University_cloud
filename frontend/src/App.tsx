import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import AdminGuard from "./auth/AdminGuard";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Schedule from "./pages/Schedule";
import Attendance from "./pages/Attendance";
import StudentEnroll from "./pages/StudentEnroll.tsx";
import TakeAttendance from "./pages/Takeattendance";

export default function App() {
  return (
    <AuthProvider>
      <div className="layout">
        <Sidebar />

        <div className="content">
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <AdminGuard>
                  <Dashboard />
                </AdminGuard>
              }
            />

            <Route
              path="/students"
              element={
                <AdminGuard>
                  <Students />
                </AdminGuard>
              }
            />

            <Route
              path="/classes"
              element={
                <AdminGuard>
                  <Classes />
                </AdminGuard>
              }
            />

            <Route
              path="/schedule"
              element={
                <AdminGuard>
                  <Schedule />
                </AdminGuard>
              }
            />

            <Route
              path="/attendance"
              element={
                <AdminGuard>
                  <Attendance />
                </AdminGuard>
              }
            />
            <Route
              path="/take-attendance"
              element={
                <AdminGuard>
                  <TakeAttendance />
                </AdminGuard>
              }
            />
            <Route path="/student-enroll" element={<StudentEnroll />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
