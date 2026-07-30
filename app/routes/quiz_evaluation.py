from fastapi import APIRouter

from app.models.quiz_submission_model import (
    QuizSubmissionRequest
)

from app.services.quiz_evaluation_service import (
    evaluate_quiz
)

router = APIRouter(
    prefix="/quiz-evaluation",
    tags=["Quiz Evaluation"]
)


@router.post("/")
def submit_quiz(
    data: QuizSubmissionRequest
):

    return evaluate_quiz(
        data.answers,
        data.correct_answers
    )