from fastapi import APIRouter, Depends

from app.api.deps import require_admin
from app.services.repositories.content_repository import ContentRepository
from app.services.repositories.pet_repository import PetRepository
from app.services.repositories.user_repository import UserRepository
from app.services.repositories.audit_repository import AuditRepository

router = APIRouter()
users = UserRepository()
pets = PetRepository()
content = ContentRepository()
audit = AuditRepository()


def attach_owner(rows: list[dict], user_rows: list[dict]) -> list[dict]:
    users_by_id = {user["_id"]: user for user in user_rows}
    enriched = []
    for row in rows:
        owner = users_by_id.get(row.get("owner_id"))
        enriched.append(
            {
                **row,
                "owner_name": owner.get("full_name") if owner else "Unknown owner",
                "owner_email": owner.get("email") if owner else None,
            }
        )
    return enriched


@router.get("/users")
async def list_users(_: dict = Depends(require_admin)):
    return await users.list_all()


@router.get("/pets")
async def list_all_pets(owner_id: str | None = None, _: dict = Depends(require_admin)):
    user_rows = await users.list_all()
    pet_rows = await pets.list_all(owner_id)
    return attach_owner(pet_rows, user_rows)


@router.get("/content")
async def list_all_content(owner_id: str | None = None, pet_id: str | None = None, _: dict = Depends(require_admin)):
    user_rows = await users.list_all()
    content_rows = await content.list_items(owner_id, pet_id, admin=True)
    return attach_owner(content_rows, user_rows)


@router.get("/audit")
async def list_audit_logs(action: str | None = None, pet_id: str | None = None, _: dict = Depends(require_admin)):
    user_rows = await users.list_all()
    users_by_id = {user["_id"]: user for user in user_rows}
    logs = await audit.list_recent(action=action, pet_id=pet_id)
    return [
        {
            **row,
            "actor_name": users_by_id.get(row.get("actor_id"), {}).get("full_name", row.get("actor_id")),
            "actor_email": users_by_id.get(row.get("actor_id"), {}).get("email"),
        }
        for row in logs
    ]
