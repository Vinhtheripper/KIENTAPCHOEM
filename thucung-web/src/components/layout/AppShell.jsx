import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import MobileNav from './MobileNav.jsx'
import CurrentPetBar from './CurrentPetBar.jsx'

function AppShell() {
  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <CurrentPetBar />
          <div className="px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default AppShell
