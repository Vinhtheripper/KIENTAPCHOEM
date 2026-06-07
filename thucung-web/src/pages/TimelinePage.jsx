import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarDays, FileText, Plus, RefreshCw, Stethoscope, Syringe, Trash2 } from 'lucide-react'
import ContentDetailPanel from '../components/content/ContentDetailPanel.jsx'
import { adminApi } from '../api/adminApi.js'
import { contentApi } from '../api/contentApi.js'
import { timelineApi } from '../api/timelineApi.js'
import useAuthStore from '../store/authStore.js'
import usePetStore from '../store/petStore.js'
import useToastStore from '../store/toastStore.js'

const eventTypes = [
  ['vaccination', 'Vaccination'],
  ['recheck', 'Recheck'],
  ['medical_record', 'Medical record'],
  ['lab_result', 'Lab result'],
  ['prescription', 'Prescription'],
  ['symptom_note', 'Symptom note'],
  ['diet', 'Diet'],
  ['medical_note', 'Medical note'],
]

const statuses = [
  ['planned', 'Planned'],
  ['done', 'Done'],
  ['overdue', 'Overdue'],
  ['cancelled', 'Cancelled'],
  ['missed', 'Missed'],
  ['profile', 'Profile'],
]

function eventTone(type) {
  if (type === 'vaccination') return 'accent-green'
  if (type === 'lab_result') return 'accent-blue'
  if (type === 'prescription') return 'accent-amber'
  if (type === 'symptom_note') return 'accent-coral'
  if (type === 'recheck') return 'accent-blue'
  return 'bg-white text-[#527b70]'
}

function sourceLabel(source) {
  if (source === 'timeline_event') return 'Scheduled'
  if (source === 'content') return 'Uploaded file'
  return 'Pet profile'
}

function makeDefaultForm(petId) {
  return {
    pet_id: petId || '',
    type: 'vaccination',
    title: '',
    date: '',
    status: 'planned',
    labels: '',
    notes: '',
    content_ids: [],
  }
}

