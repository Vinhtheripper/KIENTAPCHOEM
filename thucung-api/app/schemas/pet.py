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
    microchip_id: str | None = None
    sterilized: bool | None = None
    diet: str | None = None
    medications: list[str] = []
    vaccines: list[str] = []
    vet_clinic: str | None = None
    emergency_contact: str | None = None
    notes: str | None = None


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
    microchip_id: str | None = None
    sterilized: bool | None = None
    diet: str | None = None
    medications: list[str] | None = None
    vaccines: list[str] | None = None
    vet_clinic: str | None = None
    emergency_contact: str | None = None
    notes: str | None = None
