import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Stethoscope } from 'lucide-react'
import useAuthStore from '../store/authStore.js'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, error, loading } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })

  const submit = async (event) => {
    event.preventDefault()
    try {
      await register(form)
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
            <p className="text-sm font-black uppercase text-mint-200">Create your clinic desk</p>
            <h2 className="mt-3 text-4xl font-black leading-tight">Build a searchable health memory for every pet.</h2>
            <div className="mt-8 grid gap-3 text-sm text-mint-50">
              {['Store pet profiles', 'Upload documents and media', 'Ask record-aware questions'].map((item) => (
                <div className="rounded-2xl bg-white/10 px-4 py-3" key={item}>{item}</div>
              ))}
            </div>
          </div>
        </section>
        <form className="p-6 sm:p-9" onSubmit={submit}>
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <div className="logo-mark h-11 w-11 rounded-2xl"><Stethoscope className="h-6 w-6" /></div>
            <p className="font-black">GPet Vet AI</p>
          </div>
          <span className="eyebrow"><Sparkles className="h-4 w-4" /> New workspace</span>
          <h1 className="page-title mt-4">Create account</h1>
          <p className="mt-2 text-[#527b70]">Start managing pets, records, and AI chat memory.</p>
          <div className="mt-7 space-y-3">
            <input className="field" required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <input className="field" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="field" type="password" required minLength={8} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
          <button className="btn-primary mt-5 w-full" disabled={loading} type="submit">
            {loading ? 'Creating account...' : 'Register'} {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="mt-5 text-center text-sm text-[#527b70]">Already have an account? <Link className="font-black text-mint-700" to="/login">Sign in</Link></p>
        </form>
      </div>
    </main>
  )
}

export default RegisterPage
