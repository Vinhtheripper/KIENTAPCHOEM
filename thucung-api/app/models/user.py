from app.models.common import MongoModel, now_utc


class User(MongoModel):
    email: str
    full_name: str
    password_hash: str
    role: str = "pet_owner"
    created_at: str | None = None


def user_document(email: str, full_name: str, password_hash: str, role: str = "pet_owner") -> dict:
    return {
        "email": email.lower(),
        "full_name": full_name,
        "password_hash": password_hash,
        "role": role,
        "created_at": now_utc(),
    }
