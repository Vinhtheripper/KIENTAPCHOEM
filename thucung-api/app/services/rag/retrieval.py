from app.services.repositories.content_repository import ContentRepository


class RetrievalService:
    def __init__(self, content_repository: ContentRepository | None = None):
        self.content_repository = content_repository or ContentRepository()

    async def retrieve(self, owner_id: str, pet_id: str, query: str, limit: int = 5) -> list[dict]:
        chunks = await self.content_repository.get_chunks_for_pet(owner_id, pet_id)
        query_terms = {term.lower() for term in query.split() if len(term) > 2}

        def score(chunk: dict) -> int:
            text = chunk.get("text", "").lower()
            return sum(1 for term in query_terms if term in text)

        ranked = sorted(chunks, key=score, reverse=True)
        return [chunk for chunk in ranked[:limit] if score(chunk) > 0] or ranked[:limit]
