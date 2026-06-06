import { useState } from 'react'
import { Plus } from 'lucide-react'
import usePetStore from '../../store/petStore.js'

function PetProfileForm() {
  const createPet = usePetStore((state) => state.createPet)
  const [form, setForm] = useState({ name: '', species: 'dog', breed: '', gender: '', weight: '' })

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    await createPet({ ...form, weight: form.weight ? Number(form.weight) : null })
    setForm({ name: '', species: 'dog', breed: '', gender: '', weight: '' })
  }

  return (
    <form className="glass-panel rounded-[24px] p-5" onSubmit={submit}>
      <h2 className="mb-4 text-xl font-black text-ink">New pet profile</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" required placeholder="Pet name" value={form.name} onChange={(e) => update('name', e.target.value)} />
        <select className="field" value={form.species} onChange={(e) => update('species', e.target.value)}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other</option>
        </select>
        <input className="field" placeholder="Breed" value={form.breed} onChange={(e) => update('breed', e.target.value)} />
        <input className="field" placeholder="Gender" value={form.gender} onChange={(e) => update('gender', e.target.value)} />
        <input className="field" type="number" step="0.1" placeholder="Weight kg" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
      </div>
      <button className="btn-primary mt-4 w-full" type="submit"><Plus className="h-4 w-4" />Add pet</button>
    </form>
  )
}

export default PetProfileForm
