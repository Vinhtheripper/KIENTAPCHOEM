import { Bot } from 'lucide-react'
import useChatStore from '../../store/chatStore.js'
import ChatInput from './ChatInput.jsx'
import ChatMessage from './ChatMessage.jsx'

function ChatInterface({ petId }) {
  const { messages, loading, sendMessage } = useChatStore()

  return (
    <section className="glass-panel flex h-[calc(100vh-150px)] min-h-[620px] flex-col rounded-[26px] p-4">
      <div className="mb-4 flex items-center gap-3 border-b border-[#d8ede5] pb-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-500 text-white"><Bot className="h-5 w-5" /></div>
        <div>
          <h2 className="font-black text-ink">Veterinary RAG Assistant</h2>
          <p className="text-sm text-[#527b70]">Uses uploaded records, pet profile data, and chat memory.</p>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-[#f7fbf8] p-4">
        {messages.length === 0 && (
          <div className="mx-auto mt-16 max-w-lg text-center text-[#527b70]">
            <p className="text-lg font-black text-ink">Start with a pet-specific question.</p>
            <p className="mt-2 text-sm">Try: “Summarize my pet’s medical history” or “When is the next vaccine due?”</p>
          </div>
        )}
        {messages.map((message, index) => <ChatMessage key={index} message={message} />)}
        {loading && <ChatMessage message={{ role: 'assistant', content: 'Thinking with your pet records...' }} />}
      </div>
      <div className="mt-4">
        <ChatInput disabled={!petId || loading} onSend={(message) => sendMessage({ petId, message })} />
      </div>
    </section>
  )
}

export default ChatInterface
