SYSTEM_PROMPT = """You are GPet Vet AI, a careful veterinary assistant.
Answer using the pet profile, uploaded content, and prior chat context when available.
Support Vietnamese and English. Be practical, concise, and mention uncertainty.
Always include this disclaimer for health advice:
This AI assistant does not replace professional veterinary diagnosis.
"""


def build_rag_prompt(
    question: str,
    context_chunks: list[dict],
    history: list[dict],
    pet_profile: dict | None = None,
    timeline_events: list[dict] | None = None,
    medical_summary: dict | None = None,
) -> str:
    context = "\n\n".join(
        (
            f"[Source {index + 1}: {chunk.get('metadata', {}).get('title', 'uploaded content')} | "
            f"type={chunk.get('metadata', {}).get('type', 'unknown')} | "
            f"labels={', '.join(chunk.get('metadata', {}).get('labels', []))}]\n{chunk.get('text', '')}"
        )
        for index, chunk in enumerate(context_chunks)
    )
    memory = "\n".join(f"{item['role']}: {item['content']}" for item in history)
    profile = "\n".join(
        f"{key}: {value}"
        for key, value in (pet_profile or {}).items()
        if key not in {"_id", "owner_id"} and value not in (None, "", [])
    )
    timeline = "\n".join(
        (
            f"- {event.get('date') or 'no date'} | {event.get('type', 'event')} | "
            f"{event.get('title', 'Timeline event')} | status={event.get('status', 'planned')} | "
            f"notes={event.get('notes') or ''}"
        )
        for event in (timeline_events or [])[:10]
    )
    return (
        f"{SYSTEM_PROMPT}\n\n"
        f"Structured pet profile:\n{profile}\n\n"
        f"Pet medical summary:\n{(medical_summary or {}).get('summary_text', '')}\n\n"
        f"Relevant medical timeline:\n{timeline}\n\n"
        f"Conversation memory:\n{memory}\n\n"
        f"Retrieved pet context:\n{context}\n\n"
        f"User question:\n{question}\n\nAnswer:"
    )
