from collections import Counter

from app.services.repositories.content_repository import ContentRepository
from app.services.repositories.pet_repository import PetRepository
from app.services.repositories.summary_repository import SummaryRepository
from app.services.repositories.timeline_repository import TimelineRepository


class PetSummaryService:
    def __init__(self):
        self.pets = PetRepository()
        self.content = ContentRepository()
        self.timeline = TimelineRepository()
        self.summaries = SummaryRepository()

    async def build(self, owner_id: str, pet_id: str, admin: bool = False) -> dict | None:
        pet = await self.pets.get(pet_id, owner_id, admin=admin)
        if not pet:
            return None
        actual_owner_id = pet["owner_id"]
        content_items = await self.content.list_items(actual_owner_id, pet_id)
        timeline_events = await self.timeline.list_for_pet(actual_owner_id, pet_id)

        types = Counter((item.get("metadata") or {}).get("document_type") or item.get("type") or "content" for item in content_items)
        categories = Counter()
        for item in content_items:
            for category in (item.get("metadata") or {}).get("categories", []) or []:
                categories[category] += 1

        upcoming = [
            {
                "title": event.get("title"),
                "type": event.get("type"),
                "date": event.get("date"),
                "status": event.get("status", "planned"),
                "notes": event.get("notes"),
            }
            for event in timeline_events
            if event.get("status") in {"planned", "overdue"}
        ][:8]

        payload = {
            "pet_name": pet.get("name"),
            "species": pet.get("species"),
            "breed": pet.get("breed"),
            "gender": pet.get("gender"),
            "weight": pet.get("weight"),
            "allergies": pet.get("allergies", []),
            "chronic_conditions": pet.get("chronic_conditions", []),
            "medications": pet.get("medications", []),
            "vaccines": pet.get("vaccines", []),
            "diet": pet.get("diet"),
            "vet_clinic": pet.get("vet_clinic"),
            "profile_notes": pet.get("notes"),
            "content_count": len(content_items),
            "content_types": dict(types),
            "dominant_categories": [category for category, _ in categories.most_common(6)],
            "upcoming_care": upcoming,
            "summary_text": self.render_text(pet, content_items, upcoming, types),
        }
        return await self.summaries.upsert(actual_owner_id, pet_id, payload)

    def render_text(self, pet: dict, content_items: list[dict], upcoming: list[dict], types: Counter) -> str:
        lines = [
            f"Pet: {pet.get('name')} ({pet.get('species') or 'unknown species'}{', ' + pet.get('breed') if pet.get('breed') else ''})",
        ]
        if pet.get("weight"):
            lines.append(f"Weight: {pet.get('weight')} kg")
        if pet.get("allergies"):
            lines.append(f"Allergies: {', '.join(pet.get('allergies', []))}")
        if pet.get("chronic_conditions"):
            lines.append(f"Chronic conditions: {', '.join(pet.get('chronic_conditions', []))}")
        if pet.get("medications"):
            lines.append(f"Medications: {', '.join(pet.get('medications', []))}")
        if pet.get("vaccines"):
            lines.append(f"Profile vaccines: {', '.join(pet.get('vaccines', []))}")
        if types:
            lines.append("Uploaded knowledge: " + ", ".join(f"{key}={value}" for key, value in types.items()))
        if upcoming:
            lines.append("Upcoming care: " + "; ".join(f"{event.get('date') or 'no date'} {event.get('title')}" for event in upcoming[:5]))
        if pet.get("notes"):
            lines.append(f"Profile notes: {pet.get('notes')}")
        return "\n".join(lines)
