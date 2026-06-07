import { useState } from 'react'
import { AlertTriangle, Bot, Sparkles } from 'lucide-react'
import useChatStore from '../../store/chatStore.js'
import ChatInput from './ChatInput.jsx'
import ChatMessage from './ChatMessage.jsx'

function ChatInterface({ petId, onCitationClick }) {
  const { messages, loading, sendMessage } = useChatStore()
  const [draft, setDraft] = useState('')
  const quickPrompts = [
    'Tóm tắt hồ sơ y tế của pet đang chọn',
    'Lịch tiêm hoặc tái khám tiếp theo là gì?',
    'Có dấu hiệu nào cần chú ý không?',
    'Tóm tắt các giấy khám gần đây',
  ]
  const emergencyWords = ['khó thở', 'kho tho', 'co giật', 'co giat', 'ra máu', 'ra mau', 'ngất', 'ngat', 'poison', 'seizure', 'bleeding', 'breathing']
  const emergencyHit = emergencyWords.some((word) => draft.toLowerCase().includes(word))

  return (
    <section className="surface-card flex h-[calc(100vh-190px)] min-h-[620px] flex-col rounded-[28px] p-4">
      <div className="mb-4 flex items-center gap-3 border-b border-[#d8ede5] pb-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#17312b] text-white"><Bot className="h-5 w-5" /></div>
        <div>
          <h2 className="font-black text-ink">Veterinary RAG Assistant</h2>
          <p className="text-sm text-[#527b70]">Uses uploaded records, pet profile data, and chat memory.</p>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto rounded-[24px] border border-[#d8ede5] bg-[#f8fcfa] p-4">
        {messages.length === 0 && (
          <div className="mx-auto mt-12 max-w-2xl text-center text-[#527b70]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-mint-700 shadow-sm"><Sparkles className="h-7 w-7" /></div>
            <p className="mt-4 text-xl font-black text-ink">{petId ? 'Start with a pet-specific question.' : 'Select a pet to start chatting.'}</p>
            <p className="mt-2 text-sm">Try “Summarize my pet’s medical history” or “When is the next vaccine due?”</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {quickPrompts.map((item) => <button className="chip transition hover:border-mint-500" type="button" onClick={() => setDraft(item)} key={item}>{item}</button>)}
            </div>
          </div>
        )}
        {messages.map((message, index) => <ChatMessage key={index} message={message} onCitationClick={onCitationClick} />)}
        {loading && <ChatMessage message={{ role: 'assistant', content: 'Thinking with your pet records...' }} />}
      </div>
      <div className="mt-4">
        {emergencyHit && (
          <div className="mb-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            This may be urgent. Contact a veterinarian or emergency clinic now, especially if symptoms are severe or worsening.
          </div>
        )}
        {petId && (
          <div className="mb-3 flex flex-wrap gap-2">
            {quickPrompts.map((item) => <button className="chip px-3 py-2 text-[11px]" type="button" onClick={() => setDraft(item)} key={item}>{item}</button>)}
          </div>
        )}
        <ChatInput disabled={!petId || loading} message={draft} setMessage={setDraft} onSend={(message) => sendMessage({ petId, message })} />
      </div>
    </section>
  )
}

export default ChatInterface
