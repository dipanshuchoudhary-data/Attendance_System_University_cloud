import time
from app.config import ATTENDANCE_THRESHOLD_SECONDS
from app.firebase_service import mark_attendance

presence_tracker = {}
attendance_marked = set()


def update_presence(student_id: str):
    current_time = time.time()

    if student_id not in presence_tracker:
        presence_tracker[student_id] = current_time
        return False

    duration = int(current_time - presence_tracker[student_id])

    if duration >= ATTENDANCE_THRESHOLD_SECONDS and student_id not in attendance_marked:
        mark_attendance(student_id, duration)
        attendance_marked.add(student_id)
        return True

    return False
