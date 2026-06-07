import { useState } from 'react'
import { HeartPulse, ImagePlus, Plus } from 'lucide-react'
import usePetStore from '../../store/petStore.js'

const initialForm = {
  name: '',
  species: 'dog',
  breed: '',
  gender: '',
  birthday: '',
  weight: '',
  color: '',
  avatar_url: '',
  allergies: '',
  chronic_conditions: '',
  microchip_id: '',
  sterilized: '',
  diet: '',
  medications: '',
  vaccines: '',
  vet_clinic: '',
  emergency_contact: '',
  notes: '',
}

function listValue(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function PetProfileForm() {
  const createPet = usePetStore((state) => state.createPet)
  const uploadAvatar = usePetStore((state) => state.uploadAvatar)
  const [form, setForm] = useState(initialForm)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleAvatarFile = (file) => {
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const submit = async (event) => {
    event.preventDefault()
    const pet = await createPet({
      ...form,
      avatar_url: '',
      birthday: form.birthday || null,
      weight: form.weight ? Number(form.weight) : null,
      sterilized: form.sterilized === '' ? null : form.sterilized === 'true',
      allergies: listValue(form.allergies),
      chronic_conditions: listValue(form.chronic_conditions),
      medications: listValue(form.medications),
      vaccines: listValue(form.vaccines),
    })
    if (avatarFile) {
      await uploadAvatar(pet._id, avatarFile)
    }
    setForm(initialForm)
    setAvatarFile(null)
    setAvatarPreview('')
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
      <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-[22px] border border-dashed border-[#bddfd3] bg-[#f8fcfa] p-4">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-white text-mint-700">
          {avatarPreview ? <img className="h-full w-full object-cover" src={avatarPreview} alt="Pet avatar preview" /> : <ImagePlus className="h-7 w-7" />}
        </div>
        <div>
          <p className="font-black text-ink">Upload pet image</p>
          <p className="text-sm text-[#527b70]">Preview is saved as avatar reference for this profile.</p>
        </div>
        <input className="hidden" type="file" accept="image/*" onChange={(e) => handleAvatarFile(e.target.files?.[0])} />
      </label>

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
        <input className="field" type="date" placeholder="Birthday" value={form.birthday} onChange={(e) => update('birthday', e.target.value)} />
        <input className="field" type="number" step="0.1" placeholder="Weight kg" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
        <input className="field" placeholder="Color" value={form.color} onChange={(e) => update('color', e.target.value)} />
        <input className="field" placeholder="Microchip ID" value={form.microchip_id} onChange={(e) => update('microchip_id', e.target.value)} />
        <select className="field" value={form.sterilized} onChange={(e) => update('sterilized', e.target.value)}>
          <option value="">Sterilized?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input className="field" placeholder="Vet clinic" value={form.vet_clinic} onChange={(e) => update('vet_clinic', e.target.value)} />
        <input className="field sm:col-span-2" placeholder="Emergency contact" value={form.emergency_contact} onChange={(e) => update('emergency_contact', e.target.value)} />
        <input className="field sm:col-span-2" placeholder="Diet / food notes" value={form.diet} onChange={(e) => update('diet', e.target.value)} />
        <input className="field sm:col-span-2" placeholder="Allergies, comma separated" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
        <input className="field sm:col-span-2" placeholder="Chronic conditions, comma separated" value={form.chronic_conditions} onChange={(e) => update('chronic_conditions', e.target.value)} />
        <input className="field sm:col-span-2" placeholder="Current medications, comma separated" value={form.medications} onChange={(e) => update('medications', e.target.value)} />
        <input className="field sm:col-span-2" placeholder="Vaccines, comma separated" value={form.vaccines} onChange={(e) => update('vaccines', e.target.value)} />
        <textarea className="field min-h-24 resize-none sm:col-span-2" placeholder="Health notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
      </div>
      <button className="btn-primary mt-4 w-full" type="submit"><Plus className="h-4 w-4" />Add pet</button>
    </form>
  )
}

export default PetProfileForm
