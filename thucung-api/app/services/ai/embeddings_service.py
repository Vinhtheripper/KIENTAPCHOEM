import httpx

from app.core.config import settings


class EmbeddingsService:
    async def embed(self, text: str) -> list[float] | None:
        if not settings.gemini_api_key or settings.gemini_api_key == "your-gemini-api-key":
            return None

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{settings.gemini_base_url}/models/{settings.embedding_model}:embedContent",
                    headers={"x-goog-api-key": settings.gemini_api_key},
                    json={
                        "model": f"models/{settings.embedding_model}",
                        "content": {"parts": [{"text": text}]},
                    },
                )
                response.raise_for_status()
                return response.json().get("embedding", {}).get("values")
        except Exception:
            return None
