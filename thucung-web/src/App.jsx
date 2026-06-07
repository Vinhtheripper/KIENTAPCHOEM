import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import AdminUsersPage from './pages/AdminUsersPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import ContentPage from './pages/ContentPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PetProfilePage from './pages/PetProfilePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import useAuthStore from './store/authStore.js'

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token)
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  return user?.role === 'admin' ? children : <Navigate to="/app" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="pets" element={<PetProfilePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
      </Route>
    </Routes>
  )
}

export default App
