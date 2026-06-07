from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.services.repositories.content_repository import ContentRepository
from app.services.repositories.pet_repository import PetRepository

router = APIRouter()
pets = PetRepository()
content = ContentRepository()


@router.get("")
async def medical_timeline(pet_id: str, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    pet = await pets.get(pet_id, current_user["_id"], admin=is_admin)
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    items = await content.list_items(current_user["_id"], pet_id, admin=is_admin)
    events = []

    for item in items:
        metadata = item.get("metadata") or {}
        event_type = metadata.get("document_type") or item.get("type") or "content"
        events.append(
            {
                "id": item["_id"],
                "source": "content",
                "type": event_type,
                "title": item.get("title", "Uploaded content"),
                "date": metadata.get("document_date") or item.get("created_at"),
                "status": item.get("status"),
                "labels": metadata.get("labels", []),
                "notes": metadata.get("notes"),
                "content_id": item["_id"],
            }
        )

    for vaccine in pet.get("vaccines", []) or []:
        events.append(
            {
                "id": f"pet-vaccine-{vaccine}",
                "source": "pet_profile",
                "type": "vaccination",
                "title": vaccine,
                "date": pet.get("updated_at") or pet.get("created_at"),
                "status": "profile",
                "labels": ["pet_profile"],
                "notes": "From structured pet profile",
            }
        )

    if pet.get("notes"):
        events.append(
            {
                "id": f"pet-note-{pet['_id']}",
                "source": "pet_profile",
                "type": "profile_note",
                "title": "Pet profile notes",
                "date": pet.get("updated_at") or pet.get("created_at"),
                "status": "profile",
                "labels": ["pet_profile"],
                "notes": pet.get("notes"),
            }
        )

    events.sort(key=lambda item: str(item.get("date") or ""), reverse=True)
    return {"pet": pet, "events": events}
