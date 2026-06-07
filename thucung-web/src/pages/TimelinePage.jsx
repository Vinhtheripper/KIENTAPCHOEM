import { useEffect, useState } from 'react'
import { CalendarDays, FileText, Syringe } from 'lucide-react'
import ContentDetailPanel from '../components/content/ContentDetailPanel.jsx'
import { contentApi } from '../api/contentApi.js'
import { timelineApi } from '../api/timelineApi.js'
import usePetStore from '../store/petStore.js'

function eventTone(type) {
  if (type === 'vaccination') return 'accent-green'
  if (type === 'lab_result') return 'accent-blue'
  if (type === 'prescription') return 'accent-amber'
  if (type === 'symptom_note') return 'accent-coral'
  return 'bg-white text-[#527b70]'
}

function TimelinePage() {
  const { selectedPetId, pets, fetchPets } = usePetStore()
  const [events, setEvents] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const selectedPet = pets.find((pet) => pet._id === selectedPetId)

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  useEffect(() => {
    if (!selectedPetId) return
    timelineApi.get(selectedPetId).then((data) => setEvents(data.events || [])).catch(() => setEvents([]))
  }, [selectedPetId])

  const openContent = async (contentId) => {
    if (!contentId) return
    setDetailLoading(true)
    setSelectedItem({ title: 'Loading...' })
    try {
      setSelectedItem(await contentApi.detail(contentId))
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow"><CalendarDays className="h-4 w-4" /> Medical timeline</span>
        <h1 className="page-title mt-4">{selectedPet ? `${selectedPet.name}'s timeline` : 'Medical timeline'}</h1>
        <p className="mt-2 max-w-2xl text-[#527b70]">A chronological view of uploaded records, profile notes, vaccines, lab results, and care events.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <section className="surface-card rounded-[26px] p-5">
          <div className="space-y-4">
            {events.map((event) => (
              <button
                className="grid w-full gap-3 rounded-[22px] border border-[#d8ede5] bg-white p-4 text-left transition hover:border-mint-500 md:grid-cols-[150px_1fr]"
                key={event.id}
                type="button"
                onClick={() => openContent(event.content_id)}
              >
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${eventTone(event.type)}`}>{event.type}</span>
                  <p className="mt-2 text-xs font-bold text-[#527b70]">{event.date ? String(event.date).slice(0, 10) : 'No date'}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-black text-ink">{event.type === 'vaccination' ? <Syringe className="h-4 w-4" /> : <FileText className="h-4 w-4" />}{event.title}</p>
                  {event.notes && <p className="mt-2 text-sm leading-6 text-[#527b70]">{event.notes}</p>}
                  {!!event.labels?.length && <div className="mt-2 flex flex-wrap gap-2">{event.labels.map((label) => <span className="chip px-2 py-1 text-[10px]" key={label}>{label}</span>)}</div>}
                </div>
              </button>
            ))}
            {events.length === 0 && <div className="empty-state rounded-[24px] p-8 text-center font-bold text-[#527b70]">No timeline events yet.</div>}
          </div>
        </section>
        <ContentDetailPanel item={selectedItem} loading={detailLoading} onClose={() => setSelectedItem(null)} onUpdated={(updated) => setSelectedItem(updated)} />
      </div>
    </div>
  )
}

export default TimelinePage
