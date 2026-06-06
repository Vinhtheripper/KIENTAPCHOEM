# GPet Vet AI API

FastAPI backend for pet profiles, unified content ingestion, MongoDB persistence, and Ollama-backed RAG chat.

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
- Ollama on `http://localhost:11434`
- Pull local models, for example `ollama pull llama3.1` and `ollama pull nomic-embed-text`
