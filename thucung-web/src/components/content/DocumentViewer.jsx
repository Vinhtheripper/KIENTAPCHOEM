import { CheckCircle2, Clock, FileText } from 'lucide-react'

function statusTone(status) {
  if (status === 'ready') return 'accent-green'
  if (status === 'processing') return 'accent-amber'
  return 'accent-blue'
}

function DocumentViewer({ item, selected, petName, onOpen }) {
  const StatusIcon = item.status === 'ready' ? CheckCircle2 : Clock
  const metadata = item.metadata || {}

  return (
    <button
      type="button"
      className={`soft-card w-full rounded-[24px] p-4 text-left transition hover:border-mint-500 hover:shadow-lg hover:shadow-mint-500/10 ${selected ? 'border-mint-500 ring-4 ring-mint-500/10' : ''}`}
      onClick={() => onOpen?.(item)}
    >
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#effbf6] text-mint-700"><FileText className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-black text-ink">{item.title}</h3>
          <p className="text-sm capitalize text-[#527b70]">{metadata.document_type || item.type} - {metadata.document_date || item.source}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <p className={`pill ${statusTone(item.status)}`}>
              <StatusIcon className="h-3.5 w-3.5" />{item.status}
            </p>
            {item.owner_name && <span className="chip px-2 py-1 text-[10px]">Owner: {item.owner_name}</span>}
            {petName && <span className="chip px-2 py-1 text-[10px]">Pet: {petName}</span>}
          </div>
          {!!metadata.labels?.length && (
            <div className="mt-3 flex flex-wrap gap-1">
              {metadata.labels.slice(0, 3).map((label) => <span className="chip px-2 py-1 text-[10px]" key={label}>{label}</span>)}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

export default DocumentViewer
