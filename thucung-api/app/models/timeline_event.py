from datetime import datetime

from app.models.common import MongoModel, now_utc


class TimelineEvent(MongoModel):
    owner_id: str
    pet_id: str
    type: str
    title: str
    date: str | None = None
    status: str = "planned"
    labels: list[str] = []
    notes: str | None = None
    related_content_id: str | None = None
    content_ids: list[str] = []
    created_by: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


def timeline_event_document(owner_id: str, pet_id: str, data: dict, created_by: str) -> dict:
    now = now_utc()
    return {
        "owner_id": owner_id,
        "pet_id": pet_id,
        **data,
        "created_by": created_by,
        "created_at": now,
        "updated_at": now,
    }
