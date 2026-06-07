from app.core.database import get_database
from app.models.common import now_utc


class SummaryRepository:
    @property
    def collection(self):
        return get_database()["pet_summaries"]

    async def upsert(self, owner_id: str, pet_id: str, data: dict) -> dict:
        payload = {**data, "owner_id": owner_id, "pet_id": pet_id, "updated_at": now_utc()}
        await self.collection.update_one({"owner_id": owner_id, "pet_id": pet_id}, {"$set": payload}, upsert=True)
        document = await self.collection.find_one({"owner_id": owner_id, "pet_id": pet_id})
        document["_id"] = str(document["_id"])
        return document

    async def get(self, owner_id: str, pet_id: str) -> dict | None:
        document = await self.collection.find_one({"owner_id": owner_id, "pet_id": pet_id})
        if document:
            document["_id"] = str(document["_id"])
        return document

    async def delete_for_pet(self, owner_id: str, pet_id: str) -> None:
        await self.collection.delete_many({"owner_id": owner_id, "pet_id": pet_id})
