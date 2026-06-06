from fastapi import APIRouter, HTTPException, Request

from app.core.config import settings
from app.core.database import get_database
from app.services.ai.gemini_service import GeminiService

router = APIRouter()


@router.get("")
async def health_check():
    return {"status": "ok"}


@router.get("/db")
async def database_health_check(request: Request):
    startup_error = getattr(request.app.state, "mongo_startup_error", None)
    if startup_error:
        raise HTTPException(status_code=500, detail=f"MongoDB startup failed: {startup_error}")
    try:
        db = get_database()
        await db.client.admin.command("ping")
        collections = await db.list_collection_names()
        return {
            "status": "ok",
            "database": settings.mongo_db,
            "collections": len(collections),
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"MongoDB health check failed: {type(exc).__name__}: {exc}",
        ) from exc


@router.get("/ai")
async def ai_health_check():
    answer = await GeminiService().generate("Reply with only: ok")
    return {
        "model": settings.gemini_model,
        "status": "ok" if answer.strip().lower().startswith("ok") else "check",
        "response": answer,
    }
