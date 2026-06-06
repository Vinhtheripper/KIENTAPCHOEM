import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, UploadCloud } from 'lucide-react'
import DocumentViewer from '../components/content/DocumentViewer.jsx'
import { contentApi } from '../api/contentApi.js'
import usePetStore from '../store/petStore.js'

function ContentPage() {
  const { selectedPetId, fetchPets } = usePetStore()
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  useEffect(() => {
    contentApi.list(selectedPetId).then(setItems).catch(() => setItems([]))
  }, [selectedPetId])

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow"><FileStack className="h-4 w-4" /> Retrieval library</span>
        <h1 className="page-title mt-4">Unified content</h1>
        <p className="mt-2 max-w-2xl text-[#527b70]">Documents, media, transcripts, URLs, and images are tracked with one architecture.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => <DocumentViewer key={item._id} item={item} />)}
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
