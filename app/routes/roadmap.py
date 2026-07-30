from fastapi import APIRouter, HTTPException

from app.models.roadmap_model import RoadmapRequest
from app.services.roadmap_service import (
    create_roadmap,
    get_roadmap_by_id
)
from app.services.progress_service import get_current_topic

router = APIRouter()


@router.post("/generate")
def generate_roadmap(data: RoadmapRequest):

    return create_roadmap(data)


@router.get("/{roadmap_id}")
def get_roadmap(roadmap_id: str):

    roadmap = get_roadmap_by_id(roadmap_id)

    if roadmap is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return roadmap
@router.get("/{roadmap_id}/current-topic")
def current_topic(roadmap_id: str):

    result = get_current_topic(roadmap_id)

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result