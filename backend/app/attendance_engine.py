import time
import uuid
from app.firebase_service import get_all_students, mark_attendance
from app.face_engine import cosine_similarity
from config import ATTENDANCE_THRESHOLD_SECONDS, EMBEDDING_MATCH_THRESHOLD

presence = {}
attendance_marked = set()
session_id = str(uuid.uuid4())


def process_embeddings(detected_embeddings):
    students = get_all_students()
    current_time = time.time()

    for emb in detected_embeddings:
        for student_id, data in students.items():
            similarity = cosine_similarity(emb, data["embedding"])

            if similarity > EMBEDDING_MATCH_THRESHOLD:
                if student_id not in presence:
                    presence[student_id] = current_time

                duration = current_time - presence[student_id]

                if duration >= ATTENDANCE_THRESHOLD_SECONDS:
                    if student_id not in attendance_marked:
                        mark_attendance(student_id, session_id, int(duration))
                        attendance_marked.add(student_id)
