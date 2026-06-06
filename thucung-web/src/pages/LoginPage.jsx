import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Stethoscope } from 'lucide-react'
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
    <main className="auth-shell grid min-h-screen place-items-center px-4 py-8">
      <div className="glass-panel grid w-full max-w-5xl overflow-hidden rounded-[30px] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden border-r border-[#d8ede5] bg-[#17312b] p-8 text-white lg:block">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-mint-400 bg-white text-mint-700">
              <Stethoscope className="h-6 w-6" />
            </div>
            <p className="text-xl font-black">GPet Vet AI</p>
          </div>
          <div className="mt-16">
            <p className="text-sm font-black uppercase text-mint-200">Secure workspace</p>
            <h2 className="mt-3 text-4xl font-black leading-tight">One place for profiles, records, and AI memory.</h2>
            <div className="mt-8 space-y-3 text-sm text-mint-50">
              {['Pet-specific context', 'MongoDB medical history', 'Gemini assistant with safety disclaimer'].map((item) => (
                <div className="flex items-center gap-3" key={item}><span className="h-2 w-2 rounded-full bg-mint-300" />{item}</div>
              ))}
            </div>
          </div>
        </section>
        <form className="p-6 sm:p-9" onSubmit={submit}>
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <div className="logo-mark h-11 w-11 rounded-2xl"><Stethoscope className="h-6 w-6" /></div>
            <p className="font-black">GPet Vet AI</p>
          </div>
          <span className="eyebrow"><LockKeyhole className="h-4 w-4" /> Member access</span>
          <h1 className="page-title mt-4">Sign in</h1>
          <p className="mt-2 text-[#527b70]">Continue to your pet medical memory workspace.</p>
          <div className="mt-7 space-y-3">
            <input className="field" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="field" type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
          <button className="btn-primary mt-5 w-full" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Login'} {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="mt-5 text-center text-sm text-[#527b70]">New here? <Link className="font-black text-mint-700" to="/register">Create an account</Link></p>
        </form>
      </div>
    </main>
  )
}

export default LoginPage
