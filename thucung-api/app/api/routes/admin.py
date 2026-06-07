from fastapi import APIRouter, Depends

from app.api.deps import require_admin
from app.services.repositories.content_repository import ContentRepository
from app.services.repositories.pet_repository import PetRepository
from app.services.repositories.user_repository import UserRepository

router = APIRouter()
users = UserRepository()
pets = PetRepository()
content = ContentRepository()


@router.get("/users")
async def list_users(_: dict = Depends(require_admin)):
    return await users.list_all()


@router.get("/pets")
async def list_all_pets(owner_id: str | None = None, _: dict = Depends(require_admin)):
    return await pets.list_all(owner_id)


@router.get("/content")
async def list_all_content(owner_id: str | None = None, pet_id: str | None = None, _: dict = Depends(require_admin)):
    return await content.list_items(owner_id, pet_id, admin=True)
