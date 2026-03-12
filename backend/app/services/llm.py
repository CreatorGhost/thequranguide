"""
LLM abstraction layer.
Supports OpenAI, OpenRouter, and Grok via a unified interface.
Swap providers by changing OPENAI_BASE_URL and OPENAI_API_KEY in env.
"""

from openai import AsyncOpenAI
from app.config import get_settings

settings = get_settings()

_client: AsyncOpenAI | None = None


def get_llm_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
        )
    return _client


async def chat_completion(
    messages: list[dict],
    model: str | None = None,
    temperature: float = 0.3,
    max_tokens: int = 2048,
    stream: bool = False,
):
    client = get_llm_client()
    return await client.chat.completions.create(
        model=model or settings.LLM_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        stream=stream,
    )


async def get_embedding(text: str) -> list[float]:
    client = get_llm_client()
    response = await client.embeddings.create(
        model=settings.EMBEDDING_MODEL,
        input=text,
    )
    return response.data[0].embedding
