from pydantic import BaseModel
from datetime import datetime


class SurahInsightResponse(BaseModel):
    surah: int
    version: int
    content: dict
    word_count: int
    model_used: str
    generated_at: datetime

    model_config = {"from_attributes": True}


class SurahInsightListItem(BaseModel):
    surah: int
    has_insight: bool
    word_count: int | None = None
    generated_at: datetime | None = None


class SurahInsightBulkResponse(BaseModel):
    total: int
    generated: int
    insights: list[SurahInsightListItem]
