import { PawPrint } from 'lucide-react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import usePetStore from '../../store/petStore.js'

function CurrentPetBar() {
  const user = useAuthStore((state) => state.user)
  const { pets, selectedPetId } = usePetStore()
  const pet = pets.find((item) => item._id === selectedPetId)

  if (user?.role === 'admin') return null

  return (
    <div className="border-b border-white/70 bg-white/55 px-4 py-2 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 font-bold text-[#527b70]">
          <PawPrint className="h-4 w-4 text-mint-700" />
          {pet ? (
            <span>Current pet: <span className="font-black text-ink">{pet.name}</span></span>
          ) : (
            <span>No pet selected</span>
          )}
        </div>
        <Link className="font-black text-mint-700" to="/app/pets">{pet ? 'Change pet' : 'Select pet'}</Link>
      </div>
    </div>
  )
}

export default CurrentPetBar
