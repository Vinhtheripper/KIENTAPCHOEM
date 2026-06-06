import { LogOut, Stethoscope } from 'lucide-react'
import useAuthStore from '../../store/authStore.js'

function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/70 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="logo-mark h-11 w-11 rounded-2xl">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-black text-ink">GPet Vet AI</p>
            <p className="text-xs font-bold text-mint-700">Medical hub</p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-ink">{user?.full_name || 'Pet owner'}</p>
          <p className="text-xs text-mint-700">{user?.role || 'pet_owner'}</p>
        </div>
        <button className="btn-secondary h-12 w-12 rounded-2xl p-0" type="button" onClick={logout} aria-label="Logout">
          <LogOut className="h-7 w-7" />
        </button>
      </div>
    </header>
  )
}

export default Navbar
