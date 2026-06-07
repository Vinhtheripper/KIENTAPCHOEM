import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import { linksForRole } from './navLinks.jsx'

function MobileNav() {
  const user = useAuthStore((state) => state.user)
  const links = linksForRole(user?.role)

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-30 rounded-[22px] border border-[#d9ece5] bg-white/92 p-2 shadow-2xl shadow-[#17312b]/10 backdrop-blur-2xl lg:hidden">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))` }}>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-black transition ${
                isActive ? 'bg-[#17312b] text-white' : 'text-[#527b70]'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="max-w-full truncate px-1">{label.replace('Dashboard', 'Home').replace('AI Chat', 'Chat')}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
