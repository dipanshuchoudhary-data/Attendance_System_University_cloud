import { useEffect, useState } from "react";
import { api } from "../api/api";

interface ClassItem {
  class_id: string;
  subject_name: string;
  subject_code?: string;
  professor_name?: string;
  group?: string;
}

export default function Classes() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [newClass, setNewClass] = useState({
    class_id: "",
    subject_name: "",
    professor_name: "",
    group: ""
  });

  // Load classes
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await api.getClasses();
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Add class
  const addClass = async () => {
    if (!newClass.class_id || !newClass.subject_name) {
      alert("Class ID and Subject Name are required");
      return;
    }

    await fetch("http://127.0.0.1:8000/admin/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClass)
    });

    setNewClass({
      class_id: "",
      subject_name: "",
      professor_name: "",
      group: ""
    });

    loadClasses();
  };

  // Edit class
  const editClass = async (class_id: string) => {
    const subject_name = prompt("Enter new subject name");
    if (!subject_name) return;

    await fetch(`http://127.0.0.1:8000/admin/classes/${class_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_name })
    });

    setClasses(prev =>
      prev.map(c =>
        c.class_id === class_id ? { ...c, subject_name } : c
      )
    );
  };

  // Delete class
  const deleteClass = async (class_id: string) => {
    if (!window.confirm("Delete this class?")) return;

    await fetch(`http://127.0.0.1:8000/admin/classes/${class_id}`, {
      method: "DELETE"
    });

    setClasses(prev => prev.filter(c => c.class_id !== class_id));
  };

  if (loading) return <p>Loading classes...</p>;

  return (
    <div>
      <h1>Classes</h1>

      <h3>Add Class</h3>
      <input
        placeholder="Class ID"
        value={newClass.class_id}
        onChange={e => setNewClass({ ...newClass, class_id: e.target.value })}
      />
      <input
        placeholder="Subject Name"
        value={newClass.subject_name}
        onChange={e => setNewClass({ ...newClass, subject_name: e.target.value })}
      />
      <input
        placeholder="Professor Name"
        value={newClass.professor_name}
        onChange={e =>
          setNewClass({ ...newClass, professor_name: e.target.value })
        }
      />
      <input
        placeholder="Group"
        value={newClass.group}
        onChange={e => setNewClass({ ...newClass, group: e.target.value })}
      />
      <button onClick={addClass}>Add Class</button>

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
          {classes.length === 0 ? (
            <tr>
              <td colSpan={5}>No classes found</td>
            </tr>
          ) : (
            classes.map(c => (
              <tr key={c.class_id}>
                <td>{c.class_id}</td>
                <td>{c.subject_name}</td>
                <td>{c.professor_name}</td>
                <td>{c.group}</td>
                <td>
                  <button onClick={() => editClass(c.class_id)}>Edit</button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteClass(c.class_id)}
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
