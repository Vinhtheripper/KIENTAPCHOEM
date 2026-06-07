import { useState } from 'react'
import { ExternalLink, FileText, Image, Layers3, NotebookText, RefreshCw, Save, Settings2, X } from 'lucide-react'
import apiClient from '../../api/client.js'
import { contentApi } from '../../api/contentApi.js'
import useToastStore from '../../store/toastStore.js'

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'preview', label: 'Preview', icon: Image },
  { id: 'text', label: 'Text', icon: NotebookText },
  { id: 'chunks', label: 'Chunks', icon: Layers3 },
  { id: 'metadata', label: 'Metadata', icon: Settings2 },
]

function assetUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = apiClient.defaults.baseURL || ''
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function makeMetadataForm(item) {
  const metadata = item?.metadata || {}
  return {
    document_date: metadata.document_date || '',
    document_type: metadata.document_type || item?.type || '',
    labels: (metadata.labels || []).join(', '),
    notes: metadata.notes || '',
  }
}

function statusClass(status) {
  if (status === 'ready') return 'accent-green'
  if (status === 'processing') return 'accent-amber'
  return 'accent-coral'
}

function documentTypeClass(type = '') {
  if (type.includes('vaccine') || type.includes('vaccination')) return 'accent-green'
  if (type.includes('lab')) return 'accent-blue'
  if (type.includes('prescription')) return 'accent-amber'
  if (type.includes('symptom')) return 'accent-coral'
  return 'accent-blue'
}

function DetailSkeleton({ onClose }) {
  return (
    <aside className="surface-card rounded-[26px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <div className="skeleton h-4 w-28 rounded-full" />
          <div className="skeleton h-7 w-64 rounded-full" />
        </div>
        <button className="btn-secondary h-10 w-10 rounded-2xl p-0" type="button" onClick={onClose} aria-label="Close content detail">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-5 space-y-3">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </aside>
  )
}

function EmptyBlock({ title, children }) {
  return (
    <div className="empty-state rounded-[22px] p-6 text-center">
      <p className="font-black text-ink">{title}</p>
      {children && <p className="mt-2 text-sm leading-6">{children}</p>}
    </div>
  )
}

function FilePreview({ item }) {
  const url = assetUrl(item.file_url)
  if (!url) {
    return <EmptyBlock title="No original file">This item does not expose a stored file preview.</EmptyBlock>
  }

  if (item.type === 'image') {
    return (
      <div className="overflow-hidden rounded-[22px] border border-[#d8ede5] bg-[#f8fcfa]">
        <img className="max-h-[560px] w-full object-contain" src={url} alt={item.title} />
      </div>
    )
  }

  if (item.type === 'pdf') {
    return (
      <div className="overflow-hidden rounded-[22px] border border-[#d8ede5] bg-white">
        <iframe className="h-[560px] w-full" src={url} title={item.title} />
      </div>
    )
  }

  return (
    <a className="btn-secondary w-full" href={url} target="_blank" rel="noreferrer">
      <ExternalLink className="h-4 w-4" />
      Open original file
    </a>
  )
}

