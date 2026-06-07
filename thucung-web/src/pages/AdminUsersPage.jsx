import { useEffect, useMemo, useState } from 'react'
import { FileText, Mail, PawPrint, Search, ShieldCheck, Users } from 'lucide-react'
import { adminApi } from '../api/adminApi.js'

function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [pets, setPets] = useState([])
  const [content, setContent] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    adminApi.users()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = useMemo(() => users.filter((user) => {
    const haystack = [user.full_name, user.email, user.role].join(' ').toLowerCase()
    return !search || haystack.includes(search.toLowerCase())
  }), [users, search])

  const selectUser = async (user) => {
    setSelectedUser(user)
    setDetailLoading(true)
    try {
      const [petRows, contentRows] = await Promise.all([
        adminApi.pets(user._id),
        adminApi.content({ owner_id: user._id }),
      ])
      setPets(petRows)
      setContent(contentRows)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow"><Users className="h-4 w-4" /> Admin console</span>
          <h1 className="page-title mt-4">User management</h1>
          <p className="mt-2 max-w-2xl text-[#527b70]">Inspect each user with their pet profiles and uploaded knowledge without entering the owner workflow.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Users', users.length, Users],
          ['Selected pets', selectedUser ? pets.length : '- ', PawPrint],
          ['Selected content', selectedUser ? content.length : '- ', FileText],
        ].map(([label, value, Icon]) => (
          <div className="stat-card p-4" key={label}>
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-[#effbf6] text-mint-700">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-3xl font-black text-ink">{value}</p>
            <p className="text-sm font-bold text-[#527b70]">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.74fr)]">
        <section className="surface-card rounded-[26px] p-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b9588]" />
            <input className="field pl-11" placeholder="Search users by name, email, role..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>

          <div className="mt-4 space-y-3">
            {loading && Array.from({ length: 4 }).map((_, index) => <div className="skeleton h-20 rounded-2xl" key={index} />)}
            {!loading && filteredUsers.map((user) => (
              <button
                className={`data-row w-full rounded-2xl p-4 text-left ${selectedUser?._id === user._id ? 'border-mint-500 bg-[#f1fbf7] ring-4 ring-mint-500/10' : ''}`}
                key={user._id}
                type="button"
                onClick={() => selectUser(user)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-ink">{user.full_name}</p>
                    <p className="mt-1 flex items-center gap-2 break-all text-sm text-[#527b70]"><Mail className="h-4 w-4 shrink-0" />{user.email}</p>
                  </div>
                  <span className={`chip shrink-0 ${user.role === 'admin' ? 'accent-amber' : ''}`}>{user.role}</span>
                </div>
              </button>
            ))}
            {!loading && filteredUsers.length === 0 && <div className="empty-state rounded-[24px] p-8 text-center">No matching users.</div>}
          </div>
        </section>

        <aside className="surface-card rounded-[26px] p-5 xl:sticky xl:top-28 xl:self-start">
          {!selectedUser ? (
            <div className="empty-state rounded-[24px] p-8 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-mint-700" />
              <p className="mt-4 text-xl font-black text-ink">Select a user</p>
              <p className="mt-2">User detail shows owned pets and uploaded content for support/debugging.</p>
            </div>
          ) : (
            <div>
              <div className="border-b border-[#d8ede5] pb-4">
                <p className="text-xs font-black uppercase text-[#527b70]">User detail</p>
                <h2 className="mt-1 break-words text-2xl font-black text-ink">{selectedUser.full_name}</h2>
                <p className="mt-1 break-all text-sm text-[#527b70]">{selectedUser.email}</p>
              </div>

              {detailLoading ? (
                <div className="mt-5 space-y-3">
                  <div className="skeleton h-24 rounded-2xl" />
                  <div className="skeleton h-52 rounded-2xl" />
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="mb-2 flex items-center gap-2 font-black text-ink"><PawPrint className="h-4 w-4" />Pets ({pets.length})</p>
                    <div className="space-y-2">
                      {pets.map((pet) => (
                        <div className="rounded-2xl border border-[#d8ede5] bg-[#f8fcfa] p-3" key={pet._id}>
                          <p className="font-black text-ink">{pet.name}</p>
                          <p className="text-sm capitalize text-[#527b70]">{pet.species}{pet.breed ? ` - ${pet.breed}` : ''}</p>
                        </div>
                      ))}
                      {pets.length === 0 && <div className="empty-state rounded-2xl p-4 text-center">No pets.</div>}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-2 font-black text-ink"><FileText className="h-4 w-4" />Content ({content.length})</p>
                    <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                      {content.map((item) => (
                        <div className="rounded-2xl border border-[#d8ede5] bg-white p-3" key={item._id}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate font-black text-ink">{item.title}</p>
                              <p className="text-sm capitalize text-[#527b70]">{item.metadata?.document_type || item.type}</p>
                            </div>
                            <span className="chip shrink-0">{item.status}</span>
                          </div>
                        </div>
                      ))}
                      {content.length === 0 && <div className="empty-state rounded-2xl p-4 text-center">No content.</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default AdminUsersPage
