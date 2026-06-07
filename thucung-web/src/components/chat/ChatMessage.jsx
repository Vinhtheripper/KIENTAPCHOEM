import { FileText } from 'lucide-react'

function ChatMessage({ message, onCitationClick }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] rounded-[24px] px-4 py-3 shadow-sm ${isUser ? 'bg-mint-500 text-white' : 'border border-[#d8ede5] bg-white text-ink'}`}>
        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        {!!message.citations?.length && (
          <div className="mt-3 grid gap-2">
            {message.citations.map((citation, index) => (
              <button className="flex items-start gap-2 rounded-2xl border border-[#d8ede5] bg-[#effbf6] px-3 py-2 text-left text-xs font-bold text-mint-700 transition hover:border-mint-500 hover:bg-[#d8f4e8]" type="button" onClick={() => onCitationClick?.(citation)} key={`${citation.content_id}-${index}`}>
                <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="block text-ink">{citation.title}</span>
                  {citation.chunk_index !== undefined && <span className="block text-[#527b70]">Chunk {citation.chunk_index + 1}</span>}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
