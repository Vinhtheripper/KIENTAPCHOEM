import httpx

from app.core.config import settings


class EmbeddingsService:
    def _model_name(self) -> str:
        return settings.embedding_model.removeprefix("models/")

    async def embed(self, text: str) -> list[float] | None:
        if not settings.gemini_api_key or settings.gemini_api_key == "your-gemini-api-key":
            return None

        model = self._model_name()
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{settings.gemini_base_url}/models/{model}:embedContent",
                    headers={"x-goog-api-key": settings.gemini_api_key},
                    json={
                        "model": f"models/{model}",
                        "content": {"parts": [{"text": text}]},
                    },
                )
                response.raise_for_status()
                return response.json().get("embedding", {}).get("values")
        except Exception:
            return None
