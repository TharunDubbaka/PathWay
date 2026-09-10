from fastapi import APIRouter, Depends, HTTPException

from app.models.progress_model import TopicProgressRequest
from app.services.progress_service import (
    complete_topic,
    get_progress_summary
)
from app.services.auth_service import get_current_user

router = APIRouter(
    tags=["Progress"]
)
@router.patch("/{roadmap_id}/topic")
def update_topic_progress(
    roadmap_id: str,
    data: TopicProgressRequest,
    user: dict = Depends(get_current_user)
):
    result = complete_topic(
        roadmap_id,
        data.phase_index,
        data.topic_index,
        user["id"]
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result
@router.get("/{roadmap_id}")
def progress_summary(roadmap_id: str, user: dict = Depends(get_current_user)):

    result = get_progress_summary(roadmap_id, user["id"])

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result