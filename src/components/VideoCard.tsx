import { Heart, MessageCircle, Share2, Bookmark, Star, Check } from 'lucide-react'
import type { DouyinVideo } from '../types'

interface Props {
  video: DouyinVideo
  selected?: boolean
  onSelect?: () => void
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)

export default function VideoCard({ video, selected, onSelect }: Props) {
  return (
    <div
      onClick={onSelect}
      className={`
        relative rounded-2xl overflow-hidden border transition-all cursor-pointer group
        ${selected
          ? 'border-violet-500/60 shadow-[0_0_24px_rgba(139,92,246,0.3)]'
          : 'border-white/[0.08] hover:border-white/[0.16] hover:shadow-lg hover:shadow-black/30'
        }
      `}
    >
      {/* Cover */}
      <div className="relative aspect-[9/16] overflow-hidden bg-[#1a1625]">
        <img
          src={video.cover}
          alt={video.desc}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Score badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/10">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-white font-semibold">{video.score}</span>
        </div>

        {/* Stats overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-white text-[11px] font-medium line-clamp-2 leading-tight mb-1.5">{video.desc || '(no caption)'}</p>
          <div className="flex gap-2.5 text-white/60 text-[10px]">
            <span className="flex items-center gap-0.5"><Heart size={9} className="text-red-400" />{fmt(video.digg_count)}</span>
            <span className="flex items-center gap-0.5"><MessageCircle size={9} />{fmt(video.comment_count)}</span>
            <span className="flex items-center gap-0.5"><Share2 size={9} />{fmt(video.share_count)}</span>
          </div>
        </div>

        {/* Selected overlay */}
        {selected && (
          <div className="absolute inset-0 bg-violet-500/15 flex items-start justify-start p-2">
            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
              <Check size={13} className="text-white" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Author footer */}
      <div className="px-3 py-2 bg-[#16121f] flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-violet-900/60 flex items-center justify-center shrink-0">
          <span className="text-[9px] text-violet-400 font-bold">{(video.nickname?.[0] ?? '?').toUpperCase()}</span>
        </div>
        <p className="text-gray-500 text-[11px] truncate">@{video.nickname}</p>
        <span className="ml-auto flex items-center gap-0.5 text-[10px] text-gray-600">
          <Bookmark size={9} />{fmt(video.collect_count)}
        </span>
      </div>
    </div>
  )
}
