from fastapi import APIRouter, HTTPException
from face_engine import extract_face_embedding, cosine_similarity
from firebase_service import save_student, get_all_students

router = APIRouter()
SIMILARITY_THRESHOLD = 0.85

@router.post("/student/enroll")
def enroll_student(payload: dict):
    student_id = payload["student_id"]
    name = payload["name"]
    course = payload["course"]
    image_base64 = payload["image_base64"]

    # 1. Extract face embedding from image
    embeddings = extract_face_embedding(image_base64)
    if not embeddings:
        raise HTTPException(status_code=400, detail="No face detected")

    new_embedding = embeddings[0]

    # 2. Enforce ONE FACE = ONE ID
    existing_students = get_all_students()

    for student in existing_students:
        existing_embedding = student.get("embedding")
        if not existing_embedding:
            continue

        similarity = cosine_similarity(existing_embedding, new_embedding)

        if similarity >= SIMILARITY_THRESHOLD:
            raise HTTPException(
                status_code=409,
                detail="This face is already enrolled with another enrollment ID."
            )

    # 3. Save student
    save_student(student_id, name, course, new_embedding)

    return {"status": "success"}
