from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

client: AsyncIOMotorClient | None = None
database = None


def _ensure_client() -> None:
    global client, database
    if client is None or database is None:
        client = AsyncIOMotorClient(settings.mongo_uri)
        database = client[settings.mongo_db]


async def connect_to_mongo() -> None:
    _ensure_client()
    await client.admin.command("ping")


async def close_mongo_connection() -> None:
    global client, database
    if client is not None:
        client.close()
        client = None
        database = None


def get_database():
    _ensure_client()
    if database is None:
        raise RuntimeError("MongoDB is not connected")
    return database
