from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.models.content_item import content_item_document
from app.schemas.content import UrlIngestRequest
from app.services.repositories.content_repository import ContentRepository

router = APIRouter()
content = ContentRepository()


@router.get("")
async def list_content(pet_id: str | None = None, current_user: dict = Depends(get_current_user)):
    return await content.list_items(current_user["_id"], pet_id)


@router.get("/{content_id}")
async def get_content(content_id: str, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    item = await content.get_item(content_id, current_user["_id"], admin=is_admin)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    chunks = await content.get_chunks_for_content(content_id, current_user["_id"], admin=is_admin)
    item["chunks"] = chunks
    item["text_preview"] = "\n\n".join(chunk.get("text", "") for chunk in chunks[:8])
    file_path = item.get("file_path")
    if file_path:
        item["file_url"] = f"/{file_path}" if str(file_path).startswith("uploads/") else file_path
    return item


@router.post("/url")
async def ingest_url(payload: UrlIngestRequest, current_user: dict = Depends(get_current_user)):
    item = await content.create_item(
        content_item_document(
            current_user["_id"],
            payload.pet_id,
            payload.title or str(payload.url),
            "url",
            source="external_url",
            original_url=str(payload.url),
            status="ready",
            metadata={"note": "URL ingestion placeholder"},
        )
    )
    return item
