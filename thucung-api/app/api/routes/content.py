from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.models.content_item import content_item_document
from app.schemas.content import UrlIngestRequest
from app.services.ingest.content_ingest_service import ContentIngestService
from app.services.rag.classifier import QueryClassifier
from app.services.repositories.audit_repository import AuditRepository
from app.services.repositories.content_repository import ContentRepository
from app.services.repositories.pet_repository import PetRepository
from app.services.pet_summary_service import PetSummaryService

router = APIRouter()
content = ContentRepository()
ingest = ContentIngestService()
classifier = QueryClassifier()
audit = AuditRepository()
pets = PetRepository()
summary_service = PetSummaryService()


class ContentMetadataUpdate(BaseModel):
    document_date: str | None = None
    document_type: str | None = None
    labels: list[str] = []
    notes: str | None = None


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


@router.patch("/{content_id}/metadata")
async def update_content_metadata(content_id: str, payload: ContentMetadataUpdate, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    item = await content.get_item(content_id, current_user["_id"], admin=is_admin)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    metadata = {**(item.get("metadata") or {}), **payload.model_dump()}
    metadata["categories"] = sorted(
        classifier.classify(
            " ".join([item.get("title", ""), metadata.get("notes") or ""]),
            metadata.get("labels", []),
            metadata.get("document_type"),
        )
    )
    updated = await content.update_metadata(content_id, current_user["_id"], metadata, admin=is_admin)
    await content.sync_chunk_metadata(content_id, current_user["_id"], metadata, admin=is_admin)
    await summary_service.build(item["owner_id"], item["pet_id"], admin=True)
    await audit.log(current_user["_id"], "update_metadata", "content", content_id, item["owner_id"], item["pet_id"], metadata)
    return updated


@router.post("/{content_id}/retry")
async def retry_content_ingestion(content_id: str, background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    item = await content.get_item(content_id, current_user["_id"], admin=is_admin)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    if not item.get("file_path"):
        raise HTTPException(status_code=400, detail="Only uploaded files can be retried")
    await content.delete_chunks_for_content(content_id, current_user["_id"], admin=is_admin)
    await content.mark_item(content_id, "processing", item.get("metadata") or {})
    item["status"] = "processing"
    background_tasks.add_task(ingest.process_file, item)
    await audit.log(current_user["_id"], "retry_ingestion", "content", content_id, item["owner_id"], item["pet_id"])
    return item


@router.post("/reindex-pet/{pet_id}")
async def reindex_pet_content(pet_id: str, background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    pet = await pets.get(pet_id, current_user["_id"], admin=is_admin)
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    background_tasks.add_task(ingest.reindex_pet_metadata, pet["owner_id"], pet_id, True)
    background_tasks.add_task(summary_service.build, pet["owner_id"], pet_id, True)
    await audit.log(current_user["_id"], "reindex", "pet_content", pet_id, pet["owner_id"], pet_id)
    return {"ok": True, "message": "Reindex started"}


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
            status="uploaded",
            metadata={
                "document_type": "external_reference",
                "labels": ["external_url"],
                "notes": "External URL reference. Full URL extraction is not enabled yet.",
                "categories": [],
            },
        )
    )
    return item
