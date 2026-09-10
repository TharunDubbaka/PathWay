from pydantic import BaseModel, Field


class SkillExperience(BaseModel):
    name: str = Field(min_length=1)
    experience_level: str = "Beginner"


class GoalRequest(BaseModel):
    goal_name: str = Field(min_length=1)
    current_skills: list[SkillExperience] = Field(default_factory=list)
    skill_level: str = "Beginner"
    study_hours_per_week: int = Field(ge=1, le=168)
