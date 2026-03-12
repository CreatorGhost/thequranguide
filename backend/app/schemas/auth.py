from pydantic import BaseModel, EmailStr
import uuid
from datetime import datetime


class SignupRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    display_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    username: str
    display_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
