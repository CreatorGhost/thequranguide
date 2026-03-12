from pydantic import BaseModel
import uuid
from datetime import datetime


class ReadingPositionUpdate(BaseModel):
    page: int
    surah: int | None = None
    ayah: int | None = None
    view_mode: str = "reading"


class ReadingPositionResponse(BaseModel):
    page: int
    surah: int | None
    ayah: int | None
    view_mode: str
    updated_at: datetime

    model_config = {"from_attributes": True}


class BookmarkCreate(BaseModel):
    surah: int
    ayah: int
    page: int
    collection: str = "default"
    note: str | None = None


class BookmarkResponse(BaseModel):
    id: uuid.UUID
    surah: int
    ayah: int
    page: int
    collection: str
    note: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class BookmarkUpdate(BaseModel):
    collection: str | None = None
    note: str | None = None
