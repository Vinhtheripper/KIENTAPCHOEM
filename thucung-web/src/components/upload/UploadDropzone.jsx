import { UploadCloud } from 'lucide-react'

function UploadDropzone({ onFile }) {
  return (
    <label className="glass-panel flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-[26px] border-dashed p-8 text-center">
      <UploadCloud className="mb-4 h-12 w-12 text-mint-700" />
      <span className="text-xl font-black text-ink">Upload medical records, images, audio, or videos</span>
      <span className="mt-2 max-w-xl text-sm text-[#527b70]">PDF, DOCX, TXT, MP4, audio, and pet images become unified content items for RAG retrieval.</span>
      <input className="hidden" type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </label>
  )
}

export default UploadDropzone
