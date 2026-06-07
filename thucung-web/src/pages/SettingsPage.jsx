import { useEffect, useState } from 'react'
import { Bot, Database, Globe, Settings, ShieldCheck } from 'lucide-react'
import { adminApi } from '../api/adminApi.js'

function SettingsPage() {
  const [audit, setAudit] = useState([])
  const configs = [
    [Globe, 'API endpoint', 'https://kientapchoem.onrender.com'],
    [Bot, 'Chat model', 'Gemini API'],
    [Bot, 'Embedding model', 'gemini-embedding-001'],
    [Database, 'Database', 'MongoDB Atlas'],
  ]

  useEffect(() => {
    adminApi.audit().then(setAudit).catch(() => setAudit([]))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow"><Settings className="h-4 w-4" /> Deployment settings</span>
        <h1 className="page-title mt-4">Settings</h1>
        <p className="mt-2 max-w-2xl text-[#527b70]">Current production-facing services used by the frontend and backend.</p>
      </div>
      <section className="surface-card rounded-[26px] p-5">
        <h2 className="text-xl font-black text-ink">Service configuration</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {configs.map(([Icon, label, value]) => (
            <div className="rounded-[22px] border border-[#d8ede5] bg-[#f8fcfa] p-4" key={label}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-mint-700"><Icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase text-[#527b70]">{label}</p>
                  <p className="mt-1 break-words font-black text-ink">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="surface-card rounded-[26px] p-5">
        <h2 className="flex items-center gap-2 text-xl font-black text-ink"><ShieldCheck className="h-5 w-5 text-mint-700" />Audit log</h2>
        <div className="mt-4 max-h-[460px] space-y-3 overflow-y-auto">
          {audit.map((row) => (
            <div className="rounded-2xl border border-[#d8ede5] bg-white p-4" key={row._id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black text-ink">{row.action} {row.entity_type}</p>
                  <p className="text-sm text-[#527b70]">{row.created_at ? String(row.created_at).slice(0, 19).replace('T', ' ') : ''}</p>
                </div>
                <span className="chip">actor: {row.actor_id}</span>
              </div>
              <p className="mt-2 break-all text-xs text-[#527b70]">pet: {row.pet_id || '-'} | entity: {row.entity_id || '-'}</p>
            </div>
          ))}
          {audit.length === 0 && <div className="empty-state rounded-2xl p-6 text-center">No audit logs yet.</div>}
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
