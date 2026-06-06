from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

client: AsyncIOMotorClient | None = None
database = None


async def connect_to_mongo() -> None:
    global client, database
    client = AsyncIOMotorClient(settings.mongo_uri)
    database = client[settings.mongo_db]


async def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()
        client = None


def get_database():
    if database is None:
        raise RuntimeError("MongoDB is not connected")
    return database
