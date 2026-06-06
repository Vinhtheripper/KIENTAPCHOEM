import { FileText } from 'lucide-react'

function DocumentViewer({ item }) {
  return (
    <article className="rounded-[22px] border border-[#d8ede5] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#effbf6] text-mint-700"><FileText className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-black text-ink">{item.title}</h3>
          <p className="text-sm text-[#527b70]">{item.type} - {item.source}</p>
          <p className="mt-3 inline-flex rounded-full bg-[#effbf6] px-3 py-1 text-xs font-black text-mint-700">{item.status}</p>
        </div>
      </div>
    </article>
  )
}

export default DocumentViewer
