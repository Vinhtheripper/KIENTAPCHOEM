from bson import ObjectId

from app.core.database import get_database


class PetRepository:
    @property
    def collection(self):
        return get_database()["pets"]

    async def create(self, data: dict) -> dict:
        result = await self.collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    async def list_for_owner(self, owner_id: str) -> list[dict]:
        pets = []
        async for document in self.collection.find({"owner_id": owner_id}).sort("created_at", -1):
            document["_id"] = str(document["_id"])
            pets.append(document)
        return pets

    async def list_all(self, owner_id: str | None = None) -> list[dict]:
        query = {}
        if owner_id:
            query["owner_id"] = owner_id
        pets = []
        async for document in self.collection.find(query).sort("created_at", -1):
            document["_id"] = str(document["_id"])
            pets.append(document)
        return pets

    async def update(self, pet_id: str, owner_id: str, data: dict) -> dict | None:
        await self.collection.update_one({"_id": ObjectId(pet_id), "owner_id": owner_id}, {"$set": data})
        document = await self.collection.find_one({"_id": ObjectId(pet_id), "owner_id": owner_id})
        if document:
            document["_id"] = str(document["_id"])
        return document

    async def get(self, pet_id: str, owner_id: str | None = None, admin: bool = False) -> dict | None:
        query = {"_id": ObjectId(pet_id)}
        if not admin:
            query["owner_id"] = owner_id
        document = await self.collection.find_one(query)
        if document:
            document["_id"] = str(document["_id"])
        return document

    async def delete(self, pet_id: str, owner_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(pet_id), "owner_id": owner_id})
        return result.deleted_count == 1
