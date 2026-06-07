import { FileText, X } from 'lucide-react'
import apiClient from '../../api/client.js'

function assetUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = apiClient.defaults.baseURL || ''
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function ContentDetailPanel({ item, loading, onClose }) {
  if (!item && !loading) return null
  const metadata = item?.metadata || {}
  const chunks = item?.chunks || []

  return (
    <aside className="surface-card rounded-[26px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#effbf6] text-mint-700"><FileText className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-black uppercase text-[#527b70]">Content detail</p>
            <h2 className="mt-1 text-xl font-black text-ink">{loading ? 'Loading...' : item.title}</h2>
          </div>
        </div>
        <button className="btn-secondary h-10 w-10 rounded-2xl p-0" type="button" onClick={onClose} aria-label="Close content detail">
          <X className="h-5 w-5" />
        </button>
      </div>

      {!loading && item && (
        <div className="mt-5 space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Status', item.status],
              ['Type', metadata.document_type || item.type],
              ['Date', metadata.document_date || 'Not set'],
              ['Chunks', metadata.chunk_count ?? chunks.length],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-[#d8ede5] bg-[#f8fcfa] p-3" key={label}>
                <p className="text-xs font-black uppercase text-[#527b70]">{label}</p>
                <p className="mt-1 font-black text-ink">{value}</p>
              </div>
            ))}
          </div>

          {!!metadata.labels?.length && (
            <div>
              <p className="text-sm font-black text-ink">Labels</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {metadata.labels.map((label) => <span className="chip" key={label}>{label}</span>)}
              </div>
            </div>
          )}

          {metadata.notes && (
            <div className="rounded-2xl bg-[#fff7e8] p-4 text-sm leading-6 text-[#7c4b0b]">
              <span className="font-black">Notes: </span>{metadata.notes}
            </div>
          )}

          {item.file_url && (
            <div>
              <p className="text-sm font-black text-ink">Original file preview</p>
              <div className="mt-2 overflow-hidden rounded-2xl border border-[#d8ede5] bg-white">
                {item.type === 'image' ? (
                  <img className="max-h-[420px] w-full object-contain" src={assetUrl(item.file_url)} alt={item.title} />
                ) : item.type === 'pdf' ? (
                  <iframe className="h-[420px] w-full" src={assetUrl(item.file_url)} title={item.title} />
                ) : (
                  <a className="block p-4 font-black text-mint-700" href={assetUrl(item.file_url)} target="_blank" rel="noreferrer">Open original file</a>
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-black text-ink">Extracted text preview</p>
            <div className="mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-[#d8ede5] bg-white p-4 text-sm leading-6 text-[#315e52]">
              {item.text_preview || 'No extracted text available yet.'}
            </div>
          </div>

          {!!chunks.length && (
            <div>
              <p className="text-sm font-black text-ink">Chunks</p>
              <div className="mt-2 max-h-[360px] space-y-3 overflow-y-auto">
                {chunks.map((chunk) => (
                  <div className="rounded-2xl border border-[#d8ede5] bg-white p-3 text-sm leading-6 text-[#315e52]" key={chunk._id}>
                    <p className="mb-2 text-xs font-black uppercase text-mint-700">Chunk {chunk.chunk_index + 1}</p>
                    {chunk.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export default ContentDetailPanel
