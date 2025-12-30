import { useEffect, useState } from "react";
import { Class } from "../types";
import { createClass } from "../api/api";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [form, setForm] = useState<Class>({
    class_id: "",
    subject_code: "",
    subject_name: "",
    professor_name: "",
    professor_id: "",
    group: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await createClass(form);
    setClasses([...classes, form]);
    setForm({
      class_id: "",
      subject_code: "",
      subject_name: "",
      professor_name: "",
      professor_id: "",
      group: ""
    });
  };

  return (
    <div>
      <h1>Classes</h1>

      <div className="form-grid">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={handleChange}
          />
        ))}
        <button onClick={submit}>Add Class</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Class ID</th>
            <th>Subject</th>
            <th>Professor</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c, i) => (
            <tr key={i}>
              <td>{c.class_id}</td>
              <td>{c.subject_name}</td>
              <td>{c.professor_name}</td>
              <td>{c.group}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
