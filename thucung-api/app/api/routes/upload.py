import json

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile

from app.api.deps import get_current_user
from app.models.content_item import content_item_document
from app.services.ingest.content_ingest_service import ContentIngestService
from app.services.repositories.content_repository import ContentRepository
from app.services.storage.local_storage import LocalStorage

router = APIRouter()
storage = LocalStorage()
content = ContentRepository()
ingest = ContentIngestService()


@router.post("/upload")
async def upload_content(
    background_tasks: BackgroundTasks,
    pet_id: str = Form(...),
    document_date: str | None = Form(default=None),
    document_type: str | None = Form(default=None),
    labels: str | None = Form(default=None),
    notes: str | None = Form(default=None),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    saved_path = await storage.save_upload(file, current_user["_id"], pet_id)
    content_type = ingest.detect_type(file.filename or saved_path.name)
    parsed_labels = []
    if labels:
        try:
            parsed = json.loads(labels)
            if isinstance(parsed, list):
                parsed_labels = [str(label).strip() for label in parsed if str(label).strip()]
            else:
                parsed_labels = [label.strip() for label in labels.split(",") if label.strip()]
        except json.JSONDecodeError:
            parsed_labels = [label.strip() for label in labels.split(",") if label.strip()]
    metadata = {
        "document_date": document_date,
        "document_type": document_type,
        "labels": parsed_labels,
        "notes": notes,
        "original_filename": file.filename,
    }
    item = await content.create_item(
        content_item_document(
            current_user["_id"],
            pet_id,
            file.filename or saved_path.name,
            content_type,
            file_path=str(saved_path),
            status="processing",
            metadata=metadata,
        )
    )
    background_tasks.add_task(ingest.process_file, item)
    return item
