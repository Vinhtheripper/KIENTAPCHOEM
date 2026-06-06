import { motion } from 'framer-motion'
import { ArrowRight, Bot, CalendarCheck, FileHeart, HeartPulse, ShieldCheck, Sparkles, Stethoscope, Syringe } from 'lucide-react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="hero-bg min-h-screen overflow-hidden text-ink">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="logo-mark h-11 w-11 rounded-2xl">
            <Stethoscope className="h-6 w-6" />
          </div>
          <span className="text-lg font-black">GPet Vet AI</span>
        </div>
        <Link className="btn-primary" to="/login">Open app <ArrowRight className="h-4 w-4" /></Link>
      </nav>
      <section className="mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-5 pb-12 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow"><Sparkles className="h-4 w-4" /> Pet records, memory, and AI</span>
          <h1 className="page-title mt-4 max-w-3xl">GPet Vet AI</h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-[#456f63]">
            A veterinary workspace for pet profiles, uploaded records, health timelines, and Gemini-powered answers grounded in your pet's own memory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/register">Create account</Link>
            <Link className="btn-secondary" to="/login">Sign in</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Medical records', 'Vaccine notes', 'Gemini chat', 'MongoDB memory'].map((item) => <span className="chip" key={item}>{item}</span>)}
          </div>
        </motion.div>
        <motion.div className="glass-panel rounded-[30px] p-5" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="rounded-[24px] border border-[#d8ede5] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-[#17785d]">Today's care brief</p>
                <h2 className="mt-1 text-2xl font-black">Milo's health memory</h2>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#effbf6] text-mint-700"><HeartPulse className="h-7 w-7" /></div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                [CalendarCheck, '3', 'open notes', 'accent-blue'],
                [Syringe, '12d', 'next vaccine', 'accent-amber'],
                [FileHeart, '18', 'records', 'accent-green'],
              ].map(([Icon, value, label, accent]) => (
                <div className={`rounded-[18px] p-4 ${accent}`} key={label}>
                  <Icon className="mb-3 h-5 w-5" />
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs font-black uppercase">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[22px] border border-[#d8ede5] bg-[#f8fcfa] p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#17312b] text-white"><Bot className="h-5 w-5" /></div>
                <div>
                  <p className="font-black">Gemini assistant</p>
                  <p className="mt-1 text-sm leading-6 text-[#527b70]">Milo's last allergy note and uploaded lab result are ready for grounded Q&A.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              [Bot, 'Chat', 'RAG context'],
              [FileHeart, 'Upload', 'Unified files'],
              [ShieldCheck, 'Safety', 'Vet disclaimer'],
            ].map(([Icon, title, copy]) => (
              <div className="rounded-[20px] border border-[#d8ede5] bg-white p-4" key={title}>
                <Icon className="mb-3 h-6 w-6 text-mint-700" />
                <h3 className="font-black">{title}</h3>
                <p className="text-sm text-[#527b70]">{copy}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default LandingPage
