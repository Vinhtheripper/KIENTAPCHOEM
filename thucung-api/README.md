# GPet Vet AI API

FastAPI backend for pet profiles, unified content ingestion, MongoDB persistence, and Gemini-backed RAG chat.

## Run

```bash
cd thucung-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Required services:

- MongoDB on `mongodb://localhost:27017`
- Gemini API key from Google AI Studio
