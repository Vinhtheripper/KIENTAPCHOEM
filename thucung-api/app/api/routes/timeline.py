from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.models.timeline_event import timeline_event_document
from app.schemas.timeline import TimelineEventCreate, TimelineEventUpdate
from app.services.repositories.content_repository import ContentRepository
from app.services.repositories.audit_repository import AuditRepository
from app.services.repositories.pet_repository import PetRepository
from app.services.repositories.timeline_repository import TimelineRepository
from app.services.pet_summary_service import PetSummaryService

router = APIRouter()
pets = PetRepository()
content = ContentRepository()
timeline = TimelineRepository()
audit = AuditRepository()
summary_service = PetSummaryService()


def normalize_event_type(value: str | None) -> str:
    return (value or "medical_note").strip().lower()


def timeline_event_row(event: dict) -> dict:
    content_ids = event.get("content_ids") or []
    if event.get("related_content_id") and event.get("related_content_id") not in content_ids:
        content_ids = [event.get("related_content_id"), *content_ids]
    return {
        "id": event["_id"],
        "source": "timeline_event",
        "type": normalize_event_type(event.get("type")),
        "title": event.get("title", "Timeline event"),
        "date": event.get("date") or event.get("created_at"),
        "status": event.get("status", "planned"),
        "labels": event.get("labels", []),
        "notes": event.get("notes"),
        "content_id": content_ids[0] if content_ids else None,
        "content_ids": content_ids,
        "event_id": event["_id"],
        "created_by": event.get("created_by"),
    }


@router.get("")
async def medical_timeline(pet_id: str, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    pet = await pets.get(pet_id, current_user["_id"], admin=is_admin)
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    items = await content.list_items(current_user["_id"], pet_id, admin=is_admin)
    event_rows = await timeline.list_for_pet(current_user["_id"], pet_id, admin=is_admin)
    events = [timeline_event_row(event) for event in event_rows]

    for item in items:
        metadata = item.get("metadata") or {}
        event_type = normalize_event_type(metadata.get("document_type") or item.get("type") or "content")
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


@router.post("/events")
async def create_timeline_event(payload: TimelineEventCreate, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    pet = await pets.get(payload.pet_id, current_user["_id"], admin=is_admin)
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    data = payload.model_dump()
    pet_id = data.pop("pet_id")
    data["type"] = normalize_event_type(data.get("type"))
    if data.get("related_content_id") and data["related_content_id"] not in data.get("content_ids", []):
        data["content_ids"] = [data["related_content_id"], *(data.get("content_ids") or [])]
    event = await timeline.create(timeline_event_document(pet["owner_id"], pet_id, data, current_user["_id"]))
    await summary_service.build(pet["owner_id"], pet_id, admin=True)
    await audit.log(current_user["_id"], "create", "timeline_event", event["_id"], pet["owner_id"], pet_id, {"type": event.get("type"), "title": event.get("title")})
    return timeline_event_row(event)


@router.patch("/events/{event_id}")
async def update_timeline_event(event_id: str, payload: TimelineEventUpdate, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    event = await timeline.get(event_id, current_user["_id"], admin=is_admin)
    if not event:
        raise HTTPException(status_code=404, detail="Timeline event not found")
    data = payload.model_dump()
    if data.get("related_content_id") and data["related_content_id"] not in (data.get("content_ids") or []):
        data["content_ids"] = [data["related_content_id"], *(data.get("content_ids") or [])]
    updated = await timeline.update(event_id, current_user["_id"], data, admin=is_admin)
    await summary_service.build(updated["owner_id"], updated["pet_id"], admin=True)
    await audit.log(current_user["_id"], "update", "timeline_event", event_id, updated["owner_id"], updated["pet_id"], data)
    return timeline_event_row(updated)


@router.delete("/events/{event_id}")
async def delete_timeline_event(event_id: str, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    event = await timeline.get(event_id, current_user["_id"], admin=is_admin)
    deleted = await timeline.delete(event_id, current_user["_id"], admin=is_admin)
    if not deleted:
        raise HTTPException(status_code=404, detail="Timeline event not found")
    if event:
        await summary_service.build(event["owner_id"], event["pet_id"], admin=True)
        await audit.log(current_user["_id"], "delete", "timeline_event", event_id, event["owner_id"], event["pet_id"])
    return {"ok": True}