function TimelinePage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'admin'
  const { selectedPetId, pets, selectPet, fetchPets, fetchAdminPets } = usePetStore()
  const pushToast = useToastStore((state) => state.push)
  const [events, setEvents] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [contentItems, setContentItems] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(() => makeDefaultForm(selectedPetId))
  const selectedPet = pets.find((pet) => pet._id === selectedPetId)

  useEffect(() => {
    ;(isAdmin ? fetchAdminPets : fetchPets)().catch(() => {})
  }, [fetchPets, fetchAdminPets, isAdmin])

  const loadTimeline = useCallback(async (petId = selectedPetId) => {
    if (!petId) return
    setLoading(true)
    try {
      const data = await timelineApi.get(petId)
      setEvents(data.events || [])
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [selectedPetId])

  useEffect(() => {
    if (!selectedPetId) return
    const load = isAdmin ? adminApi.content({ pet_id: selectedPetId }) : contentApi.list(selectedPetId)
    load.then(setContentItems).catch(() => setContentItems([]))
  }, [selectedPetId, isAdmin])

  useEffect(() => {
    if (!selectedPetId) return
    let active = true
    Promise.resolve()
      .then(() => {
        if (active) setLoading(true)
        return timelineApi.get(selectedPetId)
      })
      .then((data) => {
        if (active) setEvents(data.events || [])
      })
      .catch(() => {
        if (active) setEvents([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
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

  const submitEvent = async (event) => {
    event.preventDefault()
    const petId = form.pet_id || selectedPetId
    if (!petId || !form.title.trim()) return
    await timelineApi.create({
      ...form,
      pet_id: petId,
      labels: form.labels.split(',').map((label) => label.trim()).filter(Boolean),
      content_ids: form.content_ids,
      related_content_id: form.content_ids[0] || null,
      notes: form.notes || null,
    })
    pushToast('Timeline event created.')
    setForm(makeDefaultForm(petId))
    await loadTimeline(petId)
  }

  const markDone = async (event) => {
    if (!event.event_id) return
    await timelineApi.update(event.event_id, { status: 'done' })
    pushToast('Timeline event marked done.')
    await loadTimeline()
  }

  const deleteEvent = async (event) => {
    if (!event.event_id) return
    await timelineApi.remove(event.event_id)
    pushToast('Timeline event deleted.', 'warning')
    await loadTimeline()
  }

  const groupedStats = useMemo(() => {
    const planned = events.filter((event) => event.status === 'planned').length
    const done = events.filter((event) => event.status === 'done').length
    const files = events.filter((event) => event.source === 'content').length
    return [
      ['Planned care', planned],
      ['Completed', done],
      ['Linked files', files],
    ]
  }, [events])

  const boardGroups = useMemo(() => [
    ['Overdue', events.filter((event) => event.status === 'overdue')],
    ['Upcoming', events.filter((event) => ['planned', 'missed'].includes(event.status))],
    ['Completed', events.filter((event) => ['done', 'profile'].includes(event.status))],
    ['Documents', events.filter((event) => event.source === 'content' || event.content_id || event.content_ids?.length)],
  ].filter(([, rows]) => rows.length), [events])

  const renderEvent = (event) => (
    <article
      className={`grid gap-3 rounded-[22px] border p-4 text-left md:grid-cols-[160px_1fr] ${event.status === 'overdue' ? 'border-red-100 bg-red-50' : 'border-[#d8ede5] bg-white'}`}
      key={event.id}
    >
      <div>
        <span className={`pill ${eventTone(event.type)}`}>{event.type}</span>
        <p className="mt-2 text-xs font-bold text-[#527b70]">{event.date ? String(event.date).slice(0, 10) : 'No date'}</p>
        <span className="chip mt-2 px-2 py-1 text-[10px]">{sourceLabel(event.source)}</span>
      </div>
      <div>
        <p className="flex items-center gap-2 font-black text-ink">
          {event.type === 'vaccination' ? <Syringe className="h-4 w-4" /> : event.type === 'recheck' ? <Stethoscope className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          {event.title}
        </p>
        {event.notes && <p className="mt-2 text-sm leading-6 text-[#527b70]">{event.notes}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`chip px-2 py-1 text-[10px] ${event.status === 'overdue' ? 'accent-coral' : ''}`}>Status: {event.status}</span>
          {event.labels?.map((label) => <span className="chip px-2 py-1 text-[10px]" key={label}>{label}</span>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {event.content_ids?.map((contentId, index) => (
            <button className="btn-secondary min-h-10 px-3 py-2 text-sm" type="button" onClick={() => openContent(contentId)} key={contentId}>Open file {index + 1}</button>
          ))}
          {!event.content_ids?.length && event.content_id && <button className="btn-secondary min-h-10 px-3 py-2 text-sm" type="button" onClick={() => openContent(event.content_id)}>Open file</button>}
          {event.event_id && event.status !== 'done' && <button className="btn-secondary min-h-10 px-3 py-2 text-sm" type="button" onClick={() => markDone(event)}>Mark done</button>}
          {event.event_id && <button className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-sm font-black text-red-600" type="button" onClick={() => deleteEvent(event)}><Trash2 className="h-4 w-4" />Delete</button>}
        </div>
      </div>
    </article>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow"><CalendarDays className="h-4 w-4" /> Medical timeline</span>
          <h1 className="page-title mt-4">{selectedPet ? `${selectedPet.name}'s timeline` : 'Medical timeline'}</h1>
          <p className="mt-2 max-w-2xl text-[#527b70]">
            Schedule vaccinations, rechecks, medical documents, lab results, prescriptions, and owner notes in one synced clinical timeline.
          </p>
        </div>
        {isAdmin && (
          <select className="field w-full sm:w-80" value={selectedPetId || ''} onChange={(event) => selectPet(event.target.value)}>
            <option value="">Select pet</option>
            {pets.map((pet) => (
              <option value={pet._id} key={pet._id}>{pet.name} - {pet.owner_name || 'Unknown owner'}</option>
            ))}
          </select>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {groupedStats.map(([label, value]) => (
          <div className="stat-card p-4" key={label}>
            <p className="text-sm font-bold text-[#527b70]">{label}</p>
            <p className="mt-1 text-3xl font-black text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)]">
        <section className="surface-card rounded-[26px] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-ink">Timeline events</h2>
            <button className="btn-secondary h-11 min-h-11 px-4" type="button" onClick={() => loadTimeline()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          <div className="space-y-5">
            {loading && Array.from({ length: 4 }).map((_, index) => <div className="skeleton h-28 rounded-[22px]" key={index} />)}
            {!loading && boardGroups.map(([group, rows]) => (
              <div key={group}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-black text-ink">{group}</h3>
                  <span className="chip">{rows.length}</span>
                </div>
                <div className="space-y-3">{rows.map(renderEvent)}</div>
              </div>
            ))}
            {!loading && events.length === 0 && <div className="empty-state rounded-[24px] p-8 text-center font-bold text-[#527b70]">No timeline events yet.</div>}
          </div>
        </section>

        <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
          <form className="surface-card rounded-[26px] p-5" onSubmit={submitEvent}>
            <span className="eyebrow"><Plus className="h-4 w-4" /> Add clinical event</span>
            <div className="mt-4 grid gap-3">
              {!selectedPetId && <div className="empty-state rounded-2xl p-4 text-sm">Select a pet before adding a timeline event.</div>}
              <select className="field" value={form.pet_id || selectedPetId || ''} onChange={(event) => { selectPet(event.target.value); setForm({ ...form, pet_id: event.target.value }) }}>
                <option value="">Select pet</option>
                {pets.map((pet) => <option value={pet._id} key={pet._id}>{pet.name}{pet.owner_name ? ` - ${pet.owner_name}` : ''}</option>)}
              </select>
              <select className="field" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                {eventTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
              <input className="field" placeholder="Title, e.g. Rabies booster" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              <input className="field" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
              <select className="field" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                {statuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
              <input className="field" placeholder="Labels, comma separated" value={form.labels} onChange={(event) => setForm({ ...form, labels: event.target.value })} />
              <label className="space-y-1 text-sm font-bold text-[#527b70]">
                Link uploaded files
                <select
                  className="field min-h-32"
                  multiple
                  value={form.content_ids}
                  onChange={(event) => setForm({ ...form, content_ids: Array.from(event.target.selectedOptions).map((option) => option.value) })}
                >
                  {contentItems.map((item) => <option value={item._id} key={item._id}>{item.title}</option>)}
                </select>
              </label>
              <textarea className="field min-h-24 resize-none" placeholder="Notes for doctor/owner/chatbot context" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
              <button className="btn-primary w-full" type="submit" disabled={!(form.pet_id || selectedPetId) || !form.title.trim()}>
                <Plus className="h-4 w-4" />
                Add to timeline
              </button>
            </div>
          </form>

          <ContentDetailPanel item={selectedItem} loading={detailLoading} onClose={() => setSelectedItem(null)} onUpdated={(updated) => setSelectedItem(updated)} />
        </aside>
      </div>
    </div>
  )
}

export default TimelinePage
