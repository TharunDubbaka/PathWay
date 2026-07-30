from fastapi import APIRouter, HTTPException

from app.services.dashboard_service import (
    get_dashboard
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/{roadmap_id}")
def dashboard(roadmap_id: str):

    result = get_dashboard(
        roadmap_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result