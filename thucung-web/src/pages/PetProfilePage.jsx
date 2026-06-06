import { useEffect } from 'react'
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
        <h1 className="page-title">Pet profiles</h1>
        <p className="mt-2 text-[#527b70]">Structured pet data is included in future chatbot context and health summaries.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} selected={pet._id === selectedPetId} onSelect={selectPet} />)}
        </div>
      </section>
      <PetProfileForm />
    </div>
  )
}

export default PetProfilePage
