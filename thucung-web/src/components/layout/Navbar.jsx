import { LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore.js'

function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-10 border-b border-white/70 bg-white/62 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="flex-1" />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-ink">{user?.full_name || 'Pet owner'}</p>
          <p className="text-xs text-mint-700">{user?.role || 'pet_owner'}</p>
        </div>
        <button className="btn-secondary h-12 w-12 p-0" type="button" onClick={logout} aria-label="Logout">
          <LogOut className="h-7 w-7" />
        </button>
      </div>
    </header>
  )
}

export default Navbar
