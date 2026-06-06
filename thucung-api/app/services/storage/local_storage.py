from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings


class LocalStorage:
    def __init__(self, base_dir: Path | None = None):
        self.base_dir = base_dir or settings.upload_dir
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def save_upload(self, file: UploadFile, owner_id: str, pet_id: str) -> Path:
        suffix = Path(file.filename or "upload").suffix
        target_dir = self.base_dir / owner_id / pet_id
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / f"{uuid4()}{suffix}"
        content = await file.read()
        target.write_bytes(content)
        return target
