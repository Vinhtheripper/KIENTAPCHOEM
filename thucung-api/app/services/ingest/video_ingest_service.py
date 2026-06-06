from app.services.ai.whisper_service import WhisperService


class VideoIngestService:
    def __init__(self):
        self.whisper = WhisperService()

    async def extract_text(self, file_path: str) -> str:
        return await self.whisper.transcribe(file_path)
