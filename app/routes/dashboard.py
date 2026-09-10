from fastapi import APIRouter, Depends, HTTPException

from app.services.dashboard_service import (
    get_dashboard
)
from app.services.auth_service import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/{roadmap_id}")
def dashboard(roadmap_id: str, user: dict = Depends(get_current_user)):

    result = get_dashboard(
        roadmap_id,
        user["id"]
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    return result