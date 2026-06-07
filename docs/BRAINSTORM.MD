# GPet Vet AI Assistant – Full Project Idea (Codex Prompt)

## Project Overview

Build a full-stack AI-powered pet healthcare assistant platform named **GPet Vet AI**.

The system helps new pet owners manage all information related to their pets in one place, including:

* Medical records
* Vaccination documents
* Pet images
* Test results
* Food information
* Videos
* Daily health notes
* Symptoms
* Chat history

The core feature is an **AI chatbot with memory + RAG (Retrieval Augmented Generation)** that can answer questions about the user's pet using uploaded documents as context.

Example:

User uploads:

* vaccination PDF
* blood test
* prescription
* dog image
* surgery report

Then user can ask:

* “What vaccine has my dog already taken?”
* “When should the next vaccine happen?”
* “Is this symptom dangerous?”
* “What food is suitable for my cat?”
* “Summarize my pet’s medical history”
* “What medications is my pet currently using?”
* “Does my pet have kidney-related issues?”

The chatbot should answer based on:

1. uploaded documents
2. extracted data
3. previous conversations
4. structured pet profile data

---

# Main Goal

Create a modern AI veterinary assistant platform with:

* React + Vite frontend
* FastAPI backend
* MongoDB database
* Ollama local LLM
* Whisper transcription
* FAISS vector search
* RAG architecture
* Multi-pet management
* AI health assistant
* Smart document understanding

---

# Main Features

## 1. Authentication System

### Features

* Register
* Login
* JWT authentication
* Forgot password
* Remember login
* Google login (future)

### User Roles

* pet_owner
* admin
* veterinarian (future)

---

# 2. Pet Profile Management

Each user can manage multiple pets.

## Pet Information

```python
class Pet:
    pet_id: str
    owner_id: str

    name: str
    species: str
    breed: str
    gender: str
    birthday: datetime
    weight: float
    color: str

    avatar_url: str

    allergies: list[str]
    chronic_conditions: list[str]

    created_at: datetime
```

---

# 3. AI Knowledge Upload System

Users can upload:

## Supported Types

### Documents

* PDF
* DOCX
* TXT

### Media

* MP4
* Audio
* Images

### External

* YouTube links
* Website URLs

---

# 4. Unified Content Architecture

IMPORTANT:

Do NOT separate:

* documents
* videos
* audio
* transcripts

Everything must become a unified:

# Content Item

```python
class ContentItem:
    content_id: str
    pet_id: str
    owner_id: str

    title: str

    type: str
    # pdf/docx/video/audio/image/youtube/url

    source: str
    # uploaded_file/youtube/external_url

    file_path: str | None
    original_url: str | None

    status: str
    # uploaded/processing/ready/failed

    metadata: dict

    created_at: datetime
```

---

# 5. AI Processing Pipeline

All uploaded files go through the same AI ingestion pipeline.

```txt
upload file
    ↓
extract text / transcript
    ↓
clean text
    ↓
chunking
    ↓
embedding
    ↓
FAISS vector index
    ↓
RAG retrieval
    ↓
chatbot answering
```

---

# 6. RAG Chatbot System

## Chatbot Abilities

The chatbot must:

* answer questions about pet health
* summarize uploaded documents
* explain medical terminology
* remember previous conversations
* provide contextual answers
* reference uploaded documents
* support Vietnamese language
* support streaming responses

---

# 7. Smart Medical AI Features

## Symptom Analysis

Example:

User:

> “My cat is vomiting and not eating”

AI:

* possible causes
* urgency level
* suggested actions
* recommend vet visit if dangerous

IMPORTANT:
Always include disclaimer:

```txt
This AI assistant does not replace professional veterinary diagnosis.
```

---

# 8. Vaccine Timeline

Automatically detect:

* vaccine names
* dates
* next due dates

Generate reminders.

---

# 9. AI Pet Summary

Generate:

```txt
Pet Health Summary
Medical History
Current Conditions
Current Medications
Vaccination Status
Food Recommendations
Risk Alerts
```

---

# 10. Chat Memory

The assistant remembers:

* previous messages
* uploaded documents
* pet conditions
* recent symptoms

---

# Technical Stack

# Frontend

## Stack

* React
* Vite
* TailwindCSS
* React Router
* Axios
* Zustand
* Framer Motion

## Theme

Use the same design language as GPet Vet:

* soft mint green
* modern veterinary UI
* rounded cards
* floating glassmorphism
* clean dashboard
* soft shadows

## Main Pages

```txt
/pages
    LandingPage
    LoginPage
    RegisterPage
    DashboardPage
    PetProfilePage
    UploadPage
    ContentPage
    ChatPage
    SettingsPage
```

---

# Backend

## Stack

