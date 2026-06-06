import httpx

from app.core.config import settings


class GeminiService:
    def _has_api_key(self) -> bool:
        return bool(settings.gemini_api_key and settings.gemini_api_key != "your-gemini-api-key")

    async def generate(self, prompt: str) -> str:
        if not self._has_api_key():
            return (
                "Gemini API key is not configured. Please set GEMINI_API_KEY in the backend environment.\n\n"
                "This AI assistant does not replace professional veterinary diagnosis."
            )

        url = f"{settings.gemini_base_url}/models/{settings.gemini_model}:generateContent"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.35,
                "topP": 0.9,
                "maxOutputTokens": 1600,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    url,
                    headers={"x-goog-api-key": settings.gemini_api_key},
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
                parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                answer = "".join(part.get("text", "") for part in parts).strip()
                return answer or (
                    "Gemini returned an empty response. Please try again.\n\n"
                    "This AI assistant does not replace professional veterinary diagnosis."
                )
        except httpx.HTTPStatusError as exc:
            return (
                f"Gemini API error: {exc.response.status_code}. Check GEMINI_API_KEY, model name, and API quota.\n\n"
                "This AI assistant does not replace professional veterinary diagnosis."
            )
        except Exception:
            return (
                "I could not reach Gemini right now. Please check the backend network and Gemini API configuration.\n\n"
                "This AI assistant does not replace professional veterinary diagnosis."
            )
