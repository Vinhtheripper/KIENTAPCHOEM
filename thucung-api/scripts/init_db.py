import asyncio
import sys
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.core.config import settings  # noqa: E402


COLLECTIONS = [
    "users",
    "pets",
    "content_items",
    "content_chunks",
    "chat_sessions",
    "chat_messages",
    "vector_indexes",
    "notifications",
]


async def create_collection_if_missing(db, name: str) -> None:
    existing = await db.list_collection_names()
    if name not in existing:
        await db.create_collection(name)
        print(f"created collection: {name}")
    else:
        print(f"collection exists: {name}")


async def create_indexes(db) -> None:
    await db.users.create_index([("email", ASCENDING)], unique=True, name="uniq_users_email")
    await db.pets.create_index([("owner_id", ASCENDING), ("created_at", DESCENDING)], name="idx_pets_owner_created")
    await db.content_items.create_index(
        [("owner_id", ASCENDING), ("pet_id", ASCENDING), ("created_at", DESCENDING)],
        name="idx_content_items_owner_pet_created",
    )
    await db.content_items.create_index([("status", ASCENDING)], name="idx_content_items_status")
    await db.content_chunks.create_index(
        [("owner_id", ASCENDING), ("pet_id", ASCENDING), ("content_id", ASCENDING)],
        name="idx_content_chunks_owner_pet_content",
    )
    await db.chat_sessions.create_index(
        [("owner_id", ASCENDING), ("pet_id", ASCENDING), ("session_id", ASCENDING)],
        name="idx_chat_sessions_owner_pet_session",
    )
    await db.chat_messages.create_index(
        [("session_id", ASCENDING), ("created_at", ASCENDING)],
        name="idx_chat_messages_session_created",
    )
    await db.notifications.create_index(
        [("owner_id", ASCENDING), ("pet_id", ASCENDING), ("created_at", DESCENDING)],
        name="idx_notifications_owner_pet_created",
    )
    print("indexes ready")


async def main() -> None:
    client = AsyncIOMotorClient(settings.mongo_uri)
    try:
        await client.admin.command("ping")
        db = client[settings.mongo_db]
        print(f"connected to MongoDB database: {settings.mongo_db}")
        for collection in COLLECTIONS:
            await create_collection_if_missing(db, collection)
        await create_indexes(db)
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
