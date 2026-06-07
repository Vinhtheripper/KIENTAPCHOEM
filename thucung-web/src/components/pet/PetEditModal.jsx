import { useState } from 'react'
import { X } from 'lucide-react'
import usePetStore from '../../store/petStore.js'

function toCsv(value) {
  return Array.isArray(value) ? value.join(', ') : value || ''
}

function fromCsv(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function makeForm(pet) {
  return {
    name: pet.name || '',
    species: pet.species || 'dog',
    breed: pet.breed || '',
    gender: pet.gender || '',
    weight: pet.weight || '',
    color: pet.color || '',
    diet: pet.diet || '',
    allergies: toCsv(pet.allergies),
    chronic_conditions: toCsv(pet.chronic_conditions),
    medications: toCsv(pet.medications),
    vaccines: toCsv(pet.vaccines),
    vet_clinic: pet.vet_clinic || '',
    emergency_contact: pet.emergency_contact || '',
    notes: pet.notes || '',
  }
}

function PetEditForm({ pet, onClose }) {
  const updatePet = usePetStore((state) => state.updatePet)
  const [form, setForm] = useState(() => makeForm(pet))

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    await updatePet(pet._id, {
      ...form,
      weight: form.weight ? Number(form.weight) : null,
      allergies: fromCsv(form.allergies || ''),
      chronic_conditions: fromCsv(form.chronic_conditions || ''),
      medications: fromCsv(form.medications || ''),
      vaccines: fromCsv(form.vaccines || ''),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#17312b]/35 p-4 backdrop-blur-sm">
      <form className="surface-card max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] p-5" onSubmit={submit}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-[#527b70]">Edit pet profile</p>
            <h2 className="text-2xl font-black text-ink">{pet.name}</h2>
          </div>
          <button className="btn-secondary h-10 w-10 rounded-2xl p-0" type="button" onClick={onClose} aria-label="Close edit pet">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" required placeholder="Name" value={form.name || ''} onChange={(e) => update('name', e.target.value)} />
          <select className="field" value={form.species || 'dog'} onChange={(e) => update('species', e.target.value)}>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
          <input className="field" placeholder="Breed" value={form.breed || ''} onChange={(e) => update('breed', e.target.value)} />
          <input className="field" placeholder="Gender" value={form.gender || ''} onChange={(e) => update('gender', e.target.value)} />
          <input className="field" type="number" step="0.1" placeholder="Weight kg" value={form.weight || ''} onChange={(e) => update('weight', e.target.value)} />
          <input className="field" placeholder="Color" value={form.color || ''} onChange={(e) => update('color', e.target.value)} />
          <input className="field sm:col-span-2" placeholder="Diet" value={form.diet || ''} onChange={(e) => update('diet', e.target.value)} />
          <input className="field sm:col-span-2" placeholder="Allergies, comma separated" value={form.allergies || ''} onChange={(e) => update('allergies', e.target.value)} />
          <input className="field sm:col-span-2" placeholder="Chronic conditions, comma separated" value={form.chronic_conditions || ''} onChange={(e) => update('chronic_conditions', e.target.value)} />
          <input className="field sm:col-span-2" placeholder="Medications, comma separated" value={form.medications || ''} onChange={(e) => update('medications', e.target.value)} />
          <input className="field sm:col-span-2" placeholder="Vaccines, comma separated" value={form.vaccines || ''} onChange={(e) => update('vaccines', e.target.value)} />
          <input className="field sm:col-span-2" placeholder="Vet clinic" value={form.vet_clinic || ''} onChange={(e) => update('vet_clinic', e.target.value)} />
          <input className="field sm:col-span-2" placeholder="Emergency contact" value={form.emergency_contact || ''} onChange={(e) => update('emergency_contact', e.target.value)} />
          <textarea className="field min-h-24 resize-none sm:col-span-2" placeholder="Notes" value={form.notes || ''} onChange={(e) => update('notes', e.target.value)} />
        </div>
        <button className="btn-primary mt-5 w-full" type="submit">Save changes</button>
      </form>
    </div>
  )
}

function PetEditModal({ pet, onClose }) {
  if (!pet) return null
  return <PetEditForm key={pet._id} pet={pet} onClose={onClose} />
}

export default PetEditModal
