import { Clock, HardDrive, Trash2, Play, Loader2 } from 'lucide-react'
import type { VideoSegment } from '../types'

interface Props {
  segment: VideoSegment
  index: number
  selected: boolean
  deleting?: boolean
  onToggle: () => void
  onRemove: () => void
  onPreview: () => void
}

export default function SegmentCard({ segment, index, selected, deleting, onToggle, onRemove, onPreview }: Props) {
  return (
    <div
      className={`
        group relative rounded-xl border-2 transition-all overflow-hidden
        ${deleting ? 'opacity-40 pointer-events-none border-red-500/60' : ''}
        ${!deleting && selected ? 'border-violet-400/70 bg-violet-950/20 shadow-[0_0_16px_rgba(139,92,246,0.12)] ring-1 ring-violet-400/20' : ''}
        ${!deleting && !selected ? 'border-white/[0.08] bg-white/[0.02] opacity-55 hover:opacity-75 hover:border-white/[0.14]' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2.5">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="w-3.5 h-3.5 accent-violet-500 cursor-pointer"
          />
          <span className={`font-bold text-sm ${selected ? 'text-violet-400' : 'text-gray-600'}`}>
            #{index + 1}
          </span>
        </div>
        <button
          onClick={onRemove}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 disabled:cursor-not-allowed transition-all p-1 rounded-lg hover:bg-red-400/10"
          title="Delete segment from server"
        >
          {deleting
            ? <Loader2 size={13} className="animate-spin text-red-400" />
            : <Trash2 size={13} />
          }
        </button>
      </div>

      {/* Divider */}
      <div className={`mx-3 h-px ${selected ? 'bg-violet-400/20' : 'bg-white/[0.05]'}`} />

      {/* Meta */}
      <div className="p-3 space-y-2">
        <p className="text-gray-600 text-[11px] font-mono truncate">{segment.filename}</p>
        <div className="flex gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Clock size={10} className="text-violet-500/70" />
            {segment.duration.toFixed(1)}s
          </span>
          <span className="flex items-center gap-1">
            <HardDrive size={10} className="text-blue-400/70" />
            {segment.size_mb.toFixed(1)} MB
          </span>
        </div>
      </div>

      {/* Preview button — full-width at bottom */}
      <button
        onClick={onPreview}
        className={`w-full flex items-center justify-center gap-1.5 text-xs py-2 border-t transition-all ${
          selected
            ? 'border-violet-400/20 text-violet-400/80 hover:text-violet-300 hover:bg-violet-400/5'
            : 'border-white/[0.05] text-gray-700 hover:text-gray-400 hover:bg-white/[0.04]'
        }`}
      >
        <Play size={10} /> Preview
      </button>
    </div>
  )
}
