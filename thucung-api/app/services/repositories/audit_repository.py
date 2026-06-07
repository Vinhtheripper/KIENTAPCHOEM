from app.core.database import get_database
from app.models.common import now_utc


class AuditRepository:
    @property
    def collection(self):
        return get_database()["audit_logs"]

    async def log(
        self,
        actor_id: str,
        action: str,
        entity_type: str,
        entity_id: str | None = None,
        owner_id: str | None = None,
        pet_id: str | None = None,
        detail: dict | None = None,
    ) -> None:
        await self.collection.insert_one(
            {
                "actor_id": actor_id,
                "action": action,
                "entity_type": entity_type,
                "entity_id": entity_id,
                "owner_id": owner_id,
                "pet_id": pet_id,
                "detail": detail or {},
                "created_at": now_utc(),
            }
        )

    async def list_recent(self, limit: int = 120) -> list[dict]:
        rows = []
        async for document in self.collection.find({}).sort("created_at", -1).limit(limit):
            document["_id"] = str(document["_id"])
            rows.append(document)
        return rows
