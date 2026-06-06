from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.core.database import get_database

router = APIRouter()


@router.get("")
async def health_check():
    return {"status": "ok"}


@router.get("/db")
async def database_health_check():
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
