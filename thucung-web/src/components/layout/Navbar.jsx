import { Bell, LogOut, Search } from 'lucide-react'
import useAuthStore from '../../store/authStore.js'

function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-10 border-b border-white/70 bg-white/62 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="relative hidden flex-1 sm:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mint-700" />
          <input className="field pl-11" placeholder="Search pets, vaccines, documents..." />
        </div>
        <button className="btn-secondary h-11 w-11 p-0" type="button" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-ink">{user?.full_name || 'Pet owner'}</p>
          <p className="text-xs text-mint-700">{user?.role || 'pet_owner'}</p>
        </div>
        <button className="btn-secondary h-11 w-11 p-0" type="button" onClick={logout} aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

export default Navbar
