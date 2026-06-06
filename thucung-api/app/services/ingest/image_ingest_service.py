class ImageIngestService:
    async def extract_text(self, file_path: str) -> str:
        return f"Image uploaded at {file_path}. Add OCR or vision model analysis for image understanding."
