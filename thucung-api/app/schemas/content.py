from pydantic import BaseModel, HttpUrl


class UrlIngestRequest(BaseModel):
    pet_id: str
    url: HttpUrl
    title: str | None = None


class ContentResponse(BaseModel):
    id: str
    pet_id: str
    owner_id: str
    title: str
    type: str
    source: str
    status: str
    metadata: dict = {}