* FastAPI
* Python
* Motor (MongoDB async)
* JWT auth
* Pydantic
* LangChain
* Ollama
* FAISS
* Whisper

---

# Database (MongoDB)

## Collections

```txt
users
pets
content_items
content_chunks
chat_sessions
chat_messages
vector_indexes
notifications
```

---

# Recommended Backend Structure

```txt
backend/
  app/
    main.py

    api/
      routes/
        auth.py
        pets.py
        content.py
        upload.py
        chat.py
        health.py

    models/
      user.py
      pet.py
      content_item.py
      content_chunk.py
      chat_message.py

    schemas/
      auth.py
      pet.py
      content.py
      chat.py

    services/

      ingest/
        content_ingest_service.py
        document_ingest_service.py
        image_ingest_service.py
        video_ingest_service.py

      rag/
        rag_service.py
        retrieval.py
        prompts.py
        chunking.py

      ai/
        ollama_service.py
        embeddings_service.py
        whisper_service.py

      storage/
        local_storage.py

      repositories/
        pet_repository.py
        content_repository.py
        chat_repository.py
```

---

# Recommended Frontend Structure

```txt
frontend/src/

  api/
    authApi.js
    petApi.js
    contentApi.js
    chatApi.js

  pages/
    LandingPage.jsx
    DashboardPage.jsx
    ChatPage.jsx

  components/

    layout/
      Navbar.jsx
      Sidebar.jsx

    pet/
      PetCard.jsx
      PetProfileForm.jsx

    upload/
      UploadDropzone.jsx
      UploadProgress.jsx

    chat/
      ChatInterface.jsx
      ChatMessage.jsx
      ChatInput.jsx

    content/
      DocumentViewer.jsx
      TranscriptViewer.jsx

  store/
    authStore.js
    petStore.js
    chatStore.js
```

---

# Backend Flow

## Upload File

```python
POST /content/upload
```

### Flow

```txt
receive file
    ↓
detect type
    ↓
store file
    ↓
extract text/transcript
    ↓
save chunks
    ↓
generate embeddings
    ↓
store vector index
    ↓
mark content ready
```

---

# Chat Flow

```python
POST /chat
```

## Flow

```txt
user question
    ↓
retrieve related chunks
    ↓
build prompt context
    ↓
send to Ollama
    ↓
generate response
    ↓
save history
    ↓
return answer + sources
```

---

# Ollama Setup

## Suggested Models

### Vietnamese

* qwen2.5
* llama3
* mistral

### Embedding

* nomic-embed-text
* bge-m3

---

# Suggested AI Prompt

```txt
You are a veterinary AI assistant.

Use the provided pet medical context to answer questions.

Rules:
- prioritize uploaded documents
- answer in Vietnamese
- explain clearly for normal users
- if unsure, say you are unsure
- never hallucinate fake medical facts
- always mention when veterinary consultation is recommended
```

---

# Important Architecture Rule

After extraction/transcription:

ALL content types become the SAME format:

```python
{
    "text": "...",
    "metadata": {...}
}
```

This keeps the pipeline scalable.

Future additions:

* website crawling
* image OCR
* medical image analysis
* smart reminders
* AI diagnosis
* multi-agent AI

will become much easier.

---

# MVP Phase

## MUST BUILD FIRST

### Phase 1

* auth
* pet profile
* upload PDF
* upload image
* chat with documents
* Ollama integration
* FAISS retrieval

### Phase 2

* Whisper transcription
* vaccine extraction
* health summary
* reminders

### Phase 3

* image analysis
* voice chat
* multi-pet AI memory
* veterinarian dashboard

---

# UI/UX Direction

The UI should feel:

* warm
* modern
* trustworthy
* healthcare-oriented
* easy for non-technical pet owners

Use:

* soft gradients
* mint green palette
* rounded components
* floating cards
* minimal dashboard
* responsive mobile-first layout

---

# Important Coding Rules

## Backend

* async everywhere
* clean architecture
* repository pattern
* service layer separation
* modular routes
* scalable folder structure

## Frontend

* reusable components
* centralized API layer
* state management with Zustand
* responsive design
* lazy loading
* chat streaming UI

---

# Future AI Features

## Potential Expansions

* AI symptom classifier
* OCR from medical prescriptions
* AI pet food recommendation
* emergency detection
* medication reminder
* vet appointment booking
* AI-generated pet reports
* multilingual chatbot
* AI voice assistant

---

# Final Product Vision

The final system should become:

> “An AI-powered personal veterinary assistant platform for pet owners.”

A user uploads everything related to their pet once, and the AI becomes a smart long-term assistant that understands:

* medical history
* symptoms
* vaccines
* medications
* behaviors
* health patterns
* conversations

similar to a “ChatGPT for pet healthcare management”.
