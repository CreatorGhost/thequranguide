from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.models.user import User
from app.models.reading import ReadingPosition, Bookmark
from app.schemas.reading import (
    ReadingPositionUpdate, ReadingPositionResponse,
    BookmarkCreate, BookmarkResponse, BookmarkUpdate,
)
from app.services.auth import get_current_user
import uuid

router = APIRouter(prefix="/api", tags=["reading"])


# ─── Reading Position ───

@router.get("/reading-position", response_model=ReadingPositionResponse)
async def get_reading_position(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ReadingPosition).where(ReadingPosition.user_id == user.id)
    )
    pos = result.scalar_one_or_none()
    if not pos:
        return ReadingPositionResponse(page=1, surah=None, ayah=None, view_mode="reading", updated_at=user.created_at)
    return pos


@router.put("/reading-position", response_model=ReadingPositionResponse)
async def update_reading_position(
    req: ReadingPositionUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ReadingPosition).where(ReadingPosition.user_id == user.id)
    )
    pos = result.scalar_one_or_none()
    if pos:
        pos.page = req.page
        pos.surah = req.surah
        pos.ayah = req.ayah
        pos.view_mode = req.view_mode
    else:
        pos = ReadingPosition(user_id=user.id, **req.model_dump())
        db.add(pos)
    await db.commit()
    await db.refresh(pos)
    return pos


# ─── Bookmarks ───

@router.get("/bookmarks", response_model=list[BookmarkResponse])
async def list_bookmarks(
    collection: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Bookmark).where(Bookmark.user_id == user.id)
    if collection:
        query = query.where(Bookmark.collection == collection)
    query = query.order_by(Bookmark.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/bookmarks", response_model=BookmarkResponse, status_code=201)
async def create_bookmark(
    req: BookmarkCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    bookmark = Bookmark(user_id=user.id, **req.model_dump())
    db.add(bookmark)
    await db.commit()
    await db.refresh(bookmark)
    return bookmark


@router.patch("/bookmarks/{bookmark_id}", response_model=BookmarkResponse)
async def update_bookmark(
    bookmark_id: uuid.UUID,
    req: BookmarkUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Bookmark).where(Bookmark.id == bookmark_id, Bookmark.user_id == user.id)
    )
    bookmark = result.scalar_one_or_none()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    if req.collection is not None:
        bookmark.collection = req.collection
    if req.note is not None:
        bookmark.note = req.note
    await db.commit()
    await db.refresh(bookmark)
    return bookmark


@router.delete("/bookmarks/{bookmark_id}", status_code=204)
async def delete_bookmark(
    bookmark_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Bookmark).where(Bookmark.id == bookmark_id, Bookmark.user_id == user.id)
    )
    bookmark = result.scalar_one_or_none()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    await db.delete(bookmark)
    await db.commit()
