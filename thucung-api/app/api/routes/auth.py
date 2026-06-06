from fastapi import APIRouter, HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import user_document
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.repositories.user_repository import UserRepository

router = APIRouter()
users = UserRepository()


def public_user(user: dict) -> dict:
    return {"id": user["_id"], "email": user["email"], "full_name": user["full_name"], "role": user.get("role", "pet_owner")}


@router.post("/register", response_model=TokenResponse)
async def register(payload: RegisterRequest):
    existing = await users.find_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = await users.create(user_document(payload.email, payload.full_name, hash_password(payload.password)))
    token = create_access_token(user["_id"], {"role": user["role"]})
    return TokenResponse(access_token=token, user=public_user(user))


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    user = await users.find_by_email(payload.email)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token(user["_id"], {"role": user.get("role", "pet_owner")})
    return TokenResponse(access_token=token, user=public_user(user))
