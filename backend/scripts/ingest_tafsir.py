"""
Tafsir Ingestion Script
Downloads tafsir texts, chunks them, embeds via OpenAI, and stores in Qdrant.

Usage:
  cd backend
  python -m scripts.ingest_tafsir

Requires: OPENAI_API_KEY in .env, Qdrant running on localhost:6333
"""

import asyncio
import httpx
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from openai import AsyncOpenAI
import os
import uuid

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
TAFSIR_COLLECTION = os.getenv("QDRANT_COLLECTION", "tafsir_embeddings")
AYAH_COLLECTION = "ayah_embeddings"

# Al Quran Cloud tafsir editions
TAFSIR_EDITIONS = [
    ("en.ibnikathir", "Ibn Kathir"),
    ("en.jalalayn", "Al-Jalalayn"),
]

client = AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
qdrant = QdrantClient(url=QDRANT_URL)


def chunk_text(text: str, max_tokens: int = 500) -> list[str]:
    """Split text into chunks of roughly max_tokens words."""
    words = text.split()
    chunks = []
    current: list[str] = []
    for word in words:
        current.append(word)
        if len(current) >= max_tokens:
            chunks.append(" ".join(current))
            current = []
    if current:
        chunks.append(" ".join(current))
    return chunks


async def get_embedding(text: str) -> list[float]:
    response = await client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


async def ingest_tafsir():
    print("=== Tafsir Ingestion ===")

    # Create collection
    try:
        qdrant.create_collection(
            collection_name=TAFSIR_COLLECTION,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        print(f"Created collection: {TAFSIR_COLLECTION}")
    except Exception:
        print(f"Collection {TAFSIR_COLLECTION} already exists")

    points = []
    async with httpx.AsyncClient(timeout=60) as http:
        for edition, source_name in TAFSIR_EDITIONS:
            print(f"\nFetching {source_name} ({edition})...")

            for surah_num in range(1, 115):
                try:
                    resp = await http.get(
                        f"https://api.alquran.cloud/v1/surah/{surah_num}/{edition}"
                    )
                    data = resp.json()
                    if data.get("code") != 200:
                        continue

                    ayahs = data["data"]["ayahs"]
                    for ayah in ayahs:
                        text = ayah.get("text", "").strip()
                        if not text or len(text) < 20:
                            continue

                        chunks = chunk_text(text)
                        for chunk in chunks:
                            embedding = await get_embedding(chunk)
                            points.append(PointStruct(
                                id=str(uuid.uuid4()),
                                vector=embedding,
                                payload={
                                    "text": chunk,
                                    "source": source_name,
                                    "edition": edition,
                                    "surah": surah_num,
                                    "ayah": ayah.get("numberInSurah", 0),
                                    "verse_key": f"{surah_num}:{ayah.get('numberInSurah', 0)}",
                                },
                            ))

                            # Batch upsert every 100 points
                            if len(points) >= 100:
                                qdrant.upsert(collection_name=TAFSIR_COLLECTION, points=points)
                                print(f"  Upserted {len(points)} chunks (Surah {surah_num})")
                                points = []

                except Exception as e:
                    print(f"  Error on surah {surah_num}: {e}")
                    continue

    # Final batch
    if points:
        qdrant.upsert(collection_name=TAFSIR_COLLECTION, points=points)
        print(f"Final upsert: {len(points)} chunks")

    print("\nTafsir ingestion complete!")


async def ingest_ayah_translations():
    """Embed all 6,236 ayah translations for semantic search."""
    print("\n=== Ayah Translation Embeddings ===")

    try:
        qdrant.create_collection(
            collection_name=AYAH_COLLECTION,
            vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
        )
        print(f"Created collection: {AYAH_COLLECTION}")
    except Exception:
        print(f"Collection {AYAH_COLLECTION} already exists")

    points = []
    async with httpx.AsyncClient(timeout=60) as http:
        for surah_num in range(1, 115):
            try:
                # Fetch Arabic + English
                arabic_resp = await http.get(
                    f"https://api.alquran.cloud/v1/surah/{surah_num}/quran-uthmani"
                )
                eng_resp = await http.get(
                    f"https://api.alquran.cloud/v1/surah/{surah_num}/en.sahih"
                )

                arabic_data = arabic_resp.json()
                eng_data = eng_resp.json()

                if arabic_data.get("code") != 200 or eng_data.get("code") != 200:
                    continue

                arabic_ayahs = arabic_data["data"]["ayahs"]
                eng_ayahs = eng_data["data"]["ayahs"]

                for ar, en in zip(arabic_ayahs, eng_ayahs):
                    translation = en.get("text", "").strip()
                    if not translation:
                        continue

                    embedding = await get_embedding(translation)
                    points.append(PointStruct(
                        id=str(uuid.uuid4()),
                        vector=embedding,
                        payload={
                            "surah": surah_num,
                            "ayah": ar.get("numberInSurah", 0),
                            "arabic": ar.get("text", ""),
                            "translation": translation,
                            "verse_key": f"{surah_num}:{ar.get('numberInSurah', 0)}",
                        },
                    ))

                    if len(points) >= 100:
                        qdrant.upsert(collection_name=AYAH_COLLECTION, points=points)
                        print(f"  Upserted {len(points)} ayahs (Surah {surah_num})")
                        points = []

            except Exception as e:
                print(f"  Error on surah {surah_num}: {e}")
                continue

    if points:
        qdrant.upsert(collection_name=AYAH_COLLECTION, points=points)
        print(f"Final upsert: {len(points)} ayahs")

    print("\nAyah embeddings complete!")


async def main():
    await ingest_tafsir()
    await ingest_ayah_translations()


if __name__ == "__main__":
    asyncio.run(main())
