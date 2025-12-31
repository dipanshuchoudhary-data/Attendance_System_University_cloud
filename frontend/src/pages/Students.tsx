import { useEffect, useState } from "react";
import { Student } from "../types";
import { api } from "../api/api";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load students from backend
  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await api.getStudents();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  // Delete student (admin action)
  const deleteStudent = async (student_id: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete student ${student_id}?`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/admin/student/${student_id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Failed to delete student");
        return;
      }

      // Update UI instantly
      setStudents((prev) =>
        prev.filter((s) => s.student_id !== student_id)
      );
    } catch (err) {
      console.error(err);
      alert("Server error while deleting student");
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Students</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Enrollment</th>
            <th>Name</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={4}>No students found</td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.student_id}>
                <td>{s.student_id}</td>
                <td>{s.name}</td>
                <td>{s.course}</td>
                <td>
                  <button
                    onClick={() => deleteStudent(s.student_id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
