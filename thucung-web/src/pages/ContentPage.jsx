import { useEffect, useState } from 'react'
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
        <h1 className="page-title">Unified content</h1>
        <p className="mt-2 text-[#527b70]">Documents, media, transcripts, URLs, and images are tracked with one architecture.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => <DocumentViewer key={item._id} item={item} />)}
      </div>
      {items.length === 0 && <div className="glass-panel rounded-[24px] p-8 text-center font-bold text-[#527b70]">No content items yet.</div>}
    </div>
  )
}

export default ContentPage
