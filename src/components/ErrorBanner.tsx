import { AlertCircle, X } from 'lucide-react'

interface Props {
  message: string
  onClose?: () => void
}

export default function ErrorBanner({ message, onClose }: Props) {
  return (
    <div className="flex items-start gap-3 bg-red-950/60 border border-red-500/40 rounded-xl p-4 text-red-300">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 hover:text-red-100">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
