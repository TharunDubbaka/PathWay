from pydantic import BaseModel

class StudyPlanRequest(BaseModel):
    roadmap_id: str