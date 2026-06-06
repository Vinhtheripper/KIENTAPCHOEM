import { Calendar, Cat, Dog, HeartPulse, PawPrint, Rabbit, Syringe } from 'lucide-react'

const speciesIcon = {
  dog: Dog,
  cat: Cat,
  rabbit: Rabbit,
  other: PawPrint,
}

function PetCard({ pet, selected, onSelect }) {
  const Icon = speciesIcon[pet.species] || PawPrint

  return (
    <button
      type="button"
      onClick={() => onSelect?.(pet._id)}
      className={`w-full rounded-[24px] border p-4 text-left transition ${
        selected ? 'border-mint-500 bg-[#f1fbf7] shadow-lg shadow-mint-500/10' : 'border-[#d8ede5] bg-white hover:border-mint-500 hover:shadow-lg hover:shadow-mint-500/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#e8f7f1] text-mint-700">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-ink">{pet.name}</p>
          <p className="text-sm capitalize text-[#527b70]">{pet.species} {pet.breed ? `- ${pet.breed}` : ''}</p>
          {selected && <span className="mt-2 inline-flex rounded-full bg-mint-500 px-3 py-1 text-xs font-black text-white">Selected</span>}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold text-[#527b70]">
        <span className="rounded-2xl border border-[#d8ede5] bg-white px-2 py-2"><HeartPulse className="mr-1 inline h-3 w-3" />{pet.weight || '--'} kg</span>
        <span className="rounded-2xl border border-[#d8ede5] bg-white px-2 py-2"><Syringe className="mr-1 inline h-3 w-3" />Vaccines</span>
        <span className="rounded-2xl border border-[#d8ede5] bg-white px-2 py-2"><Calendar className="mr-1 inline h-3 w-3" />Notes</span>
      </div>
    </button>
  )
}

export default PetCard
