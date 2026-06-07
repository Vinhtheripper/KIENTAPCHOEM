from app.services.ai.gemini_service import GeminiService
from app.services.rag.prompts import build_rag_prompt
from app.services.rag.retrieval import RetrievalService
from app.services.repositories.chat_repository import ChatRepository
from app.services.repositories.pet_repository import PetRepository
from app.services.repositories.timeline_repository import TimelineRepository
from app.services.pet_summary_service import PetSummaryService


DISCLAIMER = "This AI assistant does not replace professional veterinary diagnosis."


class RagService:
    def __init__(self):
        self.retrieval = RetrievalService()
        self.ai = GeminiService()
        self.chat_repository = ChatRepository()
        self.pet_repository = PetRepository()
        self.timeline_repository = TimelineRepository()
        self.summary_service = PetSummaryService()

    def fast_profile_answer(self, message: str, pet_profile: dict | None, timeline_events: list[dict]) -> str | None:
        if not pet_profile:
            return None
        text = message.lower()
        name = pet_profile.get("name", "this pet")
        checks = {
            "name": ["tên", "ten", "name"],
            "weight": ["cân nặng", "can nang", "weight", "kg"],
            "allergies": ["dị ứng", "di ung", "allerg"],
            "medications": ["thuốc", "thuoc", "medication", "medicine"],
            "vaccines": ["vaccine", "vaccin", "tiêm", "tiem", "vaccination"],
            "diet": ["ăn", "an ", "diet", "food", "thức ăn", "thuc an"],
            "clinic": ["phòng khám", "phong kham", "clinic", "vet"],
        }

        def has_any(words: list[str]) -> bool:
            return any(word in text for word in words)

        if has_any(checks["name"]) and ("là gì" in text or "la gi" in text or "what" in text):
            return f"Pet đang chọn là {name}.\n\n{DISCLAIMER}"
        if has_any(checks["weight"]):
            weight = pet_profile.get("weight")
            return f"{name} hiện có cân nặng: {weight} kg.\n\n{DISCLAIMER}" if weight else f"Hồ sơ của {name} chưa có cân nặng.\n\n{DISCLAIMER}"
        if has_any(checks["allergies"]):
            allergies = pet_profile.get("allergies") or []
            value = ", ".join(allergies) if allergies else "chưa ghi nhận dị ứng"
            return f"Dị ứng của {name}: {value}.\n\n{DISCLAIMER}"
        if has_any(checks["medications"]):
            meds = pet_profile.get("medications") or []
            value = ", ".join(meds) if meds else "chưa ghi nhận thuốc đang dùng"
            return f"Thuốc đang dùng của {name}: {value}.\n\n{DISCLAIMER}"
        if has_any(checks["vaccines"]):
            vaccines = pet_profile.get("vaccines") or []
            timeline_vaccines = [
                f"{event.get('title')} ({event.get('date') or 'no date'}, {event.get('status', 'planned')})"
                for event in timeline_events
                if "vacc" in str(event.get("type", "")).lower() or "tiêm" in str(event.get("title", "")).lower()
            ]
            merged = vaccines + timeline_vaccines
            value = "; ".join(merged) if merged else "chưa có dữ liệu vaccine/lịch tiêm"
            return f"Thông tin vaccine/lịch tiêm của {name}: {value}.\n\n{DISCLAIMER}"
        if has_any(checks["diet"]):
            diet = pet_profile.get("diet")
            return f"Chế độ ăn của {name}: {diet}.\n\n{DISCLAIMER}" if diet else f"Hồ sơ của {name} chưa có thông tin chế độ ăn.\n\n{DISCLAIMER}"
        if has_any(checks["clinic"]):
            clinic = pet_profile.get("vet_clinic")
            return f"Phòng khám/bác sĩ của {name}: {clinic}.\n\n{DISCLAIMER}" if clinic else f"Hồ sơ của {name} chưa có phòng khám/bác sĩ phụ trách.\n\n{DISCLAIMER}"
        return None

    async def answer(self, owner_id: str, pet_id: str, message: str, session_id: str | None = None) -> dict:
        session_id = await self.chat_repository.ensure_session(owner_id, pet_id, session_id)
        history = await self.chat_repository.recent_messages(session_id)
        pet_profile = await self.pet_repository.get(pet_id, owner_id)
        timeline_events = await self.timeline_repository.upcoming_for_pet(owner_id, pet_id)
        medical_summary = await self.summary_service.build(owner_id, pet_id)
        fast_answer = self.fast_profile_answer(message, pet_profile, timeline_events)
        if fast_answer:
            await self.chat_repository.add_message(session_id, pet_id, owner_id, "user", message)
            await self.chat_repository.add_message(session_id, pet_id, owner_id, "assistant", fast_answer, [])
            return {"session_id": session_id, "answer": fast_answer, "citations": []}
        chunks = await self.retrieval.retrieve(owner_id, pet_id, message)
        prompt = build_rag_prompt(message, chunks, history, pet_profile, timeline_events, medical_summary)
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
