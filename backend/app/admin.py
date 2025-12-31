from fastapi import APIRouter, HTTPException
from app.firebase_service import db, delete_student_by_id

router = APIRouter(prefix="/admin", tags=["Admin"])

# ---------------- STUDENTS ----------------

@router.delete("/student/{student_id}")
def delete_student(student_id: str):
    deleted = delete_student_by_id(student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"status": "success", "student_id": student_id}

# ---------------- CLASSES ----------------

@router.get("/classes")
def get_classes():
    docs = db.collection("classes").stream()
    return [{**d.to_dict(), "class_id": d.id} for d in docs]

@router.post("/classes")
def add_class(payload: dict):
    class_id = payload.get("class_id")
    if not class_id:
        raise HTTPException(status_code=400, detail="class_id required")

    db.collection("classes").document(class_id).set(payload)
    return {"status": "class added"}

@router.delete("/classes/{class_id}")
def delete_class(class_id: str):
    ref = db.collection("classes").document(class_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Class not found")
    ref.delete()
    return {"status": "class deleted"}

# ---------------- SCHEDULES ----------------

@router.get("/schedules")
def get_schedules():
    docs = db.collection("schedules").stream()
    return [{**d.to_dict(), "schedule_id": d.id} for d in docs]

@router.post("/schedules")
def add_schedule(payload: dict):
    schedule_id = payload.get("schedule_id")
    if not schedule_id:
        raise HTTPException(status_code=400, detail="schedule_id required")

    db.collection("schedules").document(schedule_id).set(payload)
    return {"status": "schedule added"}

@router.delete("/schedules/{schedule_id}")
def delete_schedule(schedule_id: str):
    ref = db.collection("schedules").document(schedule_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Schedule not found")
    ref.delete()
    return {"status": "schedule deleted"}

from fastapi import APIRouter, HTTPException
from app.firebase_service import db, delete_student_by_id

router = APIRouter(prefix="/admin", tags=["Admin"])

# ---------------- STUDENTS ----------------

@router.delete("/student/{student_id}")
def delete_student(student_id: str):
    deleted = delete_student_by_id(student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"status": "success", "student_id": student_id}

# ---------------- CLASSES ----------------

@router.get("/classes")
def get_classes():
    docs = db.collection("classes").stream()
    return [{**d.to_dict(), "class_id": d.id} for d in docs]

@router.post("/classes")
def add_class(payload: dict):
    class_id = payload.get("class_id")
    if not class_id:
        raise HTTPException(status_code=400, detail="class_id required")

    db.collection("classes").document(class_id).set(payload)
    return {"status": "class added"}

@router.delete("/classes/{class_id}")
def delete_class(class_id: str):
    ref = db.collection("classes").document(class_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Class not found")
    ref.delete()
    return {"status": "class deleted"}

# ---------------- SCHEDULES ----------------

@router.get("/schedules")
def get_schedules():
    docs = db.collection("schedules").stream()
    return [{**d.to_dict(), "schedule_id": d.id} for d in docs]

@router.post("/schedules")
def add_schedule(payload: dict):
    schedule_id = payload.get("schedule_id")
    if not schedule_id:
        raise HTTPException(status_code=400, detail="schedule_id required")

    db.collection("schedules").document(schedule_id).set(payload)
    return {"status": "schedule added"}

@router.delete("/schedules/{schedule_id}")
def delete_schedule(schedule_id: str):
    ref = db.collection("schedules").document(schedule_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Schedule not found")
    ref.delete()
    return {"status": "schedule deleted"}

@router.put("/schedules/{schedule_id}")
def edit_schedule(schedule_id: str, payload: dict):
    ref = db.collection("schedules").document(schedule_id)

    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Schedule not found")

    ref.update(payload)
    return {"status": "schedule updated", "schedule_id": schedule_id}
