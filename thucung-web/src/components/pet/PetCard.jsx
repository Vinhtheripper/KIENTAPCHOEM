import { Calendar, HeartPulse, Syringe } from 'lucide-react'

function PetCard({ pet, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(pet._id)}
      className={`w-full rounded-[22px] border p-4 text-left transition ${
        selected ? 'border-mint-500 bg-mint-50 shadow-lg shadow-mint-500/10' : 'border-[#d8ede5] bg-white hover:border-mint-500'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e8f7f1] text-2xl">{pet.avatar_url ? 'Img' : 'Pet'}</div>
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-ink">{pet.name}</p>
          <p className="text-sm text-[#527b70]">{pet.species} {pet.breed ? `- ${pet.breed}` : ''}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold text-[#527b70]">
        <span className="rounded-xl bg-white px-2 py-2"><HeartPulse className="mr-1 inline h-3 w-3" />{pet.weight || '--'} kg</span>
        <span className="rounded-xl bg-white px-2 py-2"><Syringe className="mr-1 inline h-3 w-3" />Vaccines</span>
        <span className="rounded-xl bg-white px-2 py-2"><Calendar className="mr-1 inline h-3 w-3" />Notes</span>
      </div>
    </button>
  )
}

export default PetCard
