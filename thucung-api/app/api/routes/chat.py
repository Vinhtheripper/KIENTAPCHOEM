from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag.rag_service import RagService
from app.services.repositories.chat_repository import ChatRepository

router = APIRouter()
rag = RagService()
chat_repository = ChatRepository()


@router.get("/sessions")
async def list_chat_sessions(pet_id: str | None = None, owner_id: str | None = None, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    return await chat_repository.list_sessions(
        owner_id=owner_id if is_admin else current_user["_id"],
        pet_id=pet_id,
        admin=is_admin,
    )


@router.get("/sessions/{session_id}/messages")
async def list_chat_messages(session_id: str, current_user: dict = Depends(get_current_user)):
    is_admin = current_user.get("role") == "admin"
    return await chat_repository.messages_for_session(session_id, current_user["_id"], admin=is_admin)


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, current_user: dict = Depends(get_current_user)):
    return await rag.answer(current_user["_id"], payload.pet_id, payload.message, payload.session_id)
