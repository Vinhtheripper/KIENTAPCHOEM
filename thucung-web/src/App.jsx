import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import useAuthStore from './store/authStore.js'

const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage.jsx'))
const ChatPage = lazy(() => import('./pages/ChatPage.jsx'))
const ContentPage = lazy(() => import('./pages/ContentPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage.jsx'))
const PetProfilePage = lazy(() => import('./pages/PetProfilePage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'))
const SummaryPage = lazy(() => import('./pages/SummaryPage.jsx'))
const TimelinePage = lazy(() => import('./pages/TimelinePage.jsx'))
const UploadPage = lazy(() => import('./pages/UploadPage.jsx'))

function PageLoader() {
  return <div className="p-8"><div className="skeleton h-40 rounded-[26px]" /></div>
}

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token)
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  return user?.role === 'admin' ? children : <Navigate to="/app" replace />
}

function OwnerRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  return user?.role !== 'admin' ? children : <Navigate to="/app" replace />
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path="onboarding" element={<OwnerRoute><OnboardingPage /></OwnerRoute>} />
          <Route path="summary" element={<OwnerRoute><SummaryPage /></OwnerRoute>} />
          <Route path="users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="pets" element={<PetProfilePage />} />
          <Route path="upload" element={<OwnerRoute><UploadPage /></OwnerRoute>} />
          <Route path="content" element={<ContentPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="chat" element={<OwnerRoute><ChatPage /></OwnerRoute>} />
          <Route path="settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
