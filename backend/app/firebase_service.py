import os
from typing import List, Optional, Dict
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, firestore


# ---------------- FIREBASE INIT ----------------

if not firebase_admin._apps:
    SERVICE_ACCOUNT_PATH = os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS",
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "firebase",
            "serviceAccountKey.json"
        )
    )

    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()


# ---------------- STUDENTS ----------------

def save_student(student_id: str, name: str, course: str, embedding: List[float]):
    db.collection("students").document(student_id).set({
        "student_id": student_id,
        "name": name,
        "course": course,
        "embedding": embedding,
        "created_at": firestore.SERVER_TIMESTAMP
    })


def get_all_students():
    docs = db.collection("students").stream()
    return [d.to_dict() for d in docs]


def delete_student_by_id(student_id: str):
    db.collection("students").document(student_id).delete()


def find_student_by_embedding(face_embedding: List[float]) -> Optional[str]:
    """
    Returns student_id if face matches an enrolled student
    """
    docs = db.collection("students").stream()

    for doc in docs:
        data = doc.to_dict()
        stored_embedding = data.get("embedding")

        if not stored_embedding:
            continue

        similarity = cosine_similarity(face_embedding, stored_embedding)

        if similarity >= 0.85:
            return data["student_id"]

    return None


# ---------------- FACE UTILS ----------------

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    import numpy as np

    a = np.array(v1)
    b = np.array(v2)

    if a.shape != b.shape:
        return 0.0

    dot = float(a @ b)
    norm = float((a @ a) ** 0.5 * (b @ b) ** 0.5)

    return dot / norm if norm != 0 else 0.0


# ---------------- CLASSES ----------------

def add_class(class_id: str, payload: Dict):
    db.collection("classes").document(class_id).set(payload)


def get_all_classes():
    docs = db.collection("classes").stream()
    return [d.to_dict() for d in docs]


def update_class(class_id: str, payload: Dict):
    db.collection("classes").document(class_id).update(payload)


def delete_class(class_id: str):
    db.collection("classes").document(class_id).delete()


# ---------------- SCHEDULES ----------------

def add_schedule(schedule_id: str, payload: Dict):
    db.collection("schedules").document(schedule_id).set(payload)


def get_all_schedules():
    docs = db.collection("schedules").stream()
    return [d.to_dict() for d in docs]


def update_schedule(schedule_id: str, payload: Dict):
    db.collection("schedules").document(schedule_id).update(payload)


def delete_schedule(schedule_id: str):
    db.collection("schedules").document(schedule_id).delete()


# ---------------- ATTENDANCE ----------------

def save_attendance_record(class_id: str, student_id: str, timestamp: str):
    """
    Persists attendance immediately when marked
    """
    today = datetime.utcnow().strftime("%Y-%m-%d")

    ref = db.collection("attendance").document(f"{class_id}_{today}")

    doc = ref.get()

    if not doc.exists:
        ref.set({
            "class_id": class_id,
            "date": today,
            "present": [student_id],
            "absent": [],
            "created_at": firestore.SERVER_TIMESTAMP
        })
        return

    data = doc.to_dict()

    present = set(data.get("present", []))
    absent = set(data.get("absent", []))

    present.add(student_id)
    absent.discard(student_id)

    ref.update({
        "present": list(present),
        "absent": list(absent),
        "updated_at": firestore.SERVER_TIMESTAMP
    })


def get_all_attendance():
    docs = db.collection("attendance").stream()
    return [d.to_dict() for d in docs]


def get_students_by_class(class_id: str):
    """
    Return all students enrolled in a given class
    Used to compute ABSENT students at end of class
    """

    docs = (
        db.collection("students")
        .where("class_id", "==", class_id)
        .stream()
    )

    students = []

    for doc in docs:
        data = doc.to_dict()
        students.append({
            "student_id": doc.id,
            "name": data.get("name"),
            "course": data.get("course"),
        })

    return students

def get_all_attendance_records():
    """
    Fetch all attendance records from Firestore
    """
    docs = db.collection("attendance").stream()
    records = []

    for d in docs:
        data = d.to_dict()
        if data:
            records.append(data)

    return records


