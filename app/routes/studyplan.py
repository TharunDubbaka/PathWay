from fastapi import APIRouter, Depends, HTTPException
from app.models.study_plan_model import StudyPlanRequest
from app.services.study_plan_service import generate_study_plan
from app.services.auth_service import get_current_user

router = APIRouter(
    prefix="/study-plan",
    tags=["Study Plan"]
)


@router.post("/")
def create_plan(data: StudyPlanRequest, user: dict = Depends(get_current_user)):

    result = generate_study_plan(
        data.roadmap_id,
        user["id"]
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result