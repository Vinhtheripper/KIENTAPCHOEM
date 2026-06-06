import { Bot, FileText, HeartPulse, Home, Settings, UploadCloud } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/app', label: 'Dashboard', icon: Home, end: true },
  { to: '/app/pets', label: 'Pets', icon: HeartPulse },
  { to: '/app/upload', label: 'Upload', icon: UploadCloud },
  { to: '/app/content', label: 'Content', icon: FileText },
  { to: '/app/chat', label: 'AI Chat', icon: Bot },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/70 bg-white/64 p-5 backdrop-blur-xl lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-500 text-xl font-black text-white">G</div>
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
              `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                isActive ? 'bg-mint-500 text-white shadow-lg shadow-mint-500/20' : 'text-[#315e52] hover:bg-white'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
