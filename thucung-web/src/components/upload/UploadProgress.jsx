function UploadProgress({ progress }) {
  if (!progress) return null
  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="mb-2 flex justify-between text-sm font-bold text-[#527b70]">
        <span>Processing upload</span>
        <span>{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#d8f4e8]">
        <div className="h-full rounded-full bg-mint-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default UploadProgress
