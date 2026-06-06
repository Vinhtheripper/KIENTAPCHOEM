from datetime import datetime

from app.models.common import MongoModel, now_utc


class ContentItem(MongoModel):
    pet_id: str
    owner_id: str
    title: str
    type: str
    source: str
    file_path: str | None = None
    original_url: str | None = None
    status: str = "uploaded"
    metadata: dict = {}
    created_at: datetime | None = None


def content_item_document(owner_id: str, pet_id: str, title: str, content_type: str, **extra) -> dict:
    return {
        "owner_id": owner_id,
        "pet_id": pet_id,
        "title": title,
        "type": content_type,
        "source": extra.get("source", "uploaded_file"),
        "file_path": extra.get("file_path"),
        "original_url": extra.get("original_url"),
        "status": extra.get("status", "uploaded"),
        "metadata": extra.get("metadata", {}),
        "created_at": now_utc(),
    }
