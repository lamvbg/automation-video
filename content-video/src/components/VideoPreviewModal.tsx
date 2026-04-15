import { useEffect, useRef } from 'react'
import { X, Download } from 'lucide-react'

interface Props {
  url: string
  title?: string
  onClose: () => void
}

export default function VideoPreviewModal({ url, title, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl bg-[#110e1c] rounded-2xl border border-white/[0.10] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
          <p className="text-sm text-gray-300 font-medium truncate">{title ?? 'Video Preview'}</p>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <a
              href={url}
              download
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 bg-white/[0.07] hover:bg-white/[0.12] px-3 py-1.5 rounded-lg transition-all"
            >
              <Download size={13} /> Download
            </a>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-200 bg-white/[0.07] hover:bg-white/[0.12] p-1.5 rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="bg-black">
          <video
            src={url}
            controls
            autoPlay
            className="w-full max-h-[70vh]"
          />
        </div>
      </div>
    </div>
  )
}
