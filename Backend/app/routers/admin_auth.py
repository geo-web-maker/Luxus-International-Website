"""
Admin authentication. Single fixed admin identity (email + bcrypt hash in
settings) — there's no user collection, no signup, no roles. If that ever
needs to grow into multiple admin accounts, this is the file to replace;
nothing else in the app should need to change since routers only depend on
`require_admin` from app.deps, not on how the token was issued.
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.config import settings
from app.core.security import create_access_token, verify_password

router = APIRouter(prefix="/api/admin", tags=["admin-auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest) -> LoginResponse:
    if payload.email.lower() != settings.admin_email.lower():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not verify_password(payload.password, settings.admin_password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=settings.admin_email)
    return LoginResponse(access_token=token)