function ContentDetailInner({ item, onClose, onUpdated }) {
  const metadata = item?.metadata || {}
  const chunks = item?.chunks || []
  const pushToast = useToastStore((state) => state.push)
  const [activeTab, setActiveTab] = useState('overview')
  const [form, setForm] = useState(() => makeMetadataForm(item))
  const [saving, setSaving] = useState(false)
  const [retrying, setRetrying] = useState(false)

  const refreshDetail = async (contentId) => {
    const detail = await contentApi.detail(contentId)
    onUpdated?.(detail)
    return detail
  }

  const saveMetadata = async () => {
    setSaving(true)
    try {
      const updated = await contentApi.updateMetadata(item._id, {
        document_date: form.document_date || null,
        document_type: form.document_type || null,
        labels: form.labels.split(',').map((label) => label.trim()).filter(Boolean),
        notes: form.notes || null,
      })
      await refreshDetail(updated._id)
      pushToast('Content metadata updated.')
    } finally {
      setSaving(false)
    }
  }

  const retry = async () => {
    setRetrying(true)
    try {
      const updated = await contentApi.retry(item._id)
      await refreshDetail(updated._id)
      pushToast('Retry started. Content is processing...', 'warning')
    } finally {
      setRetrying(false)
    }
  }

  return (
    <aside className="surface-card overflow-hidden rounded-[26px]">
      <div className="border-b border-[#d8ede5] bg-white/80 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="eyebrow"><FileText className="h-4 w-4" /> Content detail</span>
            <h2 className="mt-3 break-words text-2xl font-black leading-tight text-ink">{item.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`pill ${statusClass(item.status)}`}>{item.status}</span>
              <span className={`pill ${documentTypeClass(metadata.document_type || item.type)}`}>{metadata.document_type || item.type}</span>
              <span className="chip">{metadata.document_date || 'No date'}</span>
            </div>
          </div>
          <button className="btn-secondary h-10 w-10 shrink-0 rounded-2xl p-0" type="button" onClick={onClose} aria-label="Close content detail">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto rounded-2xl bg-[#f6fbf8] p-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              className={`tab-button shrink-0 ${activeTab === id ? 'tab-button-active' : ''}`}
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-5">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Source', item.source || 'file'],
                ['Chunks', metadata.chunk_count ?? chunks.length],
                ['Original type', item.type],
                ['Pet', item.pet_id || 'Unknown'],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-[#d8ede5] bg-[#f8fcfa] p-4" key={label}>
                  <p className="text-xs font-black uppercase text-[#527b70]">{label}</p>
                  <p className="mt-1 break-words font-black text-ink">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2 text-sm font-black text-ink">Labels</p>
              {metadata.labels?.length ? (
                <div className="flex flex-wrap gap-2">
                  {metadata.labels.map((label) => <span className="chip" key={label}>{label}</span>)}
                </div>
              ) : (
                <EmptyBlock title="No labels yet">Add labels in Metadata to improve retrieval and filtering.</EmptyBlock>
              )}
            </div>

            {metadata.notes ? (
              <div className="rounded-[22px] border border-[#f5d9a8] bg-[#fff7e8] p-4 text-sm leading-6 text-[#7c4b0b]">
                <span className="font-black">Notes: </span>{metadata.notes}
              </div>
            ) : (
              <EmptyBlock title="No notes">Use notes for short clinical context, visit summary, or owner observations.</EmptyBlock>
            )}
          </div>
        )}

        {activeTab === 'preview' && <FilePreview item={item} />}

        {activeTab === 'text' && (
          <div className="rounded-[22px] border border-[#d8ede5] bg-white p-4 text-sm leading-7 text-[#315e52]">
            <pre className="whitespace-pre-wrap break-words font-sans">{item.text_preview || 'No extracted text available yet.'}</pre>
          </div>
        )}

        {activeTab === 'chunks' && (
          <div className="space-y-3">
            {chunks.length ? chunks.map((chunk) => (
              <div className="rounded-[22px] border border-[#d8ede5] bg-white p-4 text-sm leading-7 text-[#315e52]" key={chunk._id}>
                <p className="mb-2 text-xs font-black uppercase text-mint-700">Chunk {chunk.chunk_index + 1}</p>
                {chunk.text}
              </div>
            )) : <EmptyBlock title="No chunks yet">The item may still be processing, or ingestion did not extract text.</EmptyBlock>}
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <div className="rounded-[22px] border border-[#d8ede5] bg-[#f8fcfa] p-4">
              <p className="mb-3 text-sm font-black text-ink">Retrieval metadata</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-bold text-[#527b70]">
                  Document date
                  <input className="field" type="date" value={form.document_date} onChange={(e) => setForm({ ...form, document_date: e.target.value })} />
                </label>
                <label className="space-y-1 text-sm font-bold text-[#527b70]">
                  Document type
                  <select className="field" value={form.document_type} onChange={(e) => setForm({ ...form, document_type: e.target.value })}>
                    <option value="">Document type</option>
                    <option value="medical_record">Medical record</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="lab_result">Lab result</option>
                    <option value="prescription">Prescription</option>
                    <option value="symptom_note">Symptom note</option>
                    <option value="diet">Diet</option>
                    <option value="image">Image</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="space-y-1 text-sm font-bold text-[#527b70] sm:col-span-2">
                  Labels
                  <input className="field" placeholder="vaccine, yearly, rabies..." value={form.labels} onChange={(e) => setForm({ ...form, labels: e.target.value })} />
                </label>
                <label className="space-y-1 text-sm font-bold text-[#527b70] sm:col-span-2">
                  Notes
                  <textarea className="field min-h-28 resize-none" placeholder="Short clinical notes for retrieval..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="btn-primary" type="button" onClick={saveMetadata} disabled={saving}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save metadata'}
                </button>
                {item.file_path && (
                  <button className="btn-secondary" type="button" onClick={retry} disabled={retrying}>
                    <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
                    {retrying ? 'Retrying...' : 'Retry ingestion'}
                  </button>
                )}
              </div>
            </div>
            <div className="rounded-[22px] border border-[#d8ede5] bg-white p-4 text-sm leading-6 text-[#527b70]">
              Metadata helps the hybrid retrieval layer route Vietnamese and English questions to the right content without forcing the AI to scan every uploaded file.
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function ContentDetailPanel({ item, loading, onClose, onUpdated }) {
  if (loading) return <DetailSkeleton onClose={onClose} />
  if (!item) return null
  return <ContentDetailInner key={item._id} item={item} onClose={onClose} onUpdated={onUpdated} />
}

export default ContentDetailPanel
