from fastapi import APIRouter, HTTPException

from app.models.quiz_model import QuizRequest
from app.services.quiz_service import generate_quiz

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


@router.post("/")
def create_quiz(data: QuizRequest):

    result = generate_quiz(
        data.roadmap_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result