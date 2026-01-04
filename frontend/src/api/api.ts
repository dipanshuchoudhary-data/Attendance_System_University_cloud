/* =========================================================
   API CONFIG
========================================================= */

const BASE_URL = "http://127.0.0.1:8000";

/* =========================================================
   HEADERS
========================================================= */

function adminHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-admin-token":
      localStorage.getItem("admin_token") ?? "JUDGES_ONLY_SECRET",
  };
}

/* =========================================================
   SAFE FETCH WRAPPER
========================================================= */

async function safeFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    let detail = "Unknown error";
    try {
      const data = await response.json();
      detail = data?.detail ?? JSON.stringify(data);
    } catch {
      detail = await response.text();
    }
    throw new Error(`API ${response.status}: ${detail}`);
  }

  return response.json();
}

/* =========================================================
   API EXPORT
========================================================= */

export const api = {
  /* ================= STUDENTS ================= */

  getStudents: async () => {
    return safeFetch(`${BASE_URL}/students`);
  },

  deleteStudent: async (student_id: string) => {
    return safeFetch(`${BASE_URL}/admin/student/${student_id}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
  },

  /* ================= CLASSES ================= */

  getClasses: async () => {
    return safeFetch(`${BASE_URL}/admin/classes`, {
      headers: adminHeaders(),
    });
  },

  addClass: async (payload: any) => {
    return safeFetch(`${BASE_URL}/admin/classes`, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
  },

  editClass: async (class_id: string, payload: any) => {
    return safeFetch(`${BASE_URL}/admin/classes/${class_id}`, {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
  },

  deleteClass: async (class_id: string) => {
    return safeFetch(`${BASE_URL}/admin/classes/${class_id}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
  },

  /* ================= SCHEDULES ================= */

  getSchedules: async () => {
    return safeFetch(`${BASE_URL}/admin/schedules`, {
      headers: adminHeaders(),
    });
  },

  addSchedule: async (payload: any) => {
    return safeFetch(`${BASE_URL}/admin/schedules`, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
  },

  editSchedule: async (schedule_id: string, payload: any) => {
    return safeFetch(`${BASE_URL}/admin/schedules/${schedule_id}`, {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify(payload),
    });
  },

  deleteSchedule: async (schedule_id: string) => {
    return safeFetch(`${BASE_URL}/admin/schedules/${schedule_id}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
  },

  /* ================= ATTENDANCE ================= */

  getAttendance: async () => {
    return safeFetch(`${BASE_URL}/attendance`);
  },

  /* ================= CAMERA CONTROL ================= */

  startCamera: async (class_id: string, threshold_seconds: number) => {
    return safeFetch(
      `${BASE_URL}/admin/camera/start?class_id=${encodeURIComponent(
        class_id
      )}&threshold_seconds=${threshold_seconds}`,
      {
        method: "POST",
        headers: adminHeaders(),
      }
    );
  },

  stopCamera: async (class_id: string) => {
    return safeFetch(
      `${BASE_URL}/admin/camera/stop?class_id=${encodeURIComponent(class_id)}`,
      {
        method: "POST",
        headers: adminHeaders(),
      }
    );
  },

  sendFrame: async (class_id: string, image_base64: string) => {
    return safeFetch(`${BASE_URL}/admin/camera/frame`, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify({
        class_id,
        image_base64,
      }),
    });
  },
};
