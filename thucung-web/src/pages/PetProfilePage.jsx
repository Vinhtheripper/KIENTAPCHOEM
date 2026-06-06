import { useEffect } from 'react'
import { PawPrint } from 'lucide-react'
import PetCard from '../components/pet/PetCard.jsx'
import PetProfileForm from '../components/pet/PetProfileForm.jsx'
import usePetStore from '../store/petStore.js'

function PetProfilePage() {
  const { pets, selectedPetId, selectPet, fetchPets } = usePetStore()

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section>
        <span className="eyebrow"><PawPrint className="h-4 w-4" /> Pet registry</span>
        <h1 className="page-title mt-4">Pet profiles</h1>
        <p className="mt-2 max-w-2xl text-[#527b70]">Structured pet data is included in chatbot context, upload metadata, and future health summaries.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} selected={pet._id === selectedPetId} onSelect={selectPet} />)}
        </div>
        {pets.length === 0 && (
          <div className="empty-state mt-6 rounded-[24px] p-8 text-center">
            <p className="text-xl font-black text-ink">Create the first profile</p>
            <p className="mt-2">The assistant needs a selected pet before it can answer with profile-aware context.</p>
          </div>
        )}
      </section>
      <PetProfileForm />
    </div>
  )
}

export default PetProfilePage
