from pathlib import Path


class DocumentIngestService:
    async def extract_text(self, file_path: str) -> str:
        path = Path(file_path)
        if path.suffix.lower() == ".txt":
            return path.read_text(encoding="utf-8", errors="ignore")
        return f"Text extraction placeholder for {path.name}. Add pypdf/python-docx for full document parsing."
