function SettingsPage() {
  return (
    <div className="space-y-5">
      <h1 className="page-title">Settings</h1>
      <section className="glass-panel rounded-[24px] p-5">
        <h2 className="text-xl font-black text-ink">Local AI configuration</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="field" value="https://generativelanguage.googleapis.com/v1beta" readOnly />
          <input className="field" value="gemini-2.5-flash" readOnly />
          <input className="field" value="gemini-embedding-001" readOnly />
          <input className="field" value="mongodb://localhost:27017" readOnly />
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
