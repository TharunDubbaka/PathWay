from fastapi import APIRouter, HTTPException
from app.models.study_plan_model import StudyPlanRequest
from app.services.study_plan_service import generate_study_plan

router = APIRouter(
    prefix="/study-plan",
    tags=["Study Plan"]
)


@router.post("/")
def create_plan(data: StudyPlanRequest):

    result = generate_study_plan(
        data.roadmap_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result