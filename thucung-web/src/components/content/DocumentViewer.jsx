import { CheckCircle2, Clock, FileText } from 'lucide-react'

function statusTone(status) {
  if (status === 'ready') return 'accent-green'
  if (status === 'processing') return 'accent-amber'
  return 'accent-blue'
}

function DocumentViewer({ item }) {
  const StatusIcon = item.status === 'ready' ? CheckCircle2 : Clock

  return (
    <article className="soft-card rounded-[24px] p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#effbf6] text-mint-700"><FileText className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-black text-ink">{item.title}</h3>
          <p className="text-sm capitalize text-[#527b70]">{item.type} - {item.source}</p>
          <p className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${statusTone(item.status)}`}>
            <StatusIcon className="h-3.5 w-3.5" />{item.status}
          </p>
        </div>
      </div>
    </article>
  )
}

export default DocumentViewer
