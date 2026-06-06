import { useEffect } from 'react'
import { Bot, FileText, HeartPulse, Syringe } from 'lucide-react'
import usePetStore from '../store/petStore.js'
import PetCard from '../components/pet/PetCard.jsx'

function DashboardPage() {
  const { pets, selectedPetId, selectPet, fetchPets } = usePetStore()

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Pet health dashboard</h1>
        <p className="mt-2 text-[#527b70]">Manage profiles, uploaded knowledge, vaccine timeline, and AI veterinary guidance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [HeartPulse, pets.length, 'Pets managed'],
          [FileText, '0', 'Ready content items'],
          [Syringe, 'Soon', 'Vaccine reminders'],
          [Bot, 'Ollama', 'Local AI model'],
        ].map(([Icon, value, label]) => (
          <div className="stat-card" key={label}>
            <Icon className="mb-4 h-7 w-7 text-mint-700" />
            <p className="text-3xl font-black text-ink">{value}</p>
            <p className="text-sm font-bold text-[#527b70]">{label}</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-3 text-xl font-black text-ink">Your pets</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} selected={pet._id === selectedPetId} onSelect={selectPet} />)}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
