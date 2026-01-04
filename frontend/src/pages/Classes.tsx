import { useEffect, useState } from "react";
import { api } from "../api/api";

/* ---------- TYPES ---------- */
interface ClassItem {
  class_id: string;
  subject_code: string;
  subject_name: string;
  professor_name: string;
  professor_id: string;
  group: string;
}

const emptyForm: ClassItem = {
  class_id: "",
  subject_code: "",
  subject_name: "",
  professor_name: "",
  professor_id: "",
  group: "",
};

export default function Classes() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ClassItem>(emptyForm);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FORM HANDLERS ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(false);
  };

  const submitForm = async () => {
    try {
      if (!form.class_id) {
        alert("Class ID is required");
        return;
      }

      if (editing) {
        await api.editClass(form.class_id, form);
      } else {
        await api.addClass(form);
      }

      resetForm();
      loadClasses();
    } catch (err) {
      alert("Operation failed");
    }
  };

  const startEdit = (cls: ClassItem) => {
    setForm(cls);
    setEditing(true);
  };

  const deleteClass = async (class_id: string) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      await api.deleteClass(class_id);
      loadClasses();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <h3>Loading classes...</h3>;

  return (
    <div>
      <h1>Classes</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ---------- ADD / EDIT FORM ---------- */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3>{editing ? "Edit Class" : "Add Class"}</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
          <input
            name="class_id"
            placeholder="Class ID"
            value={form.class_id}
            onChange={handleChange}
            disabled={editing}
          />
          <input
            name="subject_code"
            placeholder="Subject Code"
            value={form.subject_code}
            onChange={handleChange}
          />
          <input
            name="subject_name"
            placeholder="Subject Name"
            value={form.subject_name}
            onChange={handleChange}
          />
          <input
            name="professor_name"
            placeholder="Professor Name"
            value={form.professor_name}
            onChange={handleChange}
          />
          <input
            name="professor_id"
            placeholder="Professor ID"
            value={form.professor_id}
            onChange={handleChange}
          />
          <input
            name="group"
            placeholder="Group (e.g. BCA(Eve))"
            value={form.group}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button onClick={submitForm}>
            {editing ? "Update Class" : "Add Class"}
          </button>
          {editing && (
            <button onClick={resetForm} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      {classes.length === 0 ? (
        <p>No classes found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Class ID</th>
              <th>Subject</th>
              <th>Professor</th>
              <th>Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.class_id}>
                <td>{cls.class_id}</td>
                <td>{cls.subject_code} – {cls.subject_name}</td>
                <td>{cls.professor_name} ({cls.professor_id})</td>
                <td>{cls.group}</td>
                <td>
                  <button onClick={() => startEdit(cls)}>Edit</button>
                  <button
                    onClick={() => deleteClass(cls.class_id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
