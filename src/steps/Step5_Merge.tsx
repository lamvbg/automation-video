import { useState, useEffect } from 'react'
import { Layers, ArrowLeft, ChevronRight, RefreshCw, Clock, HardDrive, ExternalLink, FilmIcon, Send } from 'lucide-react'
import { api, toMediaUrl } from '../api/client'
import { useWorkflow } from '../context/WorkflowContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import PublishModal from '../components/PublishModal'
import type { VideoFileInfo } from '../types'

export default function Step5_Merge() {
  const { state, back, next, setSessionVideos, setMergeSelection, setMergedVideo } = useWorkflow()

  const [loading, setLoading] = useState(false)
  const [merging, setMerging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionId = state.sessionId
  const result = state.mergedVideo

  useEffect(() => {
    if (sessionId && !state.sessionVideos) {
      loadSession()
    }
  }, [sessionId])

  const loadSession = async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      const data = await api.listSessionVideos(sessionId)
      setSessionVideos(data)
      const douyinFiles = data.douyin
        .filter(f => state.selectedSegments.has(f.filename))
        .map(f => `douyin/${f.filename}`)
      const grokFiles = data.grok.map(f => `grok/${f.filename}`)
      setMergeSelection([...douyinFiles, ...grokFiles])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const toggleFile = (prefixed: string) => {
    setMergeSelection(
      state.mergeSelection.includes(prefixed)
        ? state.mergeSelection.filter(f => f !== prefixed)
        : [...state.mergeSelection, prefixed]
    )
  }

  const moveUp = (i: number) => {
    if (i === 0) return
    const next = [...state.mergeSelection]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    setMergeSelection(next)
  }

  const moveDown = (i: number) => {
    if (i === state.mergeSelection.length - 1) return
    const next = [...state.mergeSelection]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    setMergeSelection(next)
  }

  const handleMerge = async () => {
    if (!sessionId || state.mergeSelection.length < 2) return
    setError(null)
    setMerging(true)
    try {
      const data = await api.mergeVideos(sessionId, state.mergeSelection)
      setMergedVideo(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setMerging(false)
    }
  }

  const [publishOpen, setPublishOpen] = useState(false)

  const allFiles: { prefixed: string; info: VideoFileInfo }[] = [
    ...(state.sessionVideos?.douyin ?? []).map(f => ({ prefixed: `douyin/${f.filename}`, info: f })),
    ...(state.sessionVideos?.grok ?? []).map(f => ({ prefixed: `grok/${f.filename}`, info: f })),
  ]

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: Available Files ── */}
      <div className="w-80 shrink-0 flex flex-col gap-4 h-full">
        {/* Session info */}
        {sessionId && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Session:</span>
            <code className="text-violet-400 font-mono">{sessionId}</code>
            <button onClick={loadSession} className="text-gray-600 hover:text-gray-300 ml-1">
              <RefreshCw size={11} />
            </button>
          </div>
        )}

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex-1 overflow-y-auto">
          <h3 className="text-gray-200 font-semibold text-sm mb-3">Available Files</h3>

          {loading && <LoadingSpinner text="Loading session files…" />}

          {!loading && allFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FilmIcon size={28} className="text-gray-700 mb-2" />
              <p className="text-gray-600 text-sm">No files in session</p>
            </div>
          )}

          {!loading && allFiles.length > 0 && (
            <div className="space-y-2">
              {allFiles.map(({ prefixed, info }) => {
                const selected = state.mergeSelection.includes(prefixed)
                const isGrok = prefixed.startsWith('grok')
                return (
                  <button
                    key={prefixed}
                    onClick={() => toggleFile(prefixed)}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      selected
                        ? 'border-violet-400/60 bg-violet-950/20 shadow-sm shadow-violet-900/20'
                        : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      selected ? 'border-violet-400 bg-violet-400' : 'border-white/[0.15]'
                    }`}>
                      {selected && <span className="w-2 h-2 bg-[#110e1c] rounded-sm" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isGrok ? 'bg-fuchsia-400' : 'bg-violet-400'}`} />
                        <p className={`text-[11px] font-bold ${isGrok ? 'text-fuchsia-400' : 'text-violet-400'}`}>
                          {isGrok ? 'GROK' : 'DOUYIN'}
                        </p>
                      </div>
                      <p className="text-gray-300 text-xs font-mono truncate">{info.filename}</p>
                      <div className="flex gap-3 mt-1 text-gray-500 text-[11px]">
                        <span className="flex items-center gap-1"><Clock size={9} />{info.duration.toFixed(1)}s</span>
                        <span className="flex items-center gap-1"><HardDrive size={9} />{info.size_mb.toFixed(2)} MB</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={back} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={next}
            disabled={!result}
            className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Right: Merge Order + Result ── */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-4 overflow-y-auto">
        {/* Merge Order */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
          <h3 className="text-gray-200 font-semibold text-sm mb-3">
            Merge Order
            <span className="text-gray-500 font-normal ml-2">({state.mergeSelection.length} selected)</span>
          </h3>

          {state.mergeSelection.length === 0 ? (
            <p className="text-gray-600 text-sm py-4 text-center">Select files on the left to set merge order</p>
          ) : (
            <div className="space-y-2">
              {state.mergeSelection.map((prefixed, i) => {
                const isGrok = prefixed.startsWith('grok')
                return (
                  <div key={prefixed} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl p-2.5 hover:border-white/[0.10] transition-all">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 ${
                      isGrok ? 'border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-950/30' : 'border-violet-500/50 text-violet-400 bg-violet-950/30'
                    }`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isGrok ? 'bg-fuchsia-400' : 'bg-violet-400'}`} />
                        <p className={`text-[11px] font-bold ${isGrok ? 'text-fuchsia-400' : 'text-violet-400'}`}>{isGrok ? 'GROK' : 'DOUYIN'}</p>
                      </div>
                      <p className="text-gray-400 text-xs font-mono truncate">{prefixed.split('/')[1]}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => moveUp(i)} disabled={i === 0} className="text-gray-600 hover:text-gray-300 disabled:opacity-30 px-1.5 py-1 text-xs">↑</button>
                      <button onClick={() => moveDown(i)} disabled={i === state.mergeSelection.length - 1} className="text-gray-600 hover:text-gray-300 disabled:opacity-30 px-1.5 py-1 text-xs">↓</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {error && <div className="mt-3"><ErrorBanner message={error} onClose={() => setError(null)} /></div>}

          <button
            onClick={handleMerge}
            disabled={merging || state.mergeSelection.length < 2}
            className="mt-4 flex items-center gap-2 w-full justify-center bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 text-sm"
          >
            {merging ? <RefreshCw size={15} className="animate-spin" /> : <Layers size={15} />}
            {merging ? 'Merging…' : `Merge ${state.mergeSelection.length} Videos`}
          </button>
        </div>

        {merging && <LoadingSpinner text="Merging videos…" size="lg" />}

        {/* Merge result */}
        {result && !merging && (
          <div className="bg-white/[0.04] border border-violet-500/30 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-violet-950/60 to-transparent border-b border-violet-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                <h3 className="text-violet-400 font-semibold text-sm">Merged Video Ready</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock size={12} />{result.duration.toFixed(1)}s</span>
                <span className="flex items-center gap-1"><HardDrive size={12} />{result.size_mb.toFixed(2)} MB</span>
                <button
                  onClick={() => setPublishOpen(true)}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-all text-xs"
                >
                  <Send size={11} /> Publish
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-black rounded-xl overflow-hidden flex justify-center">
                <video
                  key={result.filename}
                  src={toMediaUrl(result.download_url)}
                  controls
                  className="max-h-[60vh] max-w-full w-auto"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gray-500 truncate">{result.filename}</span>
                <a
                  href={toMediaUrl(result.download_url)}
                  download={result.filename}
                  className="shrink-0 ml-3 inline-flex items-center gap-2 bg-white/[0.07] hover:bg-white/[0.10] text-gray-200 px-4 py-2 rounded-xl text-xs transition-all"
                >
                  <ExternalLink size={13} /> Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {publishOpen && result && sessionId && (
        <PublishModal
          sessionId={sessionId}
          filename={result.filename}
          onClose={() => setPublishOpen(false)}
        />
      )}
    </div>
  )
}
