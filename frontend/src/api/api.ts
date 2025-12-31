const BASE_URL = "http://127.0.0.1:8000";

/**
 * Admin-authenticated headers
 * Token is stored in localStorage after admin login
 */
const adminHeaders = () => ({
  "Content-Type": "application/json",
  "X-Admin-Token": localStorage.getItem("admin_token") || ""
});

export const api = {
  /* ---------------- STUDENTS ---------------- */

  getStudents: async () => {
    const res = await fetch(`${BASE_URL}/students`, {
      headers: adminHeaders()
    });
    return res.json();
  },

  deleteStudent: async (student_id: string) => {
    const res = await fetch(
      `${BASE_URL}/admin/student/${student_id}`,
      {
        method: "DELETE",
        headers: adminHeaders()
      }
    );
    return res.json();
  },

  /* ---------------- CLASSES ---------------- */

  getClasses: async () => {
    const res = await fetch(`${BASE_URL}/admin/classes`, {
      headers: adminHeaders()
    });
    return res.json();
  },

  addClass: async (payload: any) => {
    const res = await fetch(`${BASE_URL}/admin/classes`, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  editClass: async (class_id: string, payload: any) => {
    const res = await fetch(
      `${BASE_URL}/admin/classes/${class_id}`,
      {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify(payload)
      }
    );
    return res.json();
  },

  deleteClass: async (class_id: string) => {
    const res = await fetch(
      `${BASE_URL}/admin/classes/${class_id}`,
      {
        method: "DELETE",
        headers: adminHeaders()
      }
    );
    return res.json();
  },

  /* ---------------- SCHEDULES ---------------- */

  getSchedules: async () => {
    const res = await fetch(`${BASE_URL}/admin/schedules`, {
      headers: adminHeaders()
    });
    return res.json();
  },

  addSchedule: async (payload: any) => {
    const res = await fetch(`${BASE_URL}/admin/schedules`, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  editSchedule: async (schedule_id: string, payload: any) => {
    const res = await fetch(
      `${BASE_URL}/admin/schedules/${schedule_id}`,
      {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify(payload)
      }
    );
    return res.json();
  },

  deleteSchedule: async (schedule_id: string) => {
    const res = await fetch(
      `${BASE_URL}/admin/schedules/${schedule_id}`,
      {
        method: "DELETE",
        headers: adminHeaders()
      }
    );
    return res.json();
  },

  /* ---------------- ATTENDANCE ---------------- */

  getAttendance: async () => {
    const res = await fetch(`${BASE_URL}/attendance`, {
      headers: adminHeaders()
    });
    return res.json();
  }
};
