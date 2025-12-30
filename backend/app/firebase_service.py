import firebase_admin
from firebase_admin import firestore

if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()


# ---------- CLASS MANAGEMENT ----------

def create_class(class_id, data):
    db.collection("classes").document(class_id).set(data)


def update_class(class_id, data):
    db.collection("classes").document(class_id).update(data)


def delete_class(class_id):
    db.collection("classes").document(class_id).delete()


# ---------- SCHEDULE MANAGEMENT ----------

def create_schedule(data):
    return db.collection("schedules").add(data)[1].id


def update_schedule(schedule_id, data):
    db.collection("schedules").document(schedule_id).update(data)


def delete_schedule(schedule_id):
    db.collection("schedules").document(schedule_id).delete()


# ---------- SESSION MANAGEMENT ----------

def create_session(data):
    return db.collection("sessions").add(data)[1].id


def end_session(session_id):
    db.collection("sessions").document(session_id).update({
        "end_time": firestore.SERVER_TIMESTAMP
    })
