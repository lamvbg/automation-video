import { useState } from 'react'
import { Download, ArrowLeft, ChevronRight, Clock, HardDrive, Film, CheckSquare, Square, Tv2 } from 'lucide-react'
import { api, toMediaUrl } from '../api/client'
import { useWorkflow } from '../context/WorkflowContext'
import SegmentCard from '../components/SegmentCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import VideoPreviewModal from '../components/VideoPreviewModal'

export default function Step2_Download() {
  const { state, back, next, setDownloadResult, toggleSegment, removeSegment } = useWorkflow()

  const [segDuration, setSegDuration] = useState(5)
  const [maxSegments, setMaxSegments] = useState(5)
  const [loading, setLoading] = useState(false)
  const [deletingSegment, setDeletingSegment] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState<string | undefined>()

  const video = state.selectedVideo
  const result = state.downloadResult

  const handleRemoveSegment = async (filename: string) => {
    if (!state.sessionId) return
    setDeletingSegment(filename)
    try {
      await api.deleteVideos(state.sessionId, [`douyin/${filename}`])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      setDeletingSegment(null)
      return
    }
    removeSegment(filename)
    setDeletingSegment(null)
  }

  const handleDownload = async () => {
    if (!video) return
    setError(null)
    setLoading(true)
    try {
      const data = await api.downloadVideo(video.douyin_url, segDuration, maxSegments)
      setDownloadResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const selectedCount = state.selectedSegments.size
  const totalSegments = result?.segments.length ?? 0

  const toggleAll = () => {
    if (!result) return
    if (selectedCount === totalSegments) {
      result.segments.forEach(s => {
        if (state.selectedSegments.has(s.filename)) toggleSegment(s.filename)
      })
    } else {
      result.segments.forEach(s => {
        if (!state.selectedSegments.has(s.filename)) toggleSegment(s.filename)
      })
    }
  }

  if (!video) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">No video selected. Go back to Step 1.</p>
        <button onClick={back} className="mt-4 text-violet-400 hover:text-violet-300 flex items-center gap-1 mx-auto">
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: Config ── */}
      <div className="w-80 shrink-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pb-2">
        {/* Selected video */}
        <div className="flex gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
          <img src={video.cover} className="w-14 h-20 object-cover rounded-lg shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-gray-200 font-medium text-sm line-clamp-3">{video.desc}</p>
            <p className="text-gray-500 text-xs mt-1.5">@{video.nickname}</p>
          </div>
        </div>

        {/* Download config */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-gray-200 font-semibold text-sm">Download Settings</h3>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Segment duration</label>
              <span className="text-xs text-violet-400 font-bold">{segDuration}s</span>
            </div>
            <input type="range" min={3} max={7} value={segDuration}
              onChange={e => setSegDuration(Number(e.target.value))}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-[10px] text-gray-700 mt-1">
              <span>3s</span><span>7s</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Max segments</label>
              <span className="text-xs text-violet-400 font-bold">{maxSegments}</span>
            </div>
            <input type="range" min={1} max={10} value={maxSegments}
              onChange={e => setMaxSegments(Number(e.target.value))}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-[10px] text-gray-700 mt-1">
              <span>1</span><span>10</span>
            </div>
          </div>

          {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 text-sm"
          >
            <Download size={15} />
            {loading ? 'Downloading…' : result ? 'Re-download' : 'Download & Split'}
          </button>
        </div>

        {/* Stats (shown after download) */}
        {result && !loading && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Film size={14} />, label: 'Segments', value: result.segment_count, color: 'text-violet-400' },
              { icon: <CheckSquare size={14} />, label: 'Selected', value: `${selectedCount}/${totalSegments}`, color: 'text-violet-400' },
              { icon: <Clock size={14} />, label: 'Duration', value: `${result.original_duration.toFixed(1)}s`, color: 'text-blue-400' },
              { icon: <HardDrive size={14} />, label: 'Size', value: `${result.original_size_mb.toFixed(2)} MB`, color: 'text-purple-400' },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5">
                <span className={s.color}>{s.icon}</span>
                <span className="text-gray-200 text-sm font-bold">{s.value}</span>
                <span className="text-gray-500 text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        </div>{/* end scrollable */}

        {/* Navigation — always visible */}
        <div className="flex justify-between pt-3 pb-6 shrink-0">
          <button onClick={back} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          {result && (
            <button
              onClick={next}
              disabled={selectedCount === 0}
              className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm"
            >
              Next <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Right: Segments panel ── */}
      <div className="flex-1 min-w-0">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner text="Downloading video and splitting into segments…" size="lg" />
          </div>
        )}

        {!loading && !result && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <Tv2 size={36} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">No segments yet</p>
            <p className="text-gray-700 text-sm mt-1">Configure settings and click Download &amp; Split</p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-3 h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-gray-300 font-semibold text-sm">Segments</h3>
                <code className="text-violet-400 font-mono text-[11px]">{result.session_id}</code>
              </div>
              <button
                onClick={toggleAll}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                {selectedCount === totalSegments ? <CheckSquare size={13} /> : <Square size={13} />}
                {selectedCount === totalSegments ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-y-auto">
              {result.segments.map((seg, i) => (
                <SegmentCard
                  key={seg.filename}
                  segment={seg}
                  index={i}
                  selected={state.selectedSegments.has(seg.filename)}
                  deleting={deletingSegment === seg.filename}
                  onToggle={() => toggleSegment(seg.filename)}
                  onRemove={() => handleRemoveSegment(seg.filename)}
                  onPreview={() => {
                    setPreviewUrl(toMediaUrl(seg.download_url))
                    setPreviewTitle(seg.filename)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video preview modal */}
      {previewUrl && (
        <VideoPreviewModal
          url={previewUrl}
          title={previewTitle}
          onClose={() => { setPreviewUrl(null); setPreviewTitle(undefined) }}
        />
      )}
    </div>
  )
}
