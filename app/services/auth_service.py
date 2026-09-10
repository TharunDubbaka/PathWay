import hashlib
import hmac
import secrets
from datetime import datetime, timezone

from fastapi import Header, HTTPException

from app.db.db import sessions_collection, users_collection


def _hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        120_000,
    )
    return f"{salt.hex()}:{digest.hex()}"


def _verify_password(password: str, stored_hash: str) -> bool:
    salt_hex, digest_hex = stored_hash.split(":", 1)
    candidate = _hash_password(password, bytes.fromhex(salt_hex))
    return hmac.compare_digest(candidate, f"{salt_hex}:{digest_hex}")


def register_user(email: str, password: str) -> dict:
    normalized_email = email.strip().lower()
    if users_collection.find_one({"email": normalized_email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    result = users_collection.insert_one({
        "email": normalized_email,
        "password_hash": _hash_password(password),
        "created_at": datetime.now(timezone.utc),
    })
    return {"id": str(result.inserted_id), "email": normalized_email}


def authenticate_user(email: str, password: str) -> dict:
    user = users_collection.find_one({"email": email.strip().lower()})
    if not user or not _verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"id": str(user["_id"]), "email": user["email"]}


def create_session(user: dict) -> dict:
    token = secrets.token_urlsafe(32)
    sessions_collection.insert_one({
        "token": token,
        "user_id": user["id"],
        "email": user["email"],
        "created_at": datetime.now(timezone.utc),
    })
    return {"token": token, "email": user["email"]}


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    token = authorization.split(" ", 1)[1].strip()
    session = sessions_collection.find_one({"token": token})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    return {"id": session["user_id"], "email": session["email"]}
