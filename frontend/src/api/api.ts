const BASE_URL = "http://127.0.0.1:8000";

/* ---------- HEALTH ---------- */
export async function getHealth() {
  const res = await fetch(`${BASE_URL}/`);
  return res.json();
}

/* ---------- CLASSES ---------- */
export async function createClass(data: any) {
  const params = new URLSearchParams(data).toString();
  const res = await fetch(`${BASE_URL}/admin/class?${params}`, {
    method: "POST"
  });
  return res.json();
}

export async function getClasses() {
  const res = await fetch(`${BASE_URL}/admin/classes`);
  return res.json();
}

/* ---------- SCHEDULE ---------- */
export async function createSchedule(data: any) {
  const params = new URLSearchParams(data).toString();
  const res = await fetch(`${BASE_URL}/admin/schedule?${params}`, {
    method: "POST"
  });
  return res.json();
}

/* ---------- STUDENTS ---------- */
export async function getStudents() {
  const res = await fetch(`${BASE_URL}/students`);
  return res.json();
}

/* ---------- ATTENDANCE ---------- */
export async function getAttendance() {
  const res = await fetch(`${BASE_URL}/attendance`);
  return res.json();
}
