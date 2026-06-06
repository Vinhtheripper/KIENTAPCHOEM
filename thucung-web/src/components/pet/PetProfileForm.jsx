import { useState } from 'react'
import { HeartPulse, Plus } from 'lucide-react'
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
    <form className="surface-card rounded-[26px] p-5" onSubmit={submit}>
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#effbf6] text-mint-700"><HeartPulse className="h-5 w-5" /></div>
        <div>
          <h2 className="text-xl font-black text-ink">New pet profile</h2>
          <p className="mt-1 text-sm text-[#527b70]">Create structured context for uploads and chat.</p>
        </div>
      </div>
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
        <input className="field sm:col-span-2" type="number" step="0.1" placeholder="Weight kg" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
      </div>
      <button className="btn-primary mt-4 w-full" type="submit"><Plus className="h-4 w-4" />Add pet</button>
    </form>
  )
}

export default PetProfileForm
