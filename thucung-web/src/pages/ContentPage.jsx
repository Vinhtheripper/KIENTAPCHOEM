import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, UploadCloud } from 'lucide-react'
import ContentDetailPanel from '../components/content/ContentDetailPanel.jsx'
import DocumentViewer from '../components/content/DocumentViewer.jsx'
import { adminApi } from '../api/adminApi.js'
import { contentApi } from '../api/contentApi.js'
import useAuthStore from '../store/authStore.js'
import usePetStore from '../store/petStore.js'

function ContentPage() {
  const { selectedPetId, fetchPets, fetchAdminPets } = usePetStore()
  const user = useAuthStore((state) => state.user)
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    ;(isAdmin ? fetchAdminPets : fetchPets)().catch(() => {})
  }, [fetchPets, fetchAdminPets, isAdmin])

  useEffect(() => {
    const load = isAdmin ? adminApi.content() : contentApi.list(selectedPetId)
    load.then(setItems).catch(() => setItems([]))
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

  const filteredItems = items.filter((item) => {
    const metadata = item.metadata || {}
    const haystack = [item.title, item.type, metadata.document_type, metadata.document_date, metadata.notes, ...(metadata.labels || [])].join(' ').toLowerCase()
    const matchesSearch = !search || haystack.includes(search.toLowerCase())
    const matchesType = !typeFilter || metadata.document_type === typeFilter || item.type === typeFilter
    const matchesDate = !dateFilter || metadata.document_date === dateFilter
    return matchesSearch && matchesType && matchesDate
  })

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow"><FileStack className="h-4 w-4" /> Retrieval library</span>
        <h1 className="page-title mt-4">Unified content</h1>
        <p className="mt-2 max-w-2xl text-[#527b70]">Documents, media, transcripts, URLs, and images are tracked with one architecture.</p>
      </div>
      <div className="surface-card grid gap-3 rounded-[24px] p-4 md:grid-cols-[1fr_220px_180px]">
        <input className="field" placeholder="Search title, label, type, notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="field" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="vaccination">Vaccination</option>
          <option value="lab_result">Lab result</option>
          <option value="prescription">Prescription</option>
          <option value="symptom_note">Symptom note</option>
          <option value="diet">Diet</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
        </select>
        <input className="field" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map((item) => <DocumentViewer key={item._id} item={item} onOpen={openDetail} />)}
        </div>
        <ContentDetailPanel item={selectedItem} loading={detailLoading} onClose={() => setSelectedItem(null)} />
      </div>
      {items.length === 0 && (
        <div className="empty-state rounded-[26px] p-8 text-center">
          <UploadCloud className="mx-auto h-10 w-10 text-mint-700" />
          <p className="mt-4 text-xl font-black text-ink">No content items yet</p>
          <p className="mt-2">Upload records after selecting a pet to build the searchable knowledge base.</p>
          <Link className="btn-primary mt-5" to="/app/upload">Go to upload</Link>
        </div>
      )}
    </div>
  )
}

export default ContentPage
