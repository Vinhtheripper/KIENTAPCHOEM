from datetime import datetime

from app.models.common import MongoModel, now_utc


class Pet(MongoModel):
    owner_id: str
    name: str
    species: str
    breed: str | None = None
    gender: str | None = None
    birthday: datetime | None = None
    weight: float | None = None
    color: str | None = None
    avatar_url: str | None = None
    allergies: list[str] = []
    chronic_conditions: list[str] = []
    microchip_id: str | None = None
    sterilized: bool | None = None
    diet: str | None = None
    medications: list[str] = []
    vaccines: list[str] = []
    vet_clinic: str | None = None
    emergency_contact: str | None = None
    notes: str | None = None
    created_at: datetime | None = None


def pet_document(owner_id: str, data: dict) -> dict:
    return {"owner_id": owner_id, **data, "created_at": now_utc()}
