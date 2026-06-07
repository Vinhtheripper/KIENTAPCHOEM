import { useEffect, useState } from 'react'
import { FileText, PawPrint, Users } from 'lucide-react'
import { adminApi } from '../api/adminApi.js'

function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [pets, setPets] = useState([])
  const [content, setContent] = useState([])

  useEffect(() => {
    adminApi.users().then(setUsers).catch(() => setUsers([]))
  }, [])

  const selectUser = async (user) => {
    setSelectedUser(user)
    const [petRows, contentRows] = await Promise.all([
      adminApi.pets(user._id),
      adminApi.content({ owner_id: user._id }),
    ])
    setPets(petRows)
    setContent(contentRows)
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow"><Users className="h-4 w-4" /> Admin</span>
        <h1 className="page-title mt-4">User management</h1>
        <p className="mt-2 max-w-2xl text-[#527b70]">Admin can see registered users and inspect their pets/content from shared tabs.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <section className="surface-card overflow-hidden rounded-[26px]">
          <div className="grid grid-cols-[1.2fr_1.4fr_0.7fr] gap-3 border-b border-[#d8ede5] bg-[#f8fcfa] px-5 py-3 text-xs font-black uppercase text-[#527b70]">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
          </div>
          {users.map((user) => (
            <button className={`grid w-full grid-cols-[1.2fr_1.4fr_0.7fr] gap-3 border-b border-[#eef6f2] px-5 py-4 text-left text-sm last:border-b-0 ${selectedUser?._id === user._id ? 'bg-[#f1fbf7]' : 'hover:bg-[#f8fcfa]'}`} key={user._id} type="button" onClick={() => selectUser(user)}>
              <span className="font-black text-ink">{user.full_name}</span>
              <span className="break-all text-[#527b70]">{user.email}</span>
              <span className="chip w-fit">{user.role}</span>
            </button>
          ))}
          {users.length === 0 && <div className="p-8 text-center font-bold text-[#527b70]">No users found.</div>}
        </section>

        <aside className="surface-card rounded-[26px] p-5">
          <h2 className="text-xl font-black text-ink">{selectedUser ? selectedUser.full_name : 'Select a user'}</h2>
          <p className="mt-1 break-all text-sm text-[#527b70]">{selectedUser?.email || 'Click a user to inspect data.'}</p>
          {selectedUser && (
            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-2 flex items-center gap-2 font-black text-ink"><PawPrint className="h-4 w-4" />Pets ({pets.length})</p>
                <div className="space-y-2">
                  {pets.map((pet) => <div className="rounded-2xl bg-[#f8fcfa] p-3 text-sm font-bold text-[#527b70]" key={pet._id}>{pet.name} - {pet.species}</div>)}
                </div>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 font-black text-ink"><FileText className="h-4 w-4" />Content ({content.length})</p>
                <div className="max-h-72 space-y-2 overflow-y-auto">
                  {content.map((item) => <div className="rounded-2xl bg-[#f8fcfa] p-3 text-sm font-bold text-[#527b70]" key={item._id}>{item.title} ({item.status})</div>)}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default AdminUsersPage
