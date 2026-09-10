from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.db.db import roadmaps_collection
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("")
def list_goals(user: dict = Depends(get_current_user)):
    goals = roadmaps_collection.find(
        {"user_id": user["id"]},
        {"goal_name": 1, "skill_level": 1, "study_hours_per_week": 1, "progress": 1},
    ).sort("created_at", -1)
    return [
        {
            "id": str(goal["_id"]),
            "goal_name": goal.get("goal_name", goal.get("goal", "Untitled goal")),
            "skill_level": goal.get("skill_level", "Beginner"),
            "study_hours_per_week": goal.get("study_hours_per_week", 0),
            "progress": goal.get("progress", 0),
        }
        for goal in goals
    ]


@router.get("/{goal_id}")
def get_goal(goal_id: str, user: dict = Depends(get_current_user)):
    try:
        goal = roadmaps_collection.find_one({"_id": ObjectId(goal_id), "user_id": user["id"]})
    except Exception:
        goal = None
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal["_id"] = str(goal["_id"])
    return goal
