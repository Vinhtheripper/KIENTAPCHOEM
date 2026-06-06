import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, error, loading } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })

  const submit = async (event) => {
    event.preventDefault()
    await register(form)
    navigate('/app')
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f6fbf8,#dff7ed)] px-4">
      <form className="glass-panel w-full max-w-md rounded-[28px] p-6" onSubmit={submit}>
        <h1 className="page-title">Create account</h1>
        <p className="mt-2 text-[#527b70]">Start managing pets, records, and AI chat memory.</p>
        <div className="mt-6 space-y-3">
          <input className="field" required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <input className="field" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="field" type="password" required minLength={8} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="mt-3 text-sm font-bold text-red-600">{error}</p>}
        <button className="btn-primary mt-5 w-full" disabled={loading} type="submit">Register</button>
        <p className="mt-4 text-center text-sm text-[#527b70]">Already have an account? <Link className="font-black text-mint-700" to="/login">Sign in</Link></p>
      </form>
    </main>
  )
}

export default RegisterPage
