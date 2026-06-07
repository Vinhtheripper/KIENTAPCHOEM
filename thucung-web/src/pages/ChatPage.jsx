import { useEffect, useState } from 'react'
import { Bot, MessageSquare, ShieldCheck } from 'lucide-react'
import ContentDetailPanel from '../components/content/ContentDetailPanel.jsx'
import { contentApi } from '../api/contentApi.js'
import useAuthStore from '../store/authStore.js'
import ChatInterface from '../components/chat/ChatInterface.jsx'
import useChatStore from '../store/chatStore.js'
import usePetStore from '../store/petStore.js'

function ChatPage() {
  const { pets, selectedPetId, selectPet, fetchPets, fetchAdminPets } = usePetStore()
  const user = useAuthStore((state) => state.user)
  const selectedPet = pets.find((pet) => pet._id === selectedPetId)
  const isAdmin = user?.role === 'admin'
  const { sessions, fetchSessions, loadSession, reset, sessionId } = useChatStore()
  const [selectedContent, setSelectedContent] = useState(null)
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    ;(isAdmin ? fetchAdminPets : fetchPets)().catch(() => {})
  }, [fetchPets, fetchAdminPets, isAdmin])

  useEffect(() => {
    fetchSessions(selectedPetId).catch(() => {})
  }, [fetchSessions, selectedPetId])

  const openCitation = async (citation) => {
    if (!citation?.content_id) return
    setContentLoading(true)
    setSelectedContent({ title: citation.title || 'Loading...' })
    try {
      setSelectedContent(await contentApi.detail(citation.content_id))
    } finally {
      setContentLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow"><Bot className="h-4 w-4" /> Gemini assistant</span>
          <h1 className="page-title mt-4">AI health assistant</h1>
          <p className="mt-2 max-w-2xl text-[#527b70]">Ask questions grounded in uploaded records, extracted chunks, and conversation memory.</p>
        </div>
        {isAdmin ? <div className="surface-card rounded-[22px] p-3">
          <select className="field min-w-[260px]" value={selectedPetId || ''} onChange={(e) => selectPet(e.target.value)}>
            <option value="">Select pet</option>
            {pets.map((pet) => <option value={pet._id} key={pet._id}>{pet.name}</option>)}
          </select>
        </div> : selectedPet && <div className="chip accent-green">Current pet: {selectedPet.name}</div>}
      </div>
      <div className="chip accent-amber"><ShieldCheck className="h-4 w-4" /> This AI assistant does not replace professional veterinary diagnosis.</div>
      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <aside className="surface-card rounded-[26px] p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black text-ink">Chat history</h2>
            <button className="btn-secondary h-9 rounded-2xl px-3 text-xs" type="button" onClick={reset}>New</button>
          </div>
          <div className="mt-4 space-y-2">
            {sessions.map((session) => (
              <button
                className={`w-full rounded-2xl border p-3 text-left text-sm transition ${session.session_id === sessionId ? 'border-mint-500 bg-[#f1fbf7]' : 'border-[#d8ede5] bg-white hover:border-mint-500'}`}
                key={session.session_id}
                type="button"
                onClick={() => loadSession(session.session_id)}
              >
                <div className="flex items-center gap-2 font-black text-ink"><MessageSquare className="h-4 w-4" /> Session</div>
                <p className="mt-1 line-clamp-2 text-xs text-[#527b70]">{session.last_message || session.session_id}</p>
              </button>
            ))}
            {sessions.length === 0 && <p className="rounded-2xl bg-[#f8fcfa] p-4 text-sm font-bold text-[#527b70]">No chat sessions yet.</p>}
          </div>
        </aside>
        <div className="space-y-5">
          <ChatInterface petId={selectedPetId} onCitationClick={openCitation} />
          <ContentDetailPanel item={selectedContent} loading={contentLoading} onClose={() => setSelectedContent(null)} onUpdated={(updated) => setSelectedContent(updated)} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
