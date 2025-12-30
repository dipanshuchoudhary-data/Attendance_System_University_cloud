

/* ---------- STUDENT ---------- */
export interface Student {
  student_id: string;       
  name: string;             
  embedding?: number[];     
}

/* ---------- CLASS / SUBJECT ---------- */
export interface Class {
  class_id: string;         
  subject_code: string;     
  subject_name: string;     
  professor_name: string;  
  professor_id: string;    
  group: string;            
}

/* ---------- SCHEDULE (TIMETABLE SLOT) ---------- */
export interface Schedule {
  schedule_id?: string;   
  class_id: string;        
  day: DayOfWeek;         
  start_time: string;       
  end_time: string;         
  room: string;             
}

/* ---------- SESSION (LIVE CLASS INSTANCE) ---------- */
export interface Session {
  session_id: string;       // UUID / Firestore id
  class_id: string;         // Which class
  schedule_id: string;      // Which timetable slot
  room: string;             // Room at runtime
  start_time: string;       // ISO timestamp
  end_time?: string;        // ISO timestamp (null until finished)
}

/* ---------- ATTENDANCE RECORD ---------- */
export interface Attendance {
  attendance_id?: string;
  student_id: string;
  session_id: string;
  class_id: string;
  presence_duration: number; // seconds
  status: AttendanceStatus; 
}



export type AttendanceStatus = "Present" | "Absent" | "Late";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";



export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}



export interface AttendanceStats {
  total_students: number;
  present: number;
  absent: number;
  late: number;
  attendance_percentage: number;
}
