from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.content_item import content_item_document
from app.schemas.content import UrlIngestRequest
from app.services.repositories.content_repository import ContentRepository

router = APIRouter()
content = ContentRepository()


@router.get("")
async def list_content(pet_id: str | None = None, current_user: dict = Depends(get_current_user)):
    return await content.list_items(current_user["_id"], pet_id)


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
