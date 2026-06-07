import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Bot, CalendarCheck, CheckCircle2, FileHeart, HeartPulse, ShieldCheck, Sparkles, Stethoscope, Syringe, Tags, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const guideSlides = useMemo(() => [
    {
      icon: HeartPulse,
      title: 'Create a pet profile',
      badge: 'Step 1',
      copy: 'Add name, species, weight, allergies, medication, clinic, vaccines, and notes so every feature knows which pet it is helping.',
      metric: 'Profile',
      tone: 'accent-green',
      actions: ['Basic info', 'Medical risk', 'Care contacts'],
    },
    {
      icon: UploadCloud,
      title: 'Upload medical records',
      badge: 'Step 2',
      copy: 'Upload vaccine cards, prescriptions, lab results, visit PDFs, and photos. Each file is attached to the selected pet.',
      metric: 'Files',
      tone: 'accent-blue',
      actions: ['PDF', 'Image', 'Prescription'],
    },
    {
      icon: Tags,
      title: 'Label the record',
      badge: 'Step 3',
      copy: 'Set document date, type, and labels like rabies, xét nghiệm, đơn thuốc. Labels help search, timeline, and AI retrieval stay focused.',
      metric: 'Metadata',
      tone: 'accent-amber',
      actions: ['Date', 'Type', 'Labels'],
    },
    {
      icon: CalendarCheck,
      title: 'Track care timeline',
      badge: 'Step 4',
      copy: 'Schedule vaccinations, rechecks, and follow-ups. Link multiple files to one visit and mark planned care as done.',
      metric: 'Timeline',
      tone: 'accent-coral',
      actions: ['Reminder', 'Overdue', 'Linked files'],
    },
    {
      icon: Bot,
      title: 'Ask pet-aware AI',
      badge: 'Step 5',
      copy: 'Choose a pet, then ask Gemini. The assistant uses that pet profile, timeline, summary, and relevant uploaded documents.',
      metric: 'AI chat',
      tone: 'accent-green',
      actions: ['Summary', 'Citations', 'Safety note'],
    },
  ], [])
  const [activeSlide, setActiveSlide] = useState(0)
  const slide = guideSlides[activeSlide]
  const nextSlide = () => setActiveSlide((current) => (current + 1) % guideSlides.length)
  const previousSlide = () => setActiveSlide((current) => (current - 1 + guideSlides.length) % guideSlides.length)
  const SlideIcon = slide.icon

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
                <p className="text-sm font-black uppercase text-[#17785d]">Quick start guide</p>
                <h2 className="mt-1 text-2xl font-black">How to use GPet Vet AI</h2>
              </div>
              <div className={`grid h-14 w-14 place-items-center rounded-2xl ${slide.tone}`}><SlideIcon className="h-7 w-7" /></div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-[#d8ede5] bg-[#f8fcfa]">
              <motion.div
                key={activeSlide}
                className="p-5"
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className={`pill ${slide.tone}`}>{slide.badge}</span>
                    <h3 className="mt-4 text-3xl font-black leading-tight text-ink">{slide.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#527b70]">{slide.copy}</p>
                  </div>
                  <div className="rounded-[20px] bg-white p-4 text-center shadow-sm">
                    <p className="text-xs font-black uppercase text-[#527b70]">Focus</p>
                    <p className="mt-1 text-xl font-black text-ink">{slide.metric}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {slide.actions.map((action) => (
                    <div className="rounded-[18px] border border-[#d8ede5] bg-white p-3" key={action}>
                      <CheckCircle2 className="mb-2 h-5 w-5 text-mint-700" />
                      <p className="text-sm font-black text-ink">{action}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {guideSlides.map((item, index) => (
                  <button
                    className={`h-2.5 rounded-full transition ${index === activeSlide ? 'w-8 bg-mint-500' : 'w-2.5 bg-[#bddfd3]'}`}
                    type="button"
                    aria-label={`Show ${item.title}`}
                    onClick={() => setActiveSlide(index)}
                    key={item.title}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary h-11 min-h-11 w-11 rounded-2xl p-0" type="button" onClick={previousSlide} aria-label="Previous guide slide">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button className="btn-primary h-11 min-h-11 rounded-2xl px-4" type="button" onClick={nextSlide}>
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-[#d8ede5] bg-[#f8fcfa] p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#17312b] text-white"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <p className="font-black">Simple care workflow</p>
                  <p className="mt-1 text-sm leading-6 text-[#527b70]">Create a pet, upload records, label them, track reminders, then ask AI with citations from that pet's own data.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              [FileHeart, 'Records', 'Attached to pets'],
              [Syringe, 'Timeline', 'Reminders & visits'],
              [Bot, 'AI', 'Pet-aware answers'],
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
