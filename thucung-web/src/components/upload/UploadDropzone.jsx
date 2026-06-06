import { FileAudio, FileText, Image, UploadCloud, Video } from 'lucide-react'

function UploadDropzone({ onFile, disabled }) {
  return (
    <label className={`surface-card flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-dashed p-8 text-center transition ${disabled ? 'opacity-70' : 'hover:border-mint-500 hover:shadow-xl hover:shadow-mint-500/10'}`}>
      <div className="grid h-16 w-16 place-items-center rounded-[22px] bg-[#effbf6] text-mint-700">
        <UploadCloud className="h-8 w-8" />
      </div>
      <span className="mt-5 text-2xl font-black text-ink">Upload medical records, images, audio, or videos</span>
      <span className="mt-2 max-w-xl text-sm leading-6 text-[#527b70]">PDF, DOCX, TXT, MP4, audio, and pet images become unified content items for RAG retrieval.</span>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {[
          [FileText, 'Documents'],
          [Image, 'Images'],
          [FileAudio, 'Audio'],
          [Video, 'Video'],
        ].map(([Icon, label]) => (
          <span className="chip" key={label}><Icon className="h-4 w-4" />{label}</span>
        ))}
      </div>
      <input className="hidden" disabled={disabled} type="file" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      {disabled && <span className="mt-5 text-sm font-black text-[#a76210]">Select a pet before uploading.</span>}
    </label>
  )
}

export default UploadDropzone
