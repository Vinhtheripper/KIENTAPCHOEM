from bson import ObjectId

from app.core.database import get_database


class UserRepository:
    @property
    def collection(self):
        return get_database()["users"]

    async def create(self, data: dict) -> dict:
        result = await self.collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    async def find_by_email(self, email: str) -> dict | None:
        document = await self.collection.find_one({"email": email.lower()})
        if document:
            document["_id"] = str(document["_id"])
        return document

    async def find_by_id(self, user_id: str) -> dict | None:
        document = await self.collection.find_one({"_id": ObjectId(user_id)})
        if document:
            document["_id"] = str(document["_id"])
        return document

    async def list_all(self) -> list[dict]:
        users = []
        async for document in self.collection.find({}).sort("created_at", -1):
            document["_id"] = str(document["_id"])
            document.pop("password_hash", None)
            users.append(document)
        return users
