from fastapi import FastAPI
from app.admin import router as admin_router

app = FastAPI(title="University Smart Attendance – Scaled System")

app.include_router(admin_router)


@app.get("/")
def health():
    return {
        "status": "Running",
        "system": "University Smart Attendance with Scheduling"
    }
