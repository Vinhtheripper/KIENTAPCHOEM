import { Link } from 'react-router-dom'
import { CalendarDays, HeartPulse, UploadCloud } from 'lucide-react'

function OnboardingPage() {
  const steps = [
    [HeartPulse, 'Create your first pet', 'Add profile, allergies, vaccines, diet, and clinic contact.', '/app/pets', 'Create pet'],
    [UploadCloud, 'Upload the first record', 'Attach vaccine cards, lab results, prescriptions, or visit notes.', '/app/upload', 'Upload record'],
    [CalendarDays, 'Schedule care reminder', 'Create vaccination, recheck, or follow-up events in the medical timeline.', '/app/timeline', 'Open timeline'],
  ]

  return (
    <div className="space-y-6">
      <section className="surface-card rounded-[28px] p-6 lg:p-8">
        <span className="eyebrow">Quick onboarding</span>
        <h1 className="page-title mt-4">Set up your pet care workspace</h1>
        <p className="mt-3 max-w-2xl text-[#527b70]">Complete these three actions so GPet can keep records, reminders, and AI context connected to the right pet.</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {steps.map(([Icon, title, copy, to, action], index) => (
          <div className="surface-card rounded-[26px] p-5" key={title}>
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#effbf6] text-mint-700"><Icon className="h-6 w-6" /></div>
              <span className="chip">Step {index + 1}</span>
            </div>
            <h2 className="mt-5 text-xl font-black text-ink">{title}</h2>
            <p className="mt-2 min-h-16 text-sm leading-6 text-[#527b70]">{copy}</p>
            <Link className="btn-primary mt-5 w-full" to={to}>{action}</Link>
          </div>
        ))}
      </section>
      <div className="empty-state rounded-[24px] p-5 text-center">
        <p className="font-black text-ink">You can return to these steps anytime from the dashboard.</p>
        <Link className="btn-secondary mt-4" to="/app">Skip for now</Link>
      </div>
    </div>
  )
}

export default OnboardingPage
