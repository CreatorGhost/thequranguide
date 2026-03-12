from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm import get_embedding
from app.config import get_settings

router = APIRouter(prefix="/api/search", tags=["search"])
settings = get_settings()


class SearchRequest(BaseModel):
    query: str
    limit: int = 10


class SearchResult(BaseModel):
    surah: int
    ayah: int
    arabic: str
    translation: str
    score: float


class SearchResponse(BaseModel):
    results: list[SearchResult]
    query: str


@router.post("", response_model=SearchResponse)
async def semantic_search(req: SearchRequest):
    """
    Semantic search across all 6,236 ayah translations.
    Embeds the query, searches Qdrant ayah_embeddings collection.
    """
    try:
        query_embedding = await get_embedding(req.query)

        from qdrant_client import QdrantClient
        qdrant = QdrantClient(url=settings.QDRANT_URL)

        results = qdrant.search(
            collection_name="ayah_embeddings",
            query_vector=query_embedding,
            limit=req.limit,
        )

        search_results = []
        for hit in results:
            if hit.payload:
                search_results.append(SearchResult(
                    surah=hit.payload.get("surah", 0),
                    ayah=hit.payload.get("ayah", 0),
                    arabic=hit.payload.get("arabic", ""),
                    translation=hit.payload.get("translation", ""),
                    score=hit.score,
                ))

        return SearchResponse(results=search_results, query=req.query)

    except Exception as e:
        return SearchResponse(results=[], query=req.query)
