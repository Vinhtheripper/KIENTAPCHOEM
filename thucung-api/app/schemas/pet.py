from datetime import datetime

from pydantic import BaseModel


class PetCreate(BaseModel):
    name: str
    species: str
    breed: str | None = None
    gender: str | None = None
    birthday: datetime | None = None
    weight: float | None = None
    color: str | None = None
    avatar_url: str | None = None
    allergies: list[str] = []
    chronic_conditions: list[str] = []


class PetUpdate(BaseModel):
    name: str | None = None
    species: str | None = None
    breed: str | None = None
    gender: str | None = None
    birthday: datetime | None = None
    weight: float | None = None
    color: str | None = None
    avatar_url: str | None = None
    allergies: list[str] | None = None
    chronic_conditions: list[str] | None = None
