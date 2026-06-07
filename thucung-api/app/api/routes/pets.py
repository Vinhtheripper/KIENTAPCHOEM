from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.deps import get_current_user
from app.models.pet import pet_document
from app.schemas.pet import PetCreate, PetUpdate
from app.services.repositories.chat_repository import ChatRepository
from app.services.repositories.content_repository import ContentRepository
from app.services.repositories.pet_repository import PetRepository
from app.services.storage.local_storage import LocalStorage

router = APIRouter()
pets = PetRepository()
content = ContentRepository()
chat = ChatRepository()
storage = LocalStorage()


@router.get("")
async def list_pets(current_user: dict = Depends(get_current_user)):
    return await pets.list_for_owner(current_user["_id"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_pet(payload: PetCreate, current_user: dict = Depends(get_current_user)):
    return await pets.create(pet_document(current_user["_id"], payload.model_dump(exclude_none=True)))


@router.patch("/{pet_id}")
async def update_pet(pet_id: str, payload: PetUpdate, current_user: dict = Depends(get_current_user)):
    pet = await pets.update(pet_id, current_user["_id"], payload.model_dump(exclude_none=True))
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet


@router.post("/{pet_id}/avatar")
async def upload_pet_avatar(pet_id: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    pet = await pets.get(pet_id, current_user["_id"])
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    saved_path = await storage.save_upload(file, current_user["_id"], pet_id)
    relative_path = Path(saved_path).as_posix()
    if relative_path.startswith("uploads/"):
        avatar_url = f"/{relative_path}"
    else:
        avatar_url = f"/uploads/{relative_path}"
    updated = await pets.update(pet_id, current_user["_id"], {"avatar_url": avatar_url})
    return updated


@router.delete("/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(pet_id: str, current_user: dict = Depends(get_current_user)):
    owner_id = current_user["_id"]
    deleted = await pets.delete(pet_id, owner_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Pet not found")
    await content.delete_for_pet(owner_id, pet_id)
    await chat.delete_for_pet(owner_id, pet_id)
