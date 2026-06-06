from datetime import datetime

from app.models.common import MongoModel, now_utc


class ContentChunk(MongoModel):
    content_id: str
    pet_id: str
    owner_id: str
    chunk_index: int
    text: str
    metadata: dict = {}
    embedding: list[float] | None = None
    created_at: datetime | None = None


def chunk_document(content_id: str, pet_id: str, owner_id: str, chunk_index: int, text: str, **extra) -> dict:
    return {
        "content_id": content_id,
        "pet_id": pet_id,
        "owner_id": owner_id,
        "chunk_index": chunk_index,
        "text": text,
        "metadata": extra.get("metadata", {}),
        "embedding": extra.get("embedding"),
        "created_at": now_utc(),
    }
