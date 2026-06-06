import { useEffect, useState } from 'react'
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
      <div>
        <h1 className="page-title">Knowledge upload</h1>
        <p className="mt-2 text-[#527b70]">Every upload becomes one content item, then text, transcript, chunks, embeddings, and retrieval context.</p>
      </div>
      <select className="field max-w-sm" value={selectedPetId || ''} onChange={(e) => selectPet(e.target.value)}>
        <option value="">Select pet</option>
        {pets.map((pet) => <option value={pet._id} key={pet._id}>{pet.name}</option>)}
      </select>
      <UploadDropzone onFile={upload} />
      <UploadProgress progress={progress} />
      {latest && <div className="rounded-2xl bg-white p-4 text-sm font-bold text-[#527b70]">Created content item: {latest.title} ({latest.status})</div>}
    </div>
  )
}

export default UploadPage
