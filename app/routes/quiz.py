from fastapi import APIRouter, Depends, HTTPException

from app.models.quiz_model import QuizRequest
from app.services.quiz_service import generate_quiz
from app.services.auth_service import get_current_user

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


@router.post("/")
def create_quiz(data: QuizRequest, user: dict = Depends(get_current_user)):

    result = generate_quiz(
        data.roadmap_id,
        user["id"]
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result