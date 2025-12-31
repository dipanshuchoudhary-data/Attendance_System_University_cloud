from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.firebase_service import db
from app.admin import router as admin_router
from fastapi import Depends
from app.auth import admin_auth


app = FastAPI(
    title="University Smart Attendance",
    version="0.1.0"
)

# ✅ CORS CONFIGURATION (THIS FIXES EVERYTHING)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(admin_router,dependencies=[Depends(admin_auth)])

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/students")
def get_students():
    docs = db.collection("students").stream()
    students = []
    for d in docs:
        data = d.to_dict()
        data["student_id"] = d.id
        students.append(data)
    return students


@app.get("/attendance")
def get_attendance():
    docs = db.collection("attendance").stream()
    records = []
    for d in docs:
        records.append(d.to_dict())
    return records


# STUDENT ENROLL API

import base64
import cv2
import numpy as np
from fastapi import HTTPException
from app.firebase_service import db
from app.face_engine import extract_face_embedding
from pydantic import BaseModel

class StudentEnrollRequest(BaseModel):
    student_id: str
    name: str
    course: str
    image_base64: str


from fastapi import HTTPException
import base64
import cv2
import numpy as np
from app.face_engine import extract_face_embedding
from app.firebase_service import db

@app.post("/student/enroll")
def enroll_student(payload: StudentEnrollRequest):
    student_id = payload.student_id
    name = payload.name
    course = payload.course
    image_base64 = payload.image_base64

    #  Duplicate check
    doc_ref = db.collection("students").document(student_id)
    if doc_ref.get().exists:
        raise HTTPException(status_code=409, detail="Student already enrolled")

    # Decode image
    try:
        image_bytes = base64.b64decode(image_base64.split(",")[1])
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image data")

    embeddings = extract_face_embedding(frame)
    if not embeddings:
        raise HTTPException(status_code=400, detail="No face detected")

    doc_ref.set({
        "name": name,
        "course": course,
        "embedding": embeddings[0]
    })

    return {"message": "Student enrolled successfully"}
