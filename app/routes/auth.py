from fastapi import APIRouter, Depends

from app.models.auth_model import AuthRequest
from app.services.auth_service import (
    authenticate_user,
    create_session,
    get_current_user,
    register_user,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(data: AuthRequest):
    user = register_user(data.email, data.password)
    return create_session(user)


@router.post("/login")
def login(data: AuthRequest):
    return create_session(authenticate_user(data.email, data.password))


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"email": user["email"]}
