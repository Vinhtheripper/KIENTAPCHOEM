import httpx

from app.core.config import settings


class OllamaService:
    async def generate(self, prompt: str) -> str:
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    f"{settings.ollama_base_url}/api/generate",
                    json={"model": settings.ollama_model, "prompt": prompt, "stream": False},
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", "").strip()
        except Exception:
            return (
                "I could not reach Ollama right now. Based on the available records, "
                "please review the uploaded content and consult a veterinarian for urgent symptoms.\n\n"
                "This AI assistant does not replace professional veterinary diagnosis."
            )
