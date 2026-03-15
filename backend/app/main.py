from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, reading, tafsir, search, insights

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(reading.router)
app.include_router(tafsir.router)
app.include_router(search.router)
app.include_router(insights.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": settings.APP_NAME}
