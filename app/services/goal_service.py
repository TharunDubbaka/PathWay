from datetime import datetime, timezone

from app.db.db import roadmaps_collection
from app.services.gemini_service import generate_ai_roadmap


def generate_goal(data, user_id: str):
    skills = [skill.model_dump() for skill in data.current_skills]
    roadmap = generate_ai_roadmap(
        data.goal_name,
        data.skill_level,
        skills,
        data.study_hours_per_week,
    )
    roadmap.update({
        "goal_name": data.goal_name,
        "goal": data.goal_name,
        "skill_level": data.skill_level,
        "current_skills": skills,
        "study_hours_per_week": data.study_hours_per_week,
        "user_id": user_id,
        "progress": 0,
        "created_at": datetime.now(timezone.utc),
    })
    result = roadmaps_collection.insert_one(roadmap)
    roadmap.pop("_id", None)
    return {"goal_id": str(result.inserted_id), "roadmap": roadmap}
