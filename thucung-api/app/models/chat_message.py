from datetime import datetime

from app.models.common import MongoModel, now_utc


class ChatMessage(MongoModel):
    session_id: str
    pet_id: str
    owner_id: str
    role: str
    content: str
    citations: list[dict] = []
    created_at: datetime | None = None


def chat_message_document(session_id: str, pet_id: str, owner_id: str, role: str, content: str, citations=None) -> dict:
    return {
        "session_id": session_id,
        "pet_id": pet_id,
        "owner_id": owner_id,
        "role": role,
        "content": content,
        "citations": citations or [],
        "created_at": now_utc(),
    }
