from pydantic import BaseModel


class TimelineEventCreate(BaseModel):
    pet_id: str
    type: str
    title: str
    date: str | None = None
    status: str = "planned"
    labels: list[str] = []
    notes: str | None = None
    related_content_id: str | None = None
    content_ids: list[str] = []


class TimelineEventUpdate(BaseModel):
    type: str | None = None
    title: str | None = None
    date: str | None = None
    status: str | None = None
    labels: list[str] | None = None
    notes: str | None = None
    related_content_id: str | None = None
    content_ids: list[str] | None = None
