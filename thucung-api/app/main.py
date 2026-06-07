from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import admin, auth, chat, content, health, pets, upload
from app.core.config import settings
from app.core.database import close_mongo_connection, connect_to_mongo


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_to_mongo()
    except Exception as exc:
        app.state.mongo_startup_error = f"{type(exc).__name__}: {exc}"
    yield
    await close_mongo_connection()


app = FastAPI(
    title="GPet Vet AI API",
    description="AI veterinary assistant API with MongoDB, RAG, and Gemini.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(pets.router, prefix="/pets", tags=["pets"])
app.include_router(content.router, prefix="/content", tags=["content"])
app.include_router(upload.router, prefix="/content", tags=["upload"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
settings.upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/")
async def root():
    return {"name": "GPet Vet AI", "status": "ready"}
