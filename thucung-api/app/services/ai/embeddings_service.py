import httpx

from app.core.config import settings


class EmbeddingsService:
    async def embed(self, text: str) -> list[float] | None:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{settings.ollama_base_url}/api/embeddings",
                    json={"model": settings.embedding_model, "prompt": text},
                )
                response.raise_for_status()
                return response.json().get("embedding")
        except Exception:
            return None
