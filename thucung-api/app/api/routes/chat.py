from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag.rag_service import RagService

router = APIRouter()
rag = RagService()


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, current_user: dict = Depends(get_current_user)):
    return await rag.answer(current_user["_id"], payload.pet_id, payload.message, payload.session_id)
