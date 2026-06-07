from bson import ObjectId
from datetime import date

from app.core.database import get_database
from app.models.common import now_utc


class TimelineRepository:
    @property
    def collection(self):
        return get_database()["timeline_events"]

    async def create(self, data: dict) -> dict:
        result = await self.collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    def apply_business_status(self, document: dict) -> dict:
        if document.get("status") == "planned" and document.get("date"):
            try:
                if date.fromisoformat(str(document["date"])[:10]) < date.today():
                    document["status"] = "overdue"
            except ValueError:
                pass
        return document

    async def list_for_pet(self, owner_id: str | None, pet_id: str, admin: bool = False) -> list[dict]:
        query = {"pet_id": pet_id}
        if not admin:
            query["owner_id"] = owner_id
        rows = []
        async for document in self.collection.find(query).sort("date", -1):
            document["_id"] = str(document["_id"])
            rows.append(self.apply_business_status(document))
        return rows

    async def get(self, event_id: str, owner_id: str | None, admin: bool = False) -> dict | None:
        query = {"_id": ObjectId(event_id)}
        if not admin:
            query["owner_id"] = owner_id
        document = await self.collection.find_one(query)
        if document:
            document["_id"] = str(document["_id"])
            document = self.apply_business_status(document)
        return document

    async def update(self, event_id: str, owner_id: str | None, data: dict, admin: bool = False) -> dict | None:
        query = {"_id": ObjectId(event_id)}
        if not admin:
            query["owner_id"] = owner_id
        cleaned = {key: value for key, value in data.items() if value is not None}
        cleaned["updated_at"] = now_utc()
        await self.collection.update_one(query, {"$set": cleaned})
        return await self.get(event_id, owner_id, admin=admin)

    async def delete(self, event_id: str, owner_id: str | None, admin: bool = False) -> bool:
        query = {"_id": ObjectId(event_id)}
        if not admin:
            query["owner_id"] = owner_id
        result = await self.collection.delete_one(query)
        return result.deleted_count == 1

    async def upcoming_for_pet(self, owner_id: str, pet_id: str, limit: int = 8) -> list[dict]:
        rows = []
        async for document in self.collection.find({"owner_id": owner_id, "pet_id": pet_id, "status": {"$in": ["planned", "overdue"]}}).sort("date", 1).limit(limit):
            document["_id"] = str(document["_id"])
            rows.append(self.apply_business_status(document))
        return rows

    async def delete_for_pet(self, owner_id: str, pet_id: str) -> None:
        await self.collection.delete_many({"owner_id": owner_id, "pet_id": pet_id})
