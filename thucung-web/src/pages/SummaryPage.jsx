import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ClipboardList, FileText, HeartPulse } from 'lucide-react'
import { petApi } from '../api/petApi.js'
import usePetStore from '../store/petStore.js'

function SummaryPage() {
  const { selectedPetId, pets, fetchPets } = usePetStore()
  const [summary, setSummary] = useState(null)
  const selectedPet = pets.find((pet) => pet._id === selectedPetId)

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  useEffect(() => {
    if (!selectedPetId) return
    petApi.summary(selectedPetId).then(setSummary).catch(() => setSummary(null))
  }, [selectedPetId])

  const checks = useMemo(() => {
    const rows = [
      ['Profile basics', Boolean(summary?.pet_name && summary?.species)],
      ['Weight recorded', Boolean(summary?.weight)],
      ['Allergy review', Boolean(summary?.allergies?.length)],
      ['Vaccine notes', Boolean(summary?.vaccines?.length || summary?.upcoming_care?.some((event) => event.type === 'vaccination'))],
      ['Uploaded records', Boolean(summary?.content_count)],
      ['Care reminders', Boolean(summary?.upcoming_care?.length)],
    ]
    const score = Math.round((rows.filter(([, ok]) => ok).length / rows.length) * 100)
    return { rows, score }
  }, [summary])

  return (
    <div className="space-y-5">
      <section className="surface-card rounded-[28px] p-6">
        <span className="eyebrow"><ClipboardList className="h-4 w-4" /> Medical summary</span>
        <h1 className="page-title mt-4">{selectedPet ? `${selectedPet.name}'s summary` : 'Pet medical summary'}</h1>
        <p className="mt-3 max-w-3xl whitespace-pre-line text-[#527b70]">{summary?.summary_text || 'Select a pet and add records to generate a connected care summary.'}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.72fr_1fr]">
        <section className="surface-card rounded-[26px] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-ink">Readiness score</h2>
            <span className={`pill ${checks.score >= 70 ? 'accent-green' : 'accent-amber'}`}>{checks.score}%</span>
          </div>
          <div className="mt-5 space-y-3">
            {checks.rows.map(([label, ok]) => (
              <div className="flex items-center justify-between rounded-2xl border border-[#d8ede5] bg-white p-3" key={label}>
                <span className="font-bold text-[#527b70]">{label}</span>
                {ok ? <CheckCircle2 className="h-5 w-5 text-mint-700" /> : <AlertTriangle className="h-5 w-5 text-amber-600" />}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            [HeartPulse, 'Allergies', summary?.allergies?.join(', ') || 'None recorded'],
            [HeartPulse, 'Conditions', summary?.chronic_conditions?.join(', ') || 'None recorded'],
            [HeartPulse, 'Medications', summary?.medications?.join(', ') || 'None recorded'],
            [FileText, 'Records', `${summary?.content_count ?? 0} uploaded records`],
          ].map(([Icon, label, value]) => (
            <div className="surface-card rounded-[24px] p-5" key={label}>
              <Icon className="h-6 w-6 text-mint-700" />
              <p className="mt-3 text-sm font-black uppercase text-[#527b70]">{label}</p>
              <p className="mt-1 font-black text-ink">{value}</p>
            </div>
          ))}
        </section>
      </div>

      <section className="surface-card rounded-[26px] p-5">
        <h2 className="text-xl font-black text-ink">Upcoming care</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {summary?.upcoming_care?.map((event, index) => (
            <div className="rounded-2xl border border-[#d8ede5] bg-[#f8fcfa] p-4" key={`${event.title}-${index}`}>
              <span className={`chip ${event.status === 'overdue' ? 'accent-coral' : 'accent-amber'}`}>{event.status}</span>
              <p className="mt-2 font-black text-ink">{event.title}</p>
              <p className="text-sm text-[#527b70]">{event.date || 'No date'} - {event.type}</p>
            </div>
          ))}
          {!summary?.upcoming_care?.length && <div className="empty-state rounded-2xl p-6 text-center md:col-span-2">No planned care yet. Add a vaccination or recheck in Timeline.</div>}
        </div>
      </section>
    </div>
  )
}

export default SummaryPage
