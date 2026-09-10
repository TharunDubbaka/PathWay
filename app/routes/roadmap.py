from fastapi import APIRouter, Depends, HTTPException

from app.models.goal_model import GoalRequest
from app.services.auth_service import get_current_user
from app.services.generation_jobs import get_job, start_goal_generation
from app.services.roadmap_service import get_roadmap_by_id

router = APIRouter()


@router.post("/generate")
def generate_roadmap(data: GoalRequest, user: dict = Depends(get_current_user)):
    job_id = start_goal_generation(data, user["id"])
    return {"job_id": job_id, "status": "queued"}


@router.get("/jobs/{job_id}")
def generation_status(job_id: str, user: dict = Depends(get_current_user)):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Generation job not found")
    if job.get("user_id") != user["id"]:
        raise HTTPException(status_code=403, detail="You cannot access this roadmap")
    return job


@router.get("/{roadmap_id}")
def get_roadmap(roadmap_id: str, user: dict = Depends(get_current_user)):

    roadmap = get_roadmap_by_id(roadmap_id, user["id"])

    if roadmap is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return roadmap