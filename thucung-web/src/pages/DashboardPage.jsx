import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, CalendarDays, FileText, HeartPulse, Plus, ShieldCheck, Syringe, UploadCloud, Users } from 'lucide-react'
import { adminApi } from '../api/adminApi.js'
import { petApi } from '../api/petApi.js'
import useAuthStore from '../store/authStore.js'
import usePetStore from '../store/petStore.js'
import PetEditModal from '../components/pet/PetEditModal.jsx'
import PetCard from '../components/pet/PetCard.jsx'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [pets, setPets] = useState([])
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminApi.users(), adminApi.pets(), adminApi.content()])
      .then(([userRows, petRows, contentRows]) => {
        setUsers(userRows)
        setPets(petRows)
        setContent(contentRows)
      })
      .catch(() => {
        setUsers([])
        setPets([])
        setContent([])
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const ready = content.filter((item) => item.status === 'ready').length
    const processing = content.filter((item) => item.status === 'processing').length
    return [
      [Users, users.length, 'Registered users', 'accent-blue', '/app/users'],
      [HeartPulse, pets.length, 'Pet profiles', 'accent-green', '/app/pets'],
      [FileText, content.length, 'Content items', 'accent-amber', '/app/content'],
      [ShieldCheck, processing || ready, processing ? 'Processing items' : 'Ready items', processing ? 'accent-coral' : 'accent-green', '/app/content'],
    ]
  }, [users, pets, content])

  const recentContent = content.slice(0, 5)
  const recentUsers = users.slice(0, 5)

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[28px] p-6 lg:p-8">
        <span className="eyebrow"><ShieldCheck className="h-4 w-4" /> Admin console</span>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="page-title">System overview</h1>
            <p className="mt-3 max-w-2xl text-[#527b70]">Monitor users, pet profiles, uploaded documents, and ingestion health from a separate administrator workspace.</p>
          </div>
          <Link className="btn-primary" to="/app/users">Manage users <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div className="skeleton h-36 rounded-[22px]" key={index} />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([Icon, value, label, accent, to]) => (
            <Link className="stat-card block transition hover:-translate-y-1 hover:border-mint-500 hover:shadow-xl hover:shadow-mint-500/10" key={label} to={to}>
              <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${accent}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-black text-ink">{value}</p>
              <p className="text-sm font-bold text-[#527b70]">{label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="surface-card rounded-[26px] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-ink">Recent users</h2>
            <Link className="font-black text-mint-700" to="/app/users">View all</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div className="data-row rounded-2xl p-4" key={user._id}>
                <p className="font-black text-ink">{user.full_name}</p>
                <p className="break-all text-sm text-[#527b70]">{user.email}</p>
                <span className="chip mt-2">{user.role}</span>
              </div>
            ))}
            {!recentUsers.length && <div className="empty-state rounded-2xl p-5 text-center">No users found.</div>}
          </div>
        </section>

        <section className="surface-card rounded-[26px] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-ink">Recent content</h2>
            <Link className="font-black text-mint-700" to="/app/content">Open library</Link>
          </div>
          <div className="space-y-3">
            {recentContent.map((item) => (
              <div className="data-row rounded-2xl p-4" key={item._id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-ink">{item.title}</p>
                    <p className="text-sm capitalize text-[#527b70]">{item.metadata?.document_type || item.type}</p>
                  </div>
                  <span className="chip shrink-0">{item.status}</span>
                </div>
              </div>
            ))}
            {!recentContent.length && <div className="empty-state rounded-2xl p-5 text-center">No content found.</div>}
          </div>
        </section>
      </div>
    </div>
  )
}

