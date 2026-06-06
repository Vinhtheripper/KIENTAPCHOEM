import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbf8ec,transparent_34%),linear-gradient(135deg,#f7fbf8,#edf8f3)]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <div className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell
