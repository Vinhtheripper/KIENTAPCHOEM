import { X } from 'lucide-react'

function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#17312b]/35 p-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-md rounded-[26px] p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-black text-ink">{title}</h2>
          <button className="btn-secondary h-10 w-10 shrink-0 rounded-2xl p-0" type="button" onClick={onCancel} aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#527b70]">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-red-600 px-5 font-bold text-white transition hover:bg-red-700" type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
