from app.services.repositories.content_repository import ContentRepository
from app.services.rag.classifier import QueryClassifier


class RetrievalService:
    def __init__(self, content_repository: ContentRepository | None = None):
        self.content_repository = content_repository or ContentRepository()
        self.classifier = QueryClassifier()

    async def retrieve(self, owner_id: str, pet_id: str, query: str, limit: int = 5) -> list[dict]:
        query_terms = {term.lower() for term in query.split() if len(term) > 2}
        query_categories = self.classifier.classify(query)
        chunks = await self.content_repository.get_candidate_chunks_for_pet(owner_id, pet_id, query_categories)

        def score(chunk: dict) -> int:
            text = chunk.get("text", "").lower()
            metadata = chunk.get("metadata", {}) or {}
            metadata_text = " ".join(
                [
                    metadata.get("title", ""),
                    metadata.get("document_type", "") or "",
                    " ".join(metadata.get("labels", []) or []),
                    " ".join(metadata.get("categories", []) or []),
                ]
            ).lower()
            term_score = sum(1 for term in query_terms if term in text or term in metadata_text)
            category_score = len(query_categories.intersection(set(metadata.get("categories", []) or []))) * 4
            label_score = sum(2 for term in query_terms if term in metadata_text)
            return term_score + category_score + label_score

        ranked = sorted(chunks, key=score, reverse=True)
        positive = [chunk for chunk in ranked if score(chunk) > 0]
        return positive[:limit] or ranked[:limit]
