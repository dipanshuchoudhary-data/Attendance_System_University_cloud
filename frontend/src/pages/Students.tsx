import { useEffect, useState } from "react";
import { Student } from "../types";
import { getStudents } from "../api/api";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  return (
    <div>
      <h1>Students</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>Enrollment</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
