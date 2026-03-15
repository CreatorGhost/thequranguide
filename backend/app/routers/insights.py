from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.insight import SurahInsight
from app.schemas.insight import (
    SurahInsightResponse,
    SurahInsightListItem,
    SurahInsightBulkResponse,
)

router = APIRouter(prefix="/api/insights", tags=["insights"])

# Featured surahs — curated list of particularly notable surahs
FEATURED_SURAHS = [1, 2, 12, 18, 36, 55, 56, 67, 93, 112, 114]


@router.get("", response_model=SurahInsightBulkResponse)
async def list_insights(db: AsyncSession = Depends(get_db)):
    """List all 114 surahs with insight availability status."""
    result = await db.execute(select(SurahInsight))
    existing = {row.surah: row for row in result.scalars().all()}

    items = []
    for surah_num in range(1, 115):
        row = existing.get(surah_num)
        items.append(
            SurahInsightListItem(
                surah=surah_num,
                has_insight=row is not None,
                word_count=row.word_count if row else None,
                generated_at=row.generated_at if row else None,
            )
        )

    return SurahInsightBulkResponse(
        total=114,
        generated=len(existing),
        insights=items,
    )


@router.get("/featured", response_model=list[int])
async def get_featured():
    """Get curated list of featured surah numbers."""
    return FEATURED_SURAHS


@router.get("/{surah}", response_model=SurahInsightResponse | None)
async def get_insight(surah: int, db: AsyncSession = Depends(get_db)):
    """Get full insight for a single surah."""
    if surah < 1 or surah > 114:
        raise HTTPException(status_code=400, detail="Surah number must be between 1 and 114")

    result = await db.execute(
        select(SurahInsight).where(SurahInsight.surah == surah)
    )
    row = result.scalar_one_or_none()

    if not row:
        return None

    return row
