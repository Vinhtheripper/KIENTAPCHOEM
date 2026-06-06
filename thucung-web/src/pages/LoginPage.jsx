import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

function LoginPage() {
  const navigate = useNavigate()
  const { login, error, loading } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })

  const submit = async (event) => {
    event.preventDefault()
    try {
      await login(form)
      navigate('/app')
    } catch {
      // Store handles the user-facing error message.
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f6fbf8,#dff7ed)] px-4">
      <form className="glass-panel w-full max-w-md rounded-[28px] p-6" onSubmit={submit}>
        <h1 className="page-title">Sign in</h1>
        <p className="mt-2 text-[#527b70]">Continue to your pet medical memory workspace.</p>
        <div className="mt-6 space-y-3">
          <input className="field" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="field" type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="mt-3 text-sm font-bold text-red-600">{error}</p>}
        <button className="btn-primary mt-5 w-full" disabled={loading} type="submit">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p className="mt-4 text-center text-sm text-[#527b70]">New here? <Link className="font-black text-mint-700" to="/register">Create an account</Link></p>
      </form>
    </main>
  )
}

export default LoginPage
