from fastapi import APIRouter
from app.firebase_service import (
    create_class, update_class, delete_class,
    create_schedule, update_schedule, delete_schedule
)

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/class")
def add_class(
    class_id: str,
    subject_code: str,
    subject_name: str,
    professor_name: str,
    professor_id: str,
    group: str
):
    create_class(class_id, {
        "subject_code": subject_code,
        "subject_name": subject_name,
        "professor_name": professor_name,
        "professor_id": professor_id,
        "group": group
    })
    return {"message": "Class created"}


@router.put("/class")
def edit_class(class_id: str, professor_name: str):
    update_class(class_id, {"professor_name": professor_name})
    return {"message": "Class updated"}


@router.delete("/class")
def remove_class(class_id: str):
    delete_class(class_id)
    return {"message": "Class deleted"}


@router.post("/schedule")
def add_schedule(
    class_id: str,
    day: str,
    start_time: str,
    end_time: str,
    room: str
):
    schedule_id = create_schedule({
        "class_id": class_id,
        "day": day,
        "start_time": start_time,
        "end_time": end_time,
        "room": room
    })
    return {"schedule_id": schedule_id}


@router.put("/schedule")
def edit_schedule(schedule_id: str, room: str):
    update_schedule(schedule_id, {"room": room})
    return {"message": "Schedule updated"}


@router.delete("/schedule")
def remove_schedule(schedule_id: str):
    delete_schedule(schedule_id)
    return {"message": "Schedule deleted"}
