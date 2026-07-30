from fastapi import APIRouter, HTTPException

from app.models.adaptive_model import AdaptiveRequest
from app.services.roadmap_service import get_roadmap_by_id
from app.services.adaptive_service import analyze_progress


router = APIRouter()


@router.post("/analyze")
def analyze(data: AdaptiveRequest):

    roadmap = get_roadmap_by_id(data.roadmap_id)

    if roadmap is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )


    result = analyze_progress(roadmap)

    return result