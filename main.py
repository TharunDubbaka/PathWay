import os

from fastapi import FastAPI
from app.routes.roadmap import router as roadmap_router
from app.routes.progress import router as progress_router
from app.routes.adaptive import router as adaptive_router
from app.routes.studyplan import router as studyplan_router
from app.routes.quiz import router as quiz_router
from app.routes.quiz_evaluation import router as quiz_evaluation_router
from app.routes.auth import router as auth_router
from app.routes.goals import router as goals_router
app = FastAPI()

app.include_router(
    roadmap_router,
    prefix="/roadmap",
    tags=["Roadmap"]
)
app.include_router(auth_router)
app.include_router(goals_router)
app.include_router(
    progress_router,
    prefix="/progress",
    tags=["Progress"]
)
app.include_router(
    adaptive_router,
    prefix="/adaptive",
    tags=["Adaptive AI"]
)
app.include_router(
    studyplan_router,
    prefix="/study-plan",
    tags=["Study Plan"]
)

app.include_router(quiz_router)
app.include_router(quiz_evaluation_router)
from app.routes.dashboard import (
    router as dashboard_router
)

app.include_router(
    dashboard_router
)
from fastapi.middleware.cors import CORSMiddleware

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://path-way-theta.vercel.app",
]
configured_origins = os.getenv("FRONTEND_URLS", os.getenv("FRONTEND_URL", ""))
allowed_origins.extend(
    origin.strip().rstrip("/")
    for origin in configured_origins.split(",")
    if origin.strip()
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {
        "message": "PathWay API is running 🚀"
    }