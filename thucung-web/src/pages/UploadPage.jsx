import { useEffect, useState } from 'react'
import { DatabaseZap, FileUp } from 'lucide-react'
import UploadDropzone from '../components/upload/UploadDropzone.jsx'
import UploadProgress from '../components/upload/UploadProgress.jsx'
import { contentApi } from '../api/contentApi.js'
import usePetStore from '../store/petStore.js'

function UploadPage() {
  const { pets, selectedPetId, selectPet, fetchPets } = usePetStore()
  const [progress, setProgress] = useState(0)
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  const upload = async (file) => {
    if (!selectedPetId) return
    setProgress(1)
    const item = await contentApi.upload(selectedPetId, file, (event) => {
      setProgress(Math.round((event.loaded * 100) / (event.total || event.loaded)))
    })
    setLatest(item)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="eyebrow"><FileUp className="h-4 w-4" /> Knowledge intake</span>
          <h1 className="page-title mt-4">Knowledge upload</h1>
          <p className="mt-2 max-w-2xl text-[#527b70]">Every upload becomes one content item, then text, transcript, chunks, embeddings, and retrieval context.</p>
        </div>
        <div className="surface-card rounded-[22px] p-3">
          <select className="field min-w-[260px]" value={selectedPetId || ''} onChange={(e) => selectPet(e.target.value)}>
            <option value="">Select pet</option>
            {pets.map((pet) => <option value={pet._id} key={pet._id}>{pet.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <UploadDropzone onFile={upload} disabled={!selectedPetId} />
        <aside className="surface-card rounded-[26px] p-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf6ff] text-[#25608a]"><DatabaseZap className="h-6 w-6" /></div>
          <h2 className="mt-4 text-xl font-black text-ink">Processing pipeline</h2>
          <div className="mt-4 space-y-3 text-sm font-bold text-[#527b70]">
            {['Create content item', 'Extract text or transcript', 'Split into searchable chunks', 'Attach to pet chat context'].map((step, index) => (
              <div className="flex items-center gap-3 rounded-2xl bg-[#f8fcfa] px-3 py-3" key={step}>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs text-ink">{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </aside>
      </div>
      <UploadProgress progress={progress} />
      {latest && <div className="surface-card rounded-2xl p-4 text-sm font-bold text-[#527b70]">Created content item: <span className="text-ink">{latest.title}</span> ({latest.status})</div>}
    </div>
  )
}

export default UploadPage
