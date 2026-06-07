import { Stethoscope } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import { linksForRole } from './navLinks.jsx'

function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const links = linksForRole(user?.role)

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/75 bg-white/70 p-5 backdrop-blur-2xl lg:block">
      <div className="mb-8 flex items-center gap-3 rounded-[22px] bg-white/75 p-3 shadow-sm">
        <div className="logo-mark h-12 w-12 rounded-2xl">
          <Stethoscope className="h-7 w-7" />
        </div>
        <div>
          <p className="text-lg font-black text-ink">GPet Vet AI</p>
          <p className="text-sm text-mint-700">Medical memory hub</p>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                isActive
                  ? 'bg-[#17312b] text-white shadow-lg shadow-[#17312b]/15'
                  : 'text-[#315e52] hover:bg-white hover:text-ink'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-5 left-5 right-5 rounded-[22px] border border-[#d9ece5] bg-[#f5fbf8] p-4">
        <p className="text-sm font-black text-ink">AI safety note</p>
        <p className="mt-1 text-xs leading-5 text-[#527b70]">Vet guidance is informational and never replaces professional diagnosis.</p>
      </div>
    </aside>
  )
}

export default Sidebar
