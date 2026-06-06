import { motion } from 'framer-motion'
import { ArrowRight, Bot, FileHeart, ShieldCheck, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f6fbf8,#dff7ed)] text-ink">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-mint-500 bg-white text-mint-700">
            <Stethoscope className="h-6 w-6" />
          </div>
          <span className="text-lg font-black">GPet Vet AI</span>
        </div>
        <Link className="btn-primary" to="/login">Open app <ArrowRight className="h-4 w-4" /></Link>
      </nav>
      <section className="mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-5 pb-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title max-w-3xl">GPet Vet AI</h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-[#456f63]">
            A local AI pet healthcare assistant that turns medical records, vaccines, images, videos, and daily notes into searchable pet memory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/register">Create account</Link>
            <Link className="btn-secondary" to="/login">Sign in</Link>
          </div>
        </motion.div>
        <div className="glass-panel rounded-[30px] p-5">
          <div className="grid gap-4">
            {[
              [Bot, 'Gemini chatbot', 'Answers with memory, RAG context, and Vietnamese support.'],
              [FileHeart, 'Unified content', 'PDF, DOCX, TXT, media, YouTube, and URLs share one ingestion model.'],
              [ShieldCheck, 'Health guidance', 'Symptom triage with clear veterinary disclaimer and urgency cues.'],
            ].map(([Icon, title, copy]) => (
              <div className="rounded-[22px] bg-white p-5 shadow-sm" key={title}>
                <Icon className="mb-4 h-8 w-8 text-mint-700" />
                <h2 className="text-xl font-black">{title}</h2>
                <p className="mt-2 text-[#527b70]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingPage
