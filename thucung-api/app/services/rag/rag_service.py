from app.services.ai.gemini_service import GeminiService
from app.services.rag.prompts import build_rag_prompt
from app.services.rag.retrieval import RetrievalService
from app.services.repositories.chat_repository import ChatRepository
from app.services.repositories.pet_repository import PetRepository


class RagService:
    def __init__(self):
        self.retrieval = RetrievalService()
        self.ai = GeminiService()
        self.chat_repository = ChatRepository()
        self.pet_repository = PetRepository()

    async def answer(self, owner_id: str, pet_id: str, message: str, session_id: str | None = None) -> dict:
        session_id = await self.chat_repository.ensure_session(owner_id, pet_id, session_id)
        history = await self.chat_repository.recent_messages(session_id)
        pet_profile = await self.pet_repository.get(pet_id, owner_id)
        chunks = await self.retrieval.retrieve(owner_id, pet_id, message)
        prompt = build_rag_prompt(message, chunks, history, pet_profile)
        answer = await self.ai.generate(prompt)
        citations = [
            {
                "content_id": chunk.get("content_id"),
                "title": chunk.get("metadata", {}).get("title", "Uploaded content"),
                "chunk_index": chunk.get("chunk_index"),
            }
            for chunk in chunks
        ]
        await self.chat_repository.add_message(session_id, pet_id, owner_id, "user", message)
        await self.chat_repository.add_message(session_id, pet_id, owner_id, "assistant", answer, citations)
        return {"session_id": session_id, "answer": answer, "citations": citations}
