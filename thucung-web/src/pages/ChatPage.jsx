import { useEffect } from 'react'
import ChatInterface from '../components/chat/ChatInterface.jsx'
import usePetStore from '../store/petStore.js'

function ChatPage() {
  const { pets, selectedPetId, selectPet, fetchPets } = usePetStore()

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="page-title">AI health assistant</h1>
          <p className="mt-2 text-[#527b70]">Ask questions grounded in uploaded records, extracted chunks, and conversation memory.</p>
        </div>
        <select className="field max-w-sm" value={selectedPetId || ''} onChange={(e) => selectPet(e.target.value)}>
          <option value="">Select pet</option>
          {pets.map((pet) => <option value={pet._id} key={pet._id}>{pet.name}</option>)}
        </select>
      </div>
      <ChatInterface petId={selectedPetId} />
    </div>
  )
}

export default ChatPage
