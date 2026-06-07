import { useState } from 'react'
import { Calendar, Cat, Dog, HeartPulse, PawPrint, Pencil, Rabbit, Syringe, Trash2 } from 'lucide-react'
import ConfirmDialog from '../common/ConfirmDialog.jsx'

const speciesIcon = {
  dog: Dog,
  cat: Cat,
  rabbit: Rabbit,
  other: PawPrint,
}

function PetCard({ pet, selected, onSelect, onDelete, onEdit }) {
  const Icon = speciesIcon[pet.species] || PawPrint
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <article
        className={`w-full rounded-[24px] border p-4 text-left transition ${
          selected ? 'border-mint-500 bg-[#f1fbf7] shadow-lg shadow-mint-500/10' : 'border-[#d8ede5] bg-white hover:border-mint-500 hover:shadow-lg hover:shadow-mint-500/10'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <button className="min-w-0 flex-1 text-left" type="button" onClick={() => onSelect?.(pet._id)}>
            <div className="flex items-start gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#e8f7f1] text-mint-700">
                {pet.avatar_url ? <img className="h-full w-full object-cover" src={pet.avatar_url} alt={`${pet.name} avatar`} /> : <Icon className="h-7 w-7" />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-ink">{pet.name}</p>
                <p className="text-sm capitalize text-[#527b70]">{pet.species} {pet.breed ? `- ${pet.breed}` : ''}</p>
                {pet.owner_name && <span className="chip mt-2 bg-white">Owner: {pet.owner_name}</span>}
                {selected && <span className="mt-2 inline-flex rounded-full bg-mint-500 px-3 py-1 text-xs font-black text-white">Selected</span>}
              </div>
            </div>
          </button>
          <div className="flex shrink-0 gap-2">
            <button
              className="grid h-10 w-10 place-items-center rounded-2xl border border-[#d8ede5] bg-white text-mint-700 transition hover:bg-[#effbf6]"
              type="button"
              onClick={() => onEdit?.(pet)}
              aria-label={`Edit ${pet.name}`}
              title="Edit pet"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              className="grid h-10 w-10 place-items-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete ${pet.name}`}
              title="Delete pet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button className="mt-4 w-full text-left" type="button" onClick={() => onSelect?.(pet._id)}>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[#527b70]">
            <span className="rounded-2xl border border-[#d8ede5] bg-white px-2 py-2"><HeartPulse className="mr-1 inline h-3 w-3" />{pet.weight || '--'} kg</span>
            <span className="rounded-2xl border border-[#d8ede5] bg-white px-2 py-2"><Syringe className="mr-1 inline h-3 w-3" />Vaccines</span>
            <span className="rounded-2xl border border-[#d8ede5] bg-white px-2 py-2"><Calendar className="mr-1 inline h-3 w-3" />Notes</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {!!pet.allergies?.length && <span className="chip accent-coral">Allergies: {pet.allergies.slice(0, 2).join(', ')}</span>}
            {!!pet.chronic_conditions?.length && <span className="chip accent-amber">Conditions: {pet.chronic_conditions.slice(0, 2).join(', ')}</span>}
            {pet.diet && <span className="chip accent-blue">Diet noted</span>}
          </div>
        </button>
      </article>
      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ${pet.name}?`}
        message="This also removes this pet's content and chat history."
        confirmLabel="Delete pet"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          onDelete?.(pet._id)
        }}
      />
    </>
  )
}

export default PetCard
