import { useEffect } from 'react'
import { Bot, ShieldCheck } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import ChatInterface from '../components/chat/ChatInterface.jsx'
import usePetStore from '../store/petStore.js'

function ChatPage() {
  const { pets, selectedPetId, selectPet, fetchPets, fetchAdminPets } = usePetStore()
  const user = useAuthStore((state) => state.user)
  const selectedPet = pets.find((pet) => pet._id === selectedPetId)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    ;(isAdmin ? fetchAdminPets : fetchPets)().catch(() => {})
  }, [fetchPets, fetchAdminPets, isAdmin])

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
      <ChatInterface petId={selectedPetId} />
    </div>
  )
}

export default ChatPage
