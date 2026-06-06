function TranscriptViewer({ text }) {
  return (
    <div className="rounded-[22px] border border-[#d8ede5] bg-white p-4">
      <h3 className="mb-2 font-black text-ink">Extracted transcript</h3>
      <p className="whitespace-pre-wrap text-sm leading-6 text-[#527b70]">{text || 'Transcript will appear after ingestion is ready.'}</p>
    </div>
  )
}

export default TranscriptViewer
