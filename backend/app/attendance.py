from fastapi import APIRouter, Depends
from app.attendance_engine import mark_attendance, get_attendance,get_all_attendance

from app.auth import verify_admin
import base64
import cv2
import numpy as np
from fastapi import APIRouter, HTTPException, Depends
from app.face_engine import extract_face_embedding
from app.attendance_engine import mark_attendance

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
    dependencies=[Depends(verify_admin)]
)

@router.get("")
def list_attendance():
    return get_all_attendance()


@router.get("/attendance")
def fetch_attendance():
    return get_attendance()


@router.post("/admin/attendance")
def create_attendance(
    class_id: str,
    present: list[str],
    absent: list[str],
    _: bool = Depends(verify_admin)
):
    mark_attendance(
        class_id=class_id,
        present=present,
        absent=absent
    )
    return {"message": "Attendance recorded successfully"}


@router.post("/admin/attendance/capture")
def capture_attendance(
    class_id: str,
    image_base64: str,
    _: bool = Depends(verify_admin)
):
    try:
        img_bytes = base64.b64decode(image_base64.split(",")[1])
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        embeddings = extract_face_embedding(frame)
        if not embeddings:
            raise HTTPException(status_code=400, detail="No face detected")

        
        present = ["detected_student"]
        absent = []

        mark_attendance(class_id, present, absent)

        return {"message": "Attendance captured"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))