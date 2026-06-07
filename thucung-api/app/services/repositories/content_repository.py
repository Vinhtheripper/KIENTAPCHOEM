from bson import ObjectId

from app.core.database import get_database


class ContentRepository:
    @property
    def items(self):
        return get_database()["content_items"]

    @property
    def chunks(self):
        return get_database()["content_chunks"]

    async def create_item(self, data: dict) -> dict:
        result = await self.items.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    async def mark_item(self, content_id: str, status: str, metadata: dict | None = None) -> None:
        update = {"status": status}
        if metadata is not None:
            update["metadata"] = metadata
        await self.items.update_one({"_id": ObjectId(content_id)}, {"$set": update})

    async def update_metadata(self, content_id: str, owner_id: str | None, metadata: dict, admin: bool = False) -> dict | None:
        query = {"_id": ObjectId(content_id)}
        if not admin:
            query["owner_id"] = owner_id
        await self.items.update_one(query, {"$set": {"metadata": metadata}})
        return await self.get_item(content_id, owner_id, admin=admin)

    async def sync_chunk_metadata(self, content_id: str, owner_id: str | None, metadata: dict, admin: bool = False) -> None:
        query = {"content_id": content_id}
        if not admin:
            query["owner_id"] = owner_id
        await self.chunks.update_many(
            query,
            {
                "$set": {
                    "metadata.document_type": metadata.get("document_type"),
                    "metadata.document_date": metadata.get("document_date"),
                    "metadata.labels": metadata.get("labels", []),
                    "metadata.categories": metadata.get("categories", []),
                }
            },
        )

    async def list_items(self, owner_id: str | None, pet_id: str | None = None, admin: bool = False) -> list[dict]:
        query = {} if admin else {"owner_id": owner_id}
        if owner_id and admin:
            query["owner_id"] = owner_id
        if pet_id:
            query["pet_id"] = pet_id
        rows = []
        async for document in self.items.find(query).sort("created_at", -1):
            document["_id"] = str(document["_id"])
            rows.append(document)
        return rows

    async def get_item(self, content_id: str, owner_id: str | None = None, admin: bool = False) -> dict | None:
        query = {"_id": ObjectId(content_id)}
        if not admin:
            query["owner_id"] = owner_id
        document = await self.items.find_one(query)
        if document:
            document["_id"] = str(document["_id"])
        return document

    async def get_chunks_for_content(self, content_id: str, owner_id: str | None = None, admin: bool = False) -> list[dict]:
        query = {"content_id": content_id}
        if not admin:
            query["owner_id"] = owner_id
        rows = []
        async for document in self.chunks.find(query).sort("chunk_index", 1):
            document["_id"] = str(document["_id"])
            rows.append(document)
        return rows

    async def save_chunks(self, chunks: list[dict]) -> None:
        if chunks:
            await self.chunks.insert_many(chunks)

    async def delete_chunks_for_content(self, content_id: str, owner_id: str | None = None, admin: bool = False) -> None:
        query = {"content_id": content_id}
        if not admin:
            query["owner_id"] = owner_id
        await self.chunks.delete_many(query)

    async def get_chunks_for_pet(self, owner_id: str, pet_id: str, limit: int = 500) -> list[dict]:
        rows = []
        async for document in self.chunks.find({"owner_id": owner_id, "pet_id": pet_id}).limit(limit):
            document["_id"] = str(document["_id"])
            rows.append(document)
        return rows

    async def get_candidate_chunks_for_pet(self, owner_id: str, pet_id: str, categories: set[str] | None = None, limit: int = 150) -> list[dict]:
        query = {"owner_id": owner_id, "pet_id": pet_id}
        if categories:
            query["metadata.categories"] = {"$in": list(categories)}
        rows = []
        async for document in self.chunks.find(query).sort("created_at", -1).limit(limit):
            document["_id"] = str(document["_id"])
            rows.append(document)
        if rows or not categories:
            return rows
        return await self.get_candidate_chunks_for_pet(owner_id, pet_id, categories=None, limit=limit)

    async def delete_for_pet(self, owner_id: str, pet_id: str) -> None:
        await self.items.delete_many({"owner_id": owner_id, "pet_id": pet_id})
        await self.chunks.delete_many({"owner_id": owner_id, "pet_id": pet_id})
