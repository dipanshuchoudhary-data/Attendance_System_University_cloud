import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

/* ---------- TYPES ---------- */
interface AttendanceRecord {
  class_id: string;
  date: string;
  present: string[];
  absent: string[];
}

interface ClassItem {
  class_id: string;
  subject_code: string;
  subject_name?: string;
  group: string; // course / batch
}

interface ScheduleItem {
  class_id: string;
  room: string;
}

/* ---------- COMPONENT ---------- */
export default function Attendance() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  /* ---------- FILTER STATE ---------- */
  const [course, setCourse] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");

  const [results, setResults] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [classData, scheduleData, attendanceData] = await Promise.all([
          api.getClasses(),
          api.getSchedules(),
          api.getAttendance(),
        ]);

        setClasses(Array.isArray(classData) ? classData : []);
        setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
        setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
      } catch (err) {
        console.error("Attendance load failed", err);
        setClasses([]);
        setSchedules([]);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  /* ---------- DYNAMIC DROPDOWN OPTIONS ---------- */

  // 1️⃣ Courses (groups) — derived from classes
  const courses = useMemo(() => {
    return Array.from(
      new Set(classes.map(c => c.group).filter(Boolean))
    );
  }, [classes]);

  // 2️⃣ Subject codes — filtered by course (optional)
  const subjectCodes = useMemo(() => {
    return Array.from(
      new Set(
        classes
          .filter(c => !course || c.group === course)
          .map(c => c.subject_code)
          .filter(Boolean)
      )
    );
  }, [classes, course]);

  // 3️⃣ Rooms — derived from schedules + class filters
  const rooms = useMemo(() => {
    return Array.from(
      new Set(
        schedules
          .filter(s =>
            classes.some(
              c =>
                c.class_id === s.class_id &&
                (!course || c.group === course) &&
                (!subjectCode || c.subject_code === subjectCode)
            )
          )
          .map(s => s.room)
          .filter(Boolean)
      )
    );
  }, [schedules, classes, course, subjectCode]);

  /* ---------- APPLY FILTER ---------- */
  const applyFilter = () => {
    if (!course || !subjectCode || !room || !date) {
      alert("Please select Course, Subject Code, Class Location and Date");
      return;
    }

    const validClassIds = schedules
      .filter(s => s.room === room)
      .map(s => s.class_id)
      .filter(classId =>
        classes.some(
          c =>
            c.class_id === classId &&
            c.group === course &&
            c.subject_code === subjectCode
        )
      );

    const filtered = attendance.filter(
      a => validClassIds.includes(a.class_id) && a.date === date
    );

    setResults(filtered);
  };

  if (loading) {
    return <h3>Loading attendance...</h3>;
  }

  return (
    <div>
      <h1>Attendance</h1>

      {/* ---------- FILTER BAR ---------- */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        {/* COURSE */}
        <select value={course} onChange={e => setCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* SUBJECT CODE */}
        <select
          value={subjectCode}
          onChange={e => setSubjectCode(e.target.value)}
        >
          <option value="">Select Subject Code</option>
          {subjectCodes.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* CLASS LOCATION */}
        <select value={room} onChange={e => setRoom(e.target.value)}>
          <option value="">Select Class Location</option>
          {rooms.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />

        <button onClick={applyFilter}>Apply</button>
      </div>

      {/* ---------- RESULTS ---------- */}
      {results.length === 0 ? (
        <p>No attendance found for selected filters.</p>
      ) : (
        results.map((rec, idx) => (
          <div key={idx} style={{ marginBottom: "24px" }}>
            <h3>
              Class: {rec.class_id} | Date: {rec.date}
            </h3>

            <div style={{ display: "flex", gap: "40px" }}>
              <div>
                <h4 style={{ color: "green" }}>
                  Present ({rec.present.length})
                </h4>
                <ul>
                  {rec.present.map(s => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ color: "red" }}>
                  Absent ({rec.absent.length})
                </h4>
                <ul>
                  {rec.absent.map(s => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
