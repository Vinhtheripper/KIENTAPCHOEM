import { X } from 'lucide-react'
import useToastStore from '../../store/toastStore.js'

function tone(type) {
  if (type === 'error') return 'border-red-100 bg-red-50 text-red-700'
  if (type === 'warning') return 'border-amber-100 bg-amber-50 text-amber-800'
  return 'border-[#c7e8dc] bg-white text-ink'
}

function ToastHost() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed right-4 top-4 z-[70] w-[min(360px,calc(100vw-32px))] space-y-3">
      {toasts.map((toast) => (
        <div className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-sm font-bold shadow-xl shadow-[#17312b]/10 ${tone(toast.type)}`} key={toast.id}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => remove(toast.id)} aria-label="Dismiss notification">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastHost
