from pydantic import BaseModel, Field


class RoadmapRequest(BaseModel):
    goal: str
    skill_level: str = "Beginner"
    current_skills: list[str] = Field(default_factory=list)
    study_hours_per_week: int
    