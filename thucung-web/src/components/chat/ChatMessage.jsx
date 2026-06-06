function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] rounded-[24px] px-4 py-3 shadow-sm ${isUser ? 'bg-mint-500 text-white' : 'border border-[#d8ede5] bg-white text-ink'}`}>
        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        {!!message.citations?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.citations.map((citation, index) => (
              <span className="rounded-full bg-[#effbf6] px-3 py-1 text-xs font-bold text-mint-700" key={`${citation.content_id}-${index}`}>
                {citation.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
