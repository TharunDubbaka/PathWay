from pydantic import BaseModel

class QuizRequest(BaseModel):
    roadmap_id: str