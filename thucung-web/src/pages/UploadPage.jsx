import { useEffect, useState } from 'react'
import { CheckCircle2, DatabaseZap, FileUp } from 'lucide-react'
import UploadDropzone from '../components/upload/UploadDropzone.jsx'
import UploadProgress from '../components/upload/UploadProgress.jsx'
import { contentApi } from '../api/contentApi.js'
import useAuthStore from '../store/authStore.js'
import usePetStore from '../store/petStore.js'
import useToastStore from '../store/toastStore.js'

const initialMetadata = {
  document_date: '',
  document_type: 'medical_record',
  labels: '',
  notes: '',
}

function UploadPage() {
  const { pets, selectedPetId, selectPet, fetchPets, fetchAdminPets } = usePetStore()
  const user = useAuthStore((state) => state.user)
  const [progress, setProgress] = useState(0)
  const [latest, setLatest] = useState(null)
  const [metadata, setMetadata] = useState(initialMetadata)
  const [step, setStep] = useState(1)
  const pushToast = useToastStore((state) => state.push)
  const selectedPet = pets.find((pet) => pet._id === selectedPetId)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    ;(isAdmin ? fetchAdminPets : fetchPets)().catch(() => {})
  }, [fetchPets, fetchAdminPets, isAdmin])

  useEffect(() => {
    if (!latest?._id || !['uploaded', 'processing'].includes(latest.status)) return undefined
    const timer = window.setInterval(() => {
      contentApi.detail(latest._id).then((detail) => {
        setLatest(detail)
        if (!['uploaded', 'processing'].includes(detail.status)) {
          pushToast(detail.status === 'ready' ? 'Content is ready for chat.' : 'Content processing failed.', detail.status === 'ready' ? 'success' : 'error')
          window.clearInterval(timer)
        }
      }).catch(() => {})
    }, 3000)
    return () => window.clearInterval(timer)
  }, [latest, pushToast])

  const upload = async (file) => {
    if (!selectedPetId) return
    setProgress(1)
    const item = await contentApi.upload(selectedPetId, file, {
      ...metadata,
      labels: metadata.labels.split(',').map((label) => label.trim()).filter(Boolean),
    }, (event) => {
      setProgress(Math.round((event.loaded * 100) / (event.total || event.loaded)))
    })
    setLatest(item)
    pushToast('Upload received. Processing content...')
    setMetadata(initialMetadata)
    setStep(3)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="eyebrow"><FileUp className="h-4 w-4" /> Knowledge intake</span>
          <h1 className="page-title mt-4">Knowledge upload</h1>
          <p className="mt-2 max-w-2xl text-[#527b70]">Every upload becomes one content item, then text, transcript, chunks, embeddings, and retrieval context.</p>
        </div>
        {isAdmin ? <div className="surface-card rounded-[22px] p-3">
          <select className="field min-w-[260px]" value={selectedPetId || ''} onChange={(e) => selectPet(e.target.value)}>
            <option value="">Select pet</option>
            {pets.map((pet) => <option value={pet._id} key={pet._id}>{pet.name}</option>)}
          </select>
        </div> : selectedPet && <div className="chip accent-green">Uploading for {selectedPet.name}</div>}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          [1, 'Select pet'],
          [2, 'Describe record'],
          [3, 'Upload & track'],
        ].map(([number, label]) => (
          <button className={`rounded-[22px] border p-4 text-left transition ${step === number ? 'border-mint-500 bg-[#f1fbf7]' : 'border-[#d8ede5] bg-white'}`} type="button" onClick={() => setStep(number)} key={number}>
            <span className={`pill ${step > number ? 'accent-green' : 'accent-blue'}`}>{step > number ? <CheckCircle2 className="h-4 w-4" /> : number}</span>
            <p className="mt-2 font-black text-ink">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="surface-card rounded-[26px] p-5">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-ink">Choose the pet this record belongs to</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {pets.map((pet) => (
                  <button className={`rounded-[22px] border p-4 text-left ${selectedPetId === pet._id ? 'border-mint-500 bg-[#f1fbf7]' : 'border-[#d8ede5] bg-white'}`} type="button" onClick={() => { selectPet(pet._id); setStep(2) }} key={pet._id}>
                    <p className="font-black text-ink">{pet.name}</p>
                    <p className="text-sm capitalize text-[#527b70]">{pet.species}{pet.breed ? ` - ${pet.breed}` : ''}</p>
                  </button>
                ))}
              </div>
              {pets.length === 0 && <div className="empty-state mt-4 rounded-2xl p-6 text-center">Create a pet profile before uploading records.</div>}
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-black text-ink">Describe this document</h2>
              <p className="mt-1 text-sm text-[#527b70]">Good labels make chat and timeline retrieval more accurate.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input className="field" type="date" value={metadata.document_date} onChange={(e) => setMetadata({ ...metadata, document_date: e.target.value })} />
                <select className="field" value={metadata.document_type} onChange={(e) => setMetadata({ ...metadata, document_type: e.target.value })}>
                  <option value="medical_record">Medical record</option>
                  <option value="vaccination">Vaccination / Tiêm phòng</option>
                  <option value="lab_result">Lab result / Xét nghiệm</option>
                  <option value="prescription">Prescription / Đơn thuốc</option>
                  <option value="symptom_note">Symptom note / Triệu chứng</option>
                  <option value="diet">Diet / Dinh dưỡng</option>
                  <option value="image">Image / Hình ảnh</option>
                  <option value="other">Other</option>
                </select>
                <input className="field sm:col-span-2" placeholder="Labels: vaccine, rabies, xét nghiệm..." value={metadata.labels} onChange={(e) => setMetadata({ ...metadata, labels: e.target.value })} />
                <textarea className="field min-h-28 resize-none sm:col-span-2" placeholder="Notes for retrieval" value={metadata.notes} onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })} />
              </div>
              <button className="btn-primary mt-4" type="button" disabled={!selectedPetId} onClick={() => setStep(3)}>Continue to upload</button>
            </div>
          )}
          {step === 3 && <UploadDropzone onFile={upload} disabled={!selectedPetId} />}
        </section>
        <aside className="surface-card rounded-[26px] p-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf6ff] text-[#25608a]"><DatabaseZap className="h-6 w-6" /></div>
          <h2 className="mt-4 text-xl font-black text-ink">Document metadata</h2>
          <p className="mt-1 text-sm text-[#527b70]">Labels help hybrid retrieval route questions to the most relevant files.</p>
          <div className="mt-4 space-y-3 text-sm font-bold text-[#527b70]">
            <div className="rounded-2xl bg-white p-3">Pet: <span className="text-ink">{selectedPet?.name || 'Not selected'}</span></div>
            <div className="rounded-2xl bg-white p-3">Type: <span className="text-ink">{metadata.document_type}</span></div>
            <div className="rounded-2xl bg-white p-3">Labels: <span className="text-ink">{metadata.labels || 'None'}</span></div>
          </div>
          <h3 className="mt-6 text-sm font-black uppercase text-[#527b70]">Processing pipeline</h3>
          <div className="mt-3 space-y-3 text-sm font-bold text-[#527b70]">
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