function OwnerDashboard() {
  const { pets, selectedPetId, selectPet, fetchPets, deletePet } = usePetStore()
  const [editingPet, setEditingPet] = useState(null)
  const [summary, setSummary] = useState(null)
  const selectedPet = pets.find((pet) => pet._id === selectedPetId)

  useEffect(() => {
    fetchPets().catch(() => {})
  }, [fetchPets])

  useEffect(() => {
    if (!selectedPetId) return
    petApi.summary(selectedPetId).then(setSummary).catch(() => setSummary(null))
  }, [selectedPetId])

  return (
    <div className="space-y-6">
      <div className="surface-card overflow-hidden rounded-[28px]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
          <div>
            <span className="eyebrow"><ShieldCheck className="h-4 w-4" /> Pet command center</span>
            <h1 className="page-title mt-4">{selectedPet ? `${selectedPet.name}'s care hub` : 'Pet health dashboard'}</h1>
            <p className="mt-3 max-w-2xl whitespace-pre-line text-[#527b70]">{summary?.summary_text || 'Manage profiles, uploaded knowledge, vaccine timeline, and AI veterinary guidance in one workspace.'}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/app/pets"><Plus className="h-4 w-4" />Add pet</Link>
              <Link className="btn-secondary" to="/app/upload"><UploadCloud className="h-4 w-4" />Upload record</Link>
              <Link className="btn-secondary" to="/app/timeline"><CalendarDays className="h-4 w-4" />Timeline</Link>
              <Link className="btn-secondary" to="/app/chat">Ask assistant <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="rounded-[24px] border border-[#d8ede5] bg-[#f8fcfa] p-5">
            <p className="text-sm font-black uppercase text-[#17785d]">Selected pet snapshot</p>
            <div className="mt-5 grid gap-3">
              {[
                ['Profiles', `${pets.length} active`],
                ['Records', `${summary?.content_count ?? 0} linked`],
                ['Conditions', summary?.chronic_conditions?.length ? summary.chronic_conditions.join(', ') : 'None recorded'],
                ['Allergies', summary?.allergies?.length ? summary.allergies.join(', ') : 'None recorded'],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3" key={label}>
                  <span className="text-sm font-bold text-[#527b70]">{label}</span>
                  <span className="max-w-[160px] truncate text-right font-black text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [HeartPulse, pets.length, 'Pets managed', 'accent-green'],
          [FileText, summary?.content_count ?? 0, 'Linked records', 'accent-blue'],
          [Syringe, summary?.upcoming_care?.length ?? 0, 'Care reminders', 'accent-amber'],
          [Bot, 'Gemini', 'Cloud AI model', 'accent-coral'],
        ].map(([Icon, value, label, accent]) => (
          <div className="stat-card" key={label}>
            <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${accent}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-3xl font-black text-ink">{value}</p>
            <p className="text-sm font-bold text-[#527b70]">{label}</p>
          </div>
        ))}
      </div>
      <section>
        {!!summary?.upcoming_care?.length && (
          <div className="surface-card mb-5 rounded-[24px] p-5">
            <h2 className="text-xl font-black text-ink">Upcoming care reminders</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {summary.upcoming_care.slice(0, 4).map((event, index) => (
                <div className="rounded-2xl border border-[#d8ede5] bg-[#f8fcfa] p-4" key={`${event.title}-${index}`}>
                  <span className={`chip ${event.status === 'overdue' ? 'accent-coral' : 'accent-amber'}`}>{event.status}</span>
                  <p className="mt-2 font-black text-ink">{event.title}</p>
                  <p className="text-sm text-[#527b70]">{event.date || 'No date'} - {event.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <h2 className="mb-3 text-xl font-black text-ink">Your pets</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} selected={pet._id === selectedPetId} onSelect={selectPet} onDelete={deletePet} onEdit={setEditingPet} />)}
        </div>
        {pets.length === 0 && (
          <div className="empty-state rounded-[24px] p-8 text-center">
            <p className="text-xl font-black text-ink">No pet profiles yet</p>
            <p className="mt-2">Create the first profile so uploads and chat can attach to the right pet.</p>
            <Link className="btn-primary mt-5" to="/app/pets"><Plus className="h-4 w-4" />Create profile</Link>
          </div>
        )}
      </section>
      <PetEditModal pet={editingPet} onClose={() => setEditingPet(null)} />
    </div>
  )
}

function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  return user?.role === 'admin' ? <AdminDashboard /> : <OwnerDashboard />
}

export default DashboardPage
