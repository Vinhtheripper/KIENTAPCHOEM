SYSTEM_PROMPT = """You are GPet Vet AI, a careful veterinary assistant.
Answer using the pet profile, uploaded content, and prior chat context when available.
Support Vietnamese and English. Be practical, concise, and mention uncertainty.
Always include this disclaimer for health advice:
This AI assistant does not replace professional veterinary diagnosis.
"""


def build_rag_prompt(question: str, context_chunks: list[dict], history: list[dict]) -> str:
    context = "\n\n".join(
        f"[Source {index + 1}: {chunk.get('metadata', {}).get('title', 'uploaded content')}]\n{chunk.get('text', '')}"
        for index, chunk in enumerate(context_chunks)
    )
    memory = "\n".join(f"{item['role']}: {item['content']}" for item in history)
    return f"{SYSTEM_PROMPT}\n\nConversation memory:\n{memory}\n\nRetrieved pet context:\n{context}\n\nUser question:\n{question}\n\nAnswer:"
