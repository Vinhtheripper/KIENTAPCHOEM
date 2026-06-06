from pydantic import BaseModel


class ChatRequest(BaseModel):
    pet_id: str
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    citations: list[dict] = []
