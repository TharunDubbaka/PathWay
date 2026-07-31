from fastapi import FastAPI
from app.routes.roadmap import router as roadmap_router
from app.routes.progress import router as progress_router
from app.routes.adaptive import router as adaptive_router
from app.routes.studyplan import router as studyplan_router
from app.routes.quiz import router as quiz_router
from app.routes.quiz_evaluation import router as quiz_evaluation_router
app = FastAPI()

app.include_router(
    roadmap_router,
    prefix="/roadmap",
    tags=["Roadmap"]
)
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)