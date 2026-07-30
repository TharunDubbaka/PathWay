from pydantic import BaseModel

class QuizSubmissionRequest(BaseModel):
    answers: list[str]
    correct_answers: list[str]