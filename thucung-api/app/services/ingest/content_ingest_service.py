from pathlib import Path

from app.models.content_chunk import chunk_document
from app.services.ai.embeddings_service import EmbeddingsService
from app.services.ingest.document_ingest_service import DocumentIngestService
from app.services.ingest.image_ingest_service import ImageIngestService
from app.services.ingest.video_ingest_service import VideoIngestService
from app.services.rag.chunking import chunk_text
from app.services.repositories.content_repository import ContentRepository


class ContentIngestService:
    def __init__(self):
        self.documents = DocumentIngestService()
        self.images = ImageIngestService()
        self.videos = VideoIngestService()
        self.embeddings = EmbeddingsService()
        self.content_repository = ContentRepository()

    def detect_type(self, filename: str) -> str:
        suffix = Path(filename).suffix.lower()
        if suffix == ".pdf":
            return "pdf"
        if suffix == ".docx":
            return "docx"
        if suffix == ".txt":
            return "txt"
        if suffix in {".png", ".jpg", ".jpeg", ".webp"}:
            return "image"
        if suffix in {".mp4", ".mov", ".m4v"}:
            return "video"
        if suffix in {".mp3", ".wav", ".m4a"}:
            return "audio"
        return "file"

    async def process_file(self, content_item: dict) -> None:
        file_path = content_item.get("file_path")
        content_type = content_item.get("type")
        content_id = content_item["_id"]
        try:
            if content_type in {"pdf", "docx", "txt", "file"}:
                text = await self.documents.extract_text(file_path)
            elif content_type == "image":
                text = await self.images.extract_text(file_path)
            else:
                text = await self.videos.extract_text(file_path)

            chunks = []
            for index, chunk in enumerate(chunk_text(text)):
                embedding = await self.embeddings.embed(chunk)
                chunks.append(
                    chunk_document(
                        content_id,
                        content_item["pet_id"],
                        content_item["owner_id"],
                        index,
                        chunk,
                        embedding=embedding,
                        metadata={"title": content_item["title"], "type": content_type},
                    )
                )
            await self.content_repository.save_chunks(chunks)
            await self.content_repository.mark_item(content_id, "ready", {"chunk_count": len(chunks)})
        except Exception as exc:
            await self.content_repository.mark_item(content_id, "failed", {"error": str(exc)})
