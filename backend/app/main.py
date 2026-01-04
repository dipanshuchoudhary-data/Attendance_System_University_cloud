from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import firebase_init  # ensures Firebase initializes
from app.admin import router as admin_router
from app.enrollment import router as enrollment_router
from app.attendance import router as attendance_router
from app.firebase_service import get_all_students, get_all_attendance

app = FastAPI(title="Attendance System API")


# ------------------------------------------------------------------
# CORS CONFIGURATION (BROWSER-SAFE)
# ------------------------------------------------------------------

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


# ------------------------------------------------------------------
# PUBLIC ROUTES
# ------------------------------------------------------------------

@app.get("/students")
def list_students():
    return get_all_students()


@app.get("/attendance")
def list_attendance():
    return get_all_attendance()


# ------------------------------------------------------------------
# ROUTERS
# ------------------------------------------------------------------

app.include_router(admin_router)
app.include_router(enrollment_router)
app.include_router(attendance_router)
