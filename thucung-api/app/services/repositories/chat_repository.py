from uuid import uuid4

from app.core.database import get_database
from app.models.chat_message import chat_message_document
from app.models.common import now_utc


class ChatRepository:
    @property
    def sessions(self):
        return get_database()["chat_sessions"]

    @property
    def messages(self):
        return get_database()["chat_messages"]

    async def ensure_session(self, owner_id: str, pet_id: str, session_id: str | None = None) -> str:
        if session_id:
            return session_id
        new_session_id = str(uuid4())
        await self.sessions.insert_one({"session_id": new_session_id, "owner_id": owner_id, "pet_id": pet_id, "created_at": now_utc(), "updated_at": now_utc()})
        return new_session_id

    async def add_message(self, session_id: str, pet_id: str, owner_id: str, role: str, content: str, citations=None) -> None:
        await self.messages.insert_one(chat_message_document(session_id, pet_id, owner_id, role, content, citations))
        await self.sessions.update_one({"session_id": session_id}, {"$set": {"updated_at": now_utc(), "last_message": content[:160]}})

    async def recent_messages(self, session_id: str, limit: int = 12) -> list[dict]:
        rows = []
        cursor = self.messages.find({"session_id": session_id}).sort("created_at", -1).limit(limit)
        async for document in cursor:
            document["_id"] = str(document["_id"])
            rows.append(document)
        return list(reversed(rows))

    async def delete_for_pet(self, owner_id: str, pet_id: str) -> None:
        await self.sessions.delete_many({"owner_id": owner_id, "pet_id": pet_id})
        await self.messages.delete_many({"owner_id": owner_id, "pet_id": pet_id})

    async def list_sessions(self, owner_id: str | None = None, pet_id: str | None = None, admin: bool = False) -> list[dict]:
        query = {} if admin else {"owner_id": owner_id}
        if owner_id and admin:
            query["owner_id"] = owner_id
        if pet_id:
            query["pet_id"] = pet_id
        rows = []
        async for document in self.sessions.find(query).sort("updated_at", -1):
            document["_id"] = str(document["_id"])
            rows.append(document)
        return rows

    async def messages_for_session(self, session_id: str, owner_id: str | None = None, admin: bool = False) -> list[dict]:
        query = {"session_id": session_id}
        if not admin:
            query["owner_id"] = owner_id
        rows = []
        async for document in self.messages.find(query).sort("created_at", 1):
            document["_id"] = str(document["_id"])
            rows.append(document)
        return rows
