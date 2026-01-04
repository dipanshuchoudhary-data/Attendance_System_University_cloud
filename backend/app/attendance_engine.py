from datetime import datetime
from typing import List, Dict, Set

from app.firebase_service import (
    find_student_by_embedding,
    get_students_by_class,
    save_attendance_record,
)

# ---------------- IN-MEMORY STATE ----------------

_marked_students: Dict[str, Set[str]] = {}


# ---------------- CORE MARKING ----------------

def start_class_session(class_id: str):
    """
    Initialize a fresh attendance session for a class.
    Clears previous in-memory attendance state.
    """

    global _marked_students

    if class_id not in _marked_students:
        _marked_students[class_id] = set()
    else:
        _marked_students[class_id].clear()

    return {
        "status": "session_started",
        "class_id": class_id
    }

def mark_attendance(class_id: str, face_embedding: List[float]):
    student_id = find_student_by_embedding(face_embedding)

    if not student_id:
        return {"status": "no_match"}

    if class_id not in _marked_students:
        _marked_students[class_id] = set()

    if student_id in _marked_students[class_id]:
        return {
            "status": "already_marked",
            "student_id": student_id
        }

    _marked_students[class_id].add(student_id)

    return {
        "status": "marked",
        "student_id": student_id
    }


# ---------------- FINALIZE ATTENDANCE ----------------

def finalize_attendance(class_id: str):
    """
    Writes attendance to Firestore using the EXISTING
    save_attendance_record(class_id, student_id, timestamp)
    """

    students = get_students_by_class(class_id)
    all_student_ids = [s["student_id"] for s in students]

    present = list(_marked_students.get(class_id, set()))
    absent = [sid for sid in all_student_ids if sid not in present]

    timestamp = datetime.utcnow().isoformat()

    # ✅ Save PRESENT students
    for student_id in present:
        save_attendance_record(
            class_id=class_id,
            student_id=student_id,
            timestamp=timestamp
        )

    # ✅ Save ABSENT students (important for dashboard count)
    for student_id in absent:
        save_attendance_record(
            class_id=class_id,
            student_id=student_id,
            timestamp=timestamp
        )

    return {
        "status": "saved",
        "class_id": class_id,
        "present_count": len(present),
        "absent_count": len(absent)
    }


# ---------------- SESSION RESET ----------------

def reset_class_session(class_id: str):
    _marked_students.pop(class_id, None)


# ---------------- READ ATTENDANCE ----------------

def get_attendance():
    from app.firebase_service import get_all_attendance_records
    return get_all_attendance_records()


def get_all_attendance():
    from app.firebase_service import get_all_attendance_records
    return get_all_attendance_records()
