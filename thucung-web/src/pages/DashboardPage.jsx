import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, FileText, HeartPulse, Plus, ShieldCheck, Syringe } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import usePetStore from '../store/petStore.js'
import PetCard from '../components/pet/PetCard.jsx'

function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { pets, selectedPetId, selectPet, fetchPets, fetchAdminPets, deletePet } = usePetStore()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    ;(isAdmin ? fetchAdminPets : fetchPets)().catch(() => {})
  }, [fetchPets, fetchAdminPets, isAdmin])

  return (
    <div className="space-y-6">
      <div className="surface-card overflow-hidden rounded-[28px]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <span className="eyebrow"><ShieldCheck className="h-4 w-4" /> Veterinary memory desk</span>
            <h1 className="page-title mt-4">Pet health dashboard</h1>
            <p className="mt-3 max-w-2xl text-[#527b70]">Manage profiles, uploaded knowledge, vaccine timeline, and AI veterinary guidance in one calm workspace.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/app/pets"><Plus className="h-4 w-4" />Add pet</Link>
              <Link className="btn-secondary" to="/app/chat">Ask assistant <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="rounded-[24px] border border-[#d8ede5] bg-[#f8fcfa] p-5">
            <p className="text-sm font-black uppercase text-[#17785d]">Workspace status</p>
            <div className="mt-5 grid gap-3">
              {[
                ['Profiles', `${pets.length} active`],
                ['AI model', 'Gemini ready'],
                ['Storage', 'MongoDB Atlas'],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3" key={label}>
                  <span className="text-sm font-bold text-[#527b70]">{label}</span>
                  <span className="font-black text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [HeartPulse, pets.length, 'Pets managed', 'accent-green'],
          [FileText, '0', 'Ready content items', 'accent-blue'],
          [Syringe, 'Soon', 'Vaccine reminders', 'accent-amber'],
          [Bot, 'Gemini', 'Cloud AI model', 'accent-coral'],
        ].map(([Icon, value, label, accent]) => (
          <div className="stat-card" key={label}>
            <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${accent}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-black text-ink">{value}</p>
            <p className="text-sm font-bold text-[#527b70]">{label}</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-3 text-xl font-black text-ink">Your pets</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} selected={pet._id === selectedPetId} onSelect={selectPet} onDelete={deletePet} />)}
        </div>
        {pets.length === 0 && (
          <div className="empty-state rounded-[24px] p-8 text-center">
            <p className="text-xl font-black text-ink">No pet profiles yet</p>
            <p className="mt-2">Create the first profile so uploads and chat can attach to the right pet.</p>
            <Link className="btn-primary mt-5" to="/app/pets"><Plus className="h-4 w-4" />Create profile</Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
