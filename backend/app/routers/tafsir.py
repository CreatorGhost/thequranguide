from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.auth import get_current_user
from app.services.llm import chat_completion, get_embedding
from app.config import get_settings
import json

router = APIRouter(prefix="/api/tafsir", tags=["tafsir"])
settings = get_settings()


class TafsirQuestion(BaseModel):
    question: str
    surah: int | None = None
    ayah: int | None = None


@router.post("/ask")
async def ask_tafsir(req: TafsirQuestion, user=Depends(get_current_user)):
    """
    RAG-powered tafsir Q&A. Embeds question, retrieves from Qdrant,
    then streams GPT-4.1 response via SSE.
    """
    # Step 1: Get embedding for the question
    context_chunks = []
    try:
        query_embedding = await get_embedding(req.question)

        # Step 2: Search Qdrant for relevant tafsir chunks
        from qdrant_client import QdrantClient
        qdrant = QdrantClient(url=settings.QDRANT_URL)
        results = qdrant.search(
            collection_name=settings.QDRANT_COLLECTION,
            query_vector=query_embedding,
            limit=5,
        )
        context_chunks = [hit.payload.get("text", "") for hit in results if hit.payload]
    except Exception:
        # If Qdrant is not available, proceed without RAG context
        pass

    context_text = "\n\n---\n\n".join(context_chunks) if context_chunks else ""

    # Step 3: Build prompt
    system_prompt = """You are a knowledgeable Islamic scholar assistant for theQuranGuide.
Your answers must be grounded in classical tafsir sources: Ibn Kathir, Al-Jalalayn, and Al-Tabari.
Always cite which tafsir source your information comes from.
Be respectful, accurate, and scholarly. If you're unsure, say so clearly.
Answer in English unless the user writes in another language."""

    user_message = req.question
    if req.surah and req.ayah:
        user_message = f"Regarding Surah {req.surah}, Ayah {req.ayah}: {req.question}"

    messages = [{"role": "system", "content": system_prompt}]
    if context_text:
        messages.append({"role": "system", "content": f"Relevant tafsir context:\n\n{context_text}"})
    messages.append({"role": "user", "content": user_message})

    # Step 4: Stream response via SSE
    async def generate():
        response = await chat_completion(messages=messages, stream=True)
        async for chunk in response:
            if chunk.choices[0].delta.content:
                yield f"data: {json.dumps({'text': chunk.choices[0].delta.content})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
