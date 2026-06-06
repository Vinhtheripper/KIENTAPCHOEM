import { Send } from 'lucide-react'
import { useState } from 'react'

function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!message.trim()) return
    onSend(message.trim())
    setMessage('')
  }

  return (
    <form className="flex gap-3" onSubmit={submit}>
      <textarea
        className="field min-h-14 flex-1 resize-none"
        placeholder="Ask about vaccines, symptoms, medications, food, or uploaded records..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button className="btn-primary h-14 w-14 shrink-0 rounded-[18px] p-0" type="submit" disabled={disabled} aria-label="Send message">
        <Send className="h-5 w-5" />
      </button>
    </form>
  )
}

export default ChatInput
