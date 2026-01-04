import re
import base64
import cv2
import numpy as np
from fastapi import APIRouter, HTTPException

from app.face_engine import extract_face_embedding, cosine_similarity
from app.firebase_service import save_student, get_all_students

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------

SIMILARITY_THRESHOLD = 0.85
router = APIRouter(prefix="/student")


# -------------------------------------------------------------------
# Validation utilities
# -------------------------------------------------------------------

def validate_student_id(student_id: str) -> None:
    """
    Enforces institutional enrollment ID format.
    """
    if not student_id or not re.fullmatch(r"A100\d{8,9}", student_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid enrollment ID format"
        )


def decode_image(image_base64: str) -> np.ndarray:
    """
    Converts base64 image to OpenCV frame.
    """
    try:
        image_bytes = base64.b64decode(image_base64.split(",")[-1])
        np_img = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if frame is None:
            raise ValueError

        return frame

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid image data"
        )


def extract_single_embedding(frame: np.ndarray) -> np.ndarray:
    """
    Extracts exactly one face embedding from the frame.
    """
    embeddings = extract_face_embedding(frame)

    if embeddings is None or len(embeddings) == 0:
        raise HTTPException(
            status_code=400,
            detail="No face detected"
        )

    return embeddings[0]


def prevent_duplicate_face(new_embedding: np.ndarray) -> None:
    """
    Blocks enrollment if the face already exists.
    """
    existing_students = get_all_students()

    for student in existing_students:
        existing_embedding = student.get("embedding")

        if existing_embedding is None:
            continue

        similarity = cosine_similarity(existing_embedding, new_embedding)

        if similarity >= SIMILARITY_THRESHOLD:
            raise HTTPException(
                status_code=409,
                detail="This face is already enrolled"
            )


# -------------------------------------------------------------------
# API endpoint
# -------------------------------------------------------------------

@router.post("/enroll")
def enroll_student(payload: dict):
    """
    Enrolls a student after face verification.
    """

    student_id = payload.get("student_id")
    name = payload.get("name")
    course = payload.get("course")
    image_base64 = payload.get("image_base64")

    if not all([student_id, name, course, image_base64]):
        raise HTTPException(
            status_code=400,
            detail="Missing required fields"
        )


    validate_student_id(student_id)

    frame = decode_image(image_base64)

    embedding = extract_single_embedding(frame)
    prevent_duplicate_face(embedding)

    save_student(
        student_id=student_id,
        name=name,
        course=course,
        embedding=embedding
    )

    return {
        "status": "success",
        "message": "Enrollment completed"
    }
