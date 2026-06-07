import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { adminApi } from '../api/adminApi.js'

function AdminUsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    adminApi.users().then(setUsers).catch(() => setUsers([]))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow"><Users className="h-4 w-4" /> Admin</span>
        <h1 className="page-title mt-4">User management</h1>
        <p className="mt-2 max-w-2xl text-[#527b70]">Admin can see registered users and inspect their pets/content from shared tabs.</p>
      </div>

      <section className="surface-card overflow-hidden rounded-[26px]">
        <div className="grid grid-cols-[1.2fr_1.4fr_0.7fr] gap-3 border-b border-[#d8ede5] bg-[#f8fcfa] px-5 py-3 text-xs font-black uppercase text-[#527b70]">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
        </div>
        {users.map((user) => (
          <div className="grid grid-cols-[1.2fr_1.4fr_0.7fr] gap-3 border-b border-[#eef6f2] px-5 py-4 text-sm last:border-b-0" key={user._id}>
            <span className="font-black text-ink">{user.full_name}</span>
            <span className="break-all text-[#527b70]">{user.email}</span>
            <span className="chip w-fit">{user.role}</span>
          </div>
        ))}
        {users.length === 0 && <div className="p-8 text-center font-bold text-[#527b70]">No users found.</div>}
      </section>
    </div>
  )
}

export default AdminUsersPage
