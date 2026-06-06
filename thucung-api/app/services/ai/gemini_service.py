import httpx

from app.core.config import settings


class GeminiService:
    fallback_models = ("gemini-2.5-flash", "gemini-2.0-flash")

    def _has_api_key(self) -> bool:
        return bool(settings.gemini_api_key and settings.gemini_api_key != "your-gemini-api-key")

    def _model_name(self) -> str:
        return settings.gemini_model.removeprefix("models/")

    def _candidate_models(self) -> list[str]:
        models = [self._model_name(), *self.fallback_models]
        deduped = []
        for model in models:
            normalized = model.removeprefix("models/").strip()
            if normalized and normalized not in deduped:
                deduped.append(normalized)
        return deduped

    async def generate(self, prompt: str) -> str:
        if not self._has_api_key():
            return (
                "Gemini API key is not configured. Please set GEMINI_API_KEY in the backend environment.\n\n"
                "This AI assistant does not replace professional veterinary diagnosis."
            )

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

        errors = []
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                for model in self._candidate_models():
                    url = f"{settings.gemini_base_url}/models/{model}:generateContent"
                    response = await client.post(
                        url,
                        headers={"x-goog-api-key": settings.gemini_api_key},
                        json=payload,
                    )
                    if response.status_code == 404:
                        errors.append(self._format_http_error(response, model))
                        continue
                    response.raise_for_status()
                    data = response.json()
                    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
                    answer = "".join(part.get("text", "") for part in parts).strip()
                    return answer or (
                        "Gemini returned an empty response. Please try again.\n\n"
                        "This AI assistant does not replace professional veterinary diagnosis."
                    )
                return (
                    "Gemini API error: no configured model was available. Tried: "
                    f"{', '.join(self._candidate_models())}. Details: {' | '.join(errors)}\n\n"
                    "This AI assistant does not replace professional veterinary diagnosis."
                )
        except httpx.HTTPStatusError as exc:
            return (
                f"{self._format_http_error(exc.response, self._model_name())}\n\n"
                "This AI assistant does not replace professional veterinary diagnosis."
            )
        except Exception:
            return (
                "I could not reach Gemini right now. Please check the backend network and Gemini API configuration.\n\n"
                "This AI assistant does not replace professional veterinary diagnosis."
            )

    def _format_http_error(self, response: httpx.Response, model: str) -> str:
        try:
            error_detail = response.json().get("error", {}).get("message", response.text)
        except Exception:
            error_detail = response.text
        return f"Gemini API error: {response.status_code}. Model: {model}. Detail: {error_detail}"
