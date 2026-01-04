import time
import base64
import cv2
import numpy as np
from typing import Dict

from app.face_engine import extract_face_embedding
from app.attendance_engine import (
    start_class_session,
    mark_attendance,
    finalize_attendance
)

# -------------------------------------------------
# ACTIVE CAMERA SESSIONS (PER CLASS)
# -------------------------------------------------

_active_sessions: Dict[str, dict] = {}


# -------------------------------------------------
# START CAMERA SESSION (ADMIN)
# -------------------------------------------------

def start_camera_session(class_id: str, threshold_seconds: int = 10):
    """
    Starts a new attendance session for a class
    """

    if class_id in _active_sessions:
        return {"status": "already_running"}

    start_class_session(class_id)

    _active_sessions[class_id] = {
        "threshold": threshold_seconds,
        "face_timers": {},
        "started_at": time.time(),
        "active": True
    }

    return {
        "status": "camera_started",
        "class_id": class_id,
        "threshold_seconds": threshold_seconds
    }


# -------------------------------------------------
# STOP CAMERA SESSION (ADMIN)
# -------------------------------------------------

def stop_camera_session(class_id: str):
    """
    Stops camera and FINALIZES attendance
    """

    if class_id not in _active_sessions:
        return {"status": "not_running"}

    result = finalize_attendance(class_id)

    _active_sessions.pop(class_id, None)

    return {
        "status": "camera_stopped",
        "finalized": result
    }


# -------------------------------------------------
# PROCESS SINGLE FRAME (FROM FRONTEND)
# -------------------------------------------------

def process_frame(class_id: str, image_base64: str):
    """
    Receives a frame from frontend every ~500ms
    """

    if class_id not in _active_sessions:
        return {"status": "inactive"}

    session = _active_sessions[class_id]

    try:
        image_bytes = base64.b64decode(image_base64.split(",")[-1])
        np_img = np.frombuffer(image_bytes, dtype=np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    except Exception:
        return {"status": "invalid_image"}

    embedding = extract_face_embedding(frame)

    if embedding is None:
        return {"status": "no_face"}

    face_key = str(hash(tuple(embedding[:16])))
    now = time.time()

    if face_key not in session["face_timers"]:
        session["face_timers"][face_key] = now
        return {
            "status": "tracking",
            "elapsed": 0
        }

    elapsed = now - session["face_timers"][face_key]

    if elapsed >= session["threshold"]:
        result = mark_attendance(class_id, embedding)
        session["face_timers"].pop(face_key, None)

        return {
            "status": "marked",
            "elapsed": int(elapsed),
            "result": result
        }

    return {
        "status": "tracking",
        "elapsed": int(elapsed)
    }
