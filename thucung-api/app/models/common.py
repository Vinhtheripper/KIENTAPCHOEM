from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class MongoModel(BaseModel):
    id: str | None = Field(default=None, alias="_id")

    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

    @classmethod
    def from_mongo(cls, document: dict[str, Any] | None):
        if not document:
            return None
        data = dict(document)
        if isinstance(data.get("_id"), ObjectId):
            data["_id"] = str(data["_id"])
        return cls(**data)
