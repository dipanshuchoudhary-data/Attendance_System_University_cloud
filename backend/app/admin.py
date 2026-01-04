from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import Dict
from app.camera import stop_camera_session
from app.attendance_engine import finalize_attendance, reset_class_session


from app.auth import verify_admin
from app.camera import (
    start_camera_session,
    stop_camera_session,
    process_frame
)
from app.firebase_service import (
    get_all_students,
    delete_student_by_id,
    add_class,
    get_all_classes,
    update_class,
    delete_class,
    add_schedule,
    get_all_schedules,
    update_schedule,
    delete_schedule
)

router = APIRouter(
    prefix="/admin",
    dependencies=[Depends(verify_admin)]
)

# -------------------------------------------------
# HEALTH CHECK (FOR JUDGES)
# -------------------------------------------------

@router.get("/health")
def admin_health():
    return {
        "status": "ok",
        "students": len(get_all_students()),
        "classes": len(get_all_classes()),
        "schedules": len(get_all_schedules())
    }


# -------------------------------------------------
# STUDENTS
# -------------------------------------------------

@router.get("/students")
def list_students():
    return get_all_students()


@router.delete("/student/{student_id}")
def remove_student(student_id: str):
    delete_student_by_id(student_id)
    return {"status": "deleted"}


# -------------------------------------------------
# CLASSES
# -------------------------------------------------

@router.get("/classes")
def list_classes():
    return get_all_classes()


@router.post("/classes")
def create_class(payload: Dict):
    class_id = payload.get("class_id")
    if not class_id:
        raise HTTPException(status_code=400, detail="class_id required")
    add_class(class_id, payload)
    return {"status": "created"}


@router.put("/classes/{class_id}")
def edit_class(class_id: str, payload: Dict):
    update_class(class_id, payload)
    return {"status": "updated"}


@router.delete("/classes/{class_id}")
def remove_class(class_id: str):
    delete_class(class_id)
    return {"status": "deleted"}


# -------------------------------------------------
# SCHEDULES
# -------------------------------------------------

@router.get("/schedules")
def list_schedules():
    return get_all_schedules()


@router.post("/schedules")
def create_schedule(payload: Dict):
    schedule_id = payload.get("schedule_id")
    if not schedule_id:
        raise HTTPException(status_code=400, detail="schedule_id required")
    add_schedule(schedule_id, payload)
    return {"status": "created"}


@router.put("/schedules/{schedule_id}")
def edit_schedule(schedule_id: str, payload: Dict):
    update_schedule(schedule_id, payload)
    return {"status": "updated"}


@router.delete("/schedules/{schedule_id}")
def remove_schedule(schedule_id: str):
    delete_schedule(schedule_id)
    return {"status": "deleted"}


# -------------------------------------------------
# CAMERA / ATTENDANCE CONTROL (CRITICAL)
# -------------------------------------------------

@router.post("/camera/start")
def admin_start_camera(
    class_id: str = Query(...),
    threshold_seconds: int = Query(10)
):
    """
    Admin starts attendance for a class
    """
    return start_camera_session(
        class_id=class_id,
        threshold_seconds=threshold_seconds
    )


@router.post("/camera/frame")
def admin_process_frame(
    payload: Dict = Body(...)
):
    """
    Receives frame from frontend
    """
    class_id = payload.get("class_id")
    image_base64 = payload.get("image_base64")

    if not class_id or not image_base64:
        raise HTTPException(
            status_code=422,
            detail="class_id and image_base64 required"
        )

    return process_frame(
        class_id=class_id,
        image_base64=image_base64
    )


@router.post("/camera/stop")
def admin_stop_camera(
    class_id: str = Query(...)
):
    stop_camera_session(class_id)
    result = finalize_attendance(class_id)
    reset_class_session(class_id)
    return result
