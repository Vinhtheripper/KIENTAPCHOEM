import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, FileText, LayoutGrid, List, RefreshCw, Search, UploadCloud } from 'lucide-react'
import ContentDetailPanel from '../components/content/ContentDetailPanel.jsx'
import DocumentViewer from '../components/content/DocumentViewer.jsx'
import { adminApi } from '../api/adminApi.js'
import { contentApi } from '../api/contentApi.js'
import useAuthStore from '../store/authStore.js'
import usePetStore from '../store/petStore.js'
import useToastStore from '../store/toastStore.js'

function SelectDocumentPanel() {
  return (
    <div className="empty-state rounded-[26px] p-8 text-center">
      <FileText className="mx-auto h-10 w-10 text-mint-700" />
      <p className="mt-4 text-xl font-black text-ink">Select a document</p>
      <p className="mt-2 leading-6">Open any item on the left to preview the original file, extracted text, chunks, and retrieval metadata.</p>
    </div>
  )
}

function ContentPage() {
  const { selectedPetId, pets, fetchPets, fetchAdminPets } = usePetStore()
  const user = useAuthStore((state) => state.user)
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)
  const [viewMode, setViewMode] = useState('cards')
  const pushToast = useToastStore((state) => state.push)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    ;(isAdmin ? fetchAdminPets : fetchPets)().catch(() => {})
  }, [fetchPets, fetchAdminPets, isAdmin])

  useEffect(() => {
    let active = true
    const load = isAdmin ? adminApi.content() : contentApi.list(selectedPetId)
    load
      .then((rows) => {
        if (!active) return
        setItems(rows)
        setSelectedItem((current) => rows.find((item) => item._id === current?._id) || null)
      })
      .catch(() => {
        if (active) setItems([])
      })
      .finally(() => {
        if (active) setLoadingList(false)
      })
    return () => {
      active = false
    }
  }, [selectedPetId, isAdmin])

  const openDetail = async (item) => {
    setSelectedItem(item)
    setDetailLoading(true)
    try {
      const detail = await contentApi.detail(item._id)
      setSelectedItem(detail)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDetailUpdated = async (updated) => {
    setItems((current) => current.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)))
    setSelectedItem(updated)
  }

  const filteredItems = useMemo(() => items.filter((item) => {
    const metadata = item.metadata || {}
    const haystack = [item.title, item.type, item.status, metadata.document_type, metadata.document_date, metadata.notes, ...(metadata.labels || [])].join(' ').toLowerCase()
    const matchesSearch = !search || haystack.includes(search.toLowerCase())
    const matchesType = !typeFilter || metadata.document_type === typeFilter || item.type === typeFilter
    const matchesDate = !dateFilter || metadata.document_date === dateFilter
    return matchesSearch && matchesType && matchesDate
  }), [items, search, typeFilter, dateFilter])

  const readyCount = items.filter((item) => item.status === 'ready').length
  const processingCount = items.filter((item) => item.status === 'processing').length
  const petsById = useMemo(() => Object.fromEntries(pets.map((pet) => [pet._id, pet])), [pets])

  const reindex = async () => {
    if (!selectedPetId) return
    await contentApi.reindexPet(selectedPetId)
    pushToast('Pet content reindex started.', 'warning')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow"><FileStack className="h-4 w-4" /> {isAdmin ? 'Admin content library' : 'Retrieval library'}</span>
          <h1 className="page-title mt-4">{isAdmin ? 'All content' : 'Unified content'}</h1>
          <p className="mt-2 max-w-2xl text-[#527b70]">
            {isAdmin
              ? 'Inspect every uploaded file, processing status, labels, and extracted chunks across all users.'
              : 'Documents, media, transcripts, URLs, and images are tracked with one searchable architecture.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {selectedPetId && <button className="btn-secondary" type="button" onClick={reindex}><RefreshCw className="h-4 w-4" />Reindex pet</button>}
          {!isAdmin && <Link className="btn-primary" to="/app/upload"><UploadCloud className="h-4 w-4" />Upload</Link>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Total items', items.length],
          ['Ready for retrieval', readyCount],
          ['Processing', processingCount],
        ].map(([label, value]) => (
          <div className="stat-card p-4" key={label}>
            <p className="text-sm font-bold text-[#527b70]">{label}</p>
            <p className="mt-1 text-3xl font-black text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="surface-card grid gap-3 rounded-[24px] p-4 lg:grid-cols-[1fr_220px_180px_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b9588]" />
          <input className="field pl-11" placeholder="Search title, label, type, notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select className="field" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="medical_record">Medical record</option>
          <option value="vaccination">Vaccination</option>
          <option value="lab_result">Lab result</option>
          <option value="prescription">Prescription</option>
          <option value="symptom_note">Symptom note</option>
          <option value="diet">Diet</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>
        <input className="field" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        <div className="flex rounded-2xl bg-[#f1fbf7] p-1">
          <button className={`tab-button ${viewMode === 'cards' ? 'tab-button-active' : ''}`} type="button" onClick={() => setViewMode('cards')}><LayoutGrid className="h-4 w-4" /></button>
          <button className={`tab-button ${viewMode === 'table' ? 'tab-button-active' : ''}`} type="button" onClick={() => setViewMode('table')}><List className="h-4 w-4" /></button>
        </div>
      </div>

      {loadingList ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)]">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => <div className="skeleton h-36 rounded-[24px]" key={index} />)}
          </div>
          <div className="skeleton h-[560px] rounded-[26px]" />
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state rounded-[26px] p-8 text-center">
          <UploadCloud className="mx-auto h-10 w-10 text-mint-700" />
          <p className="mt-4 text-xl font-black text-ink">No content items yet</p>
          <p className="mt-2">Start with vaccine cards, lab results, prescriptions, or visit notes so the assistant can answer with real pet context.</p>
          {!isAdmin && <Link className="btn-primary mt-5" to="/app/upload">Go to upload</Link>}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)]">
          <section className={viewMode === 'cards' ? 'grid content-start gap-4 md:grid-cols-2' : 'space-y-3'}>
            {filteredItems.map((item) => viewMode === 'cards' ? (
                <DocumentViewer
                  key={item._id}
                  item={item}
                  petName={petsById[item.pet_id]?.name}
                  selected={selectedItem?._id === item._id}
                  onOpen={openDetail}
                />
              ) : (
                <button className={`data-row grid w-full gap-3 rounded-2xl p-4 text-left md:grid-cols-[1fr_140px_120px] ${selectedItem?._id === item._id ? 'border-mint-500 bg-[#f1fbf7]' : ''}`} key={item._id} type="button" onClick={() => openDetail(item)}>
                  <div>
                    <p className="font-black text-ink">{item.title}</p>
                    <p className="text-sm text-[#527b70]">{petsById[item.pet_id]?.name || item.owner_name || 'Linked pet'}</p>
                  </div>
                  <span className="chip w-fit">{item.metadata?.document_type || item.type}</span>
                  <span className="chip w-fit">{item.status}</span>
                </button>
              )
            )}
            {filteredItems.length === 0 && (
              <div className="empty-state rounded-[26px] p-8 text-center md:col-span-2">
                <p className="text-xl font-black text-ink">No matching documents</p>
                <p className="mt-2">Try clearing the search, type, or date filters.</p>
              </div>
            )}
          </section>
          <section className="xl:sticky xl:top-28 xl:self-start">
            {selectedItem || detailLoading ? (
              <ContentDetailPanel item={selectedItem} loading={detailLoading} onClose={() => setSelectedItem(null)} onUpdated={handleDetailUpdated} />
            ) : (
              <SelectDocumentPanel />
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default ContentPage
