import { useState } from 'react'
import { Video, ArrowLeft, ChevronRight, ExternalLink, RefreshCw, Clapperboard } from 'lucide-react'
import { api, toMediaUrl } from '../api/client'
import { useWorkflow } from '../context/WorkflowContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

const RATIOS = ['16:9', '9:16', '1:1'] as const
const LENGTHS = [6, 10] as const
const RESOLUTIONS = ['480p', '720p'] as const

export default function Step4_GenerateVideo() {
  const { state, back, next, setGeneratedVideo } = useWorkflow()

  const [ratio, setRatio] = useState<typeof RATIOS[number]>('16:9')
  const [length, setLength] = useState<typeof LENGTHS[number]>(6)
  const [res, setRes] = useState<typeof RESOLUTIONS[number]>('480p')
  const [upscale, setUpscale] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const result = state.generatedVideo

  const generate = async () => {
    if (!state.selectedPrompt) return
    setError(null)
    setLoading(true)
    try {
      const data = await api.generateVideo(state.selectedPrompt, state.sessionId, ratio, length, res, upscale)
      setGeneratedVideo(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: Config ── */}
      <div className="w-80 shrink-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pb-2">
        {/* Selected prompt */}
        {state.selectedPrompt && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-2">Selected Prompt</p>
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">{state.selectedPrompt}</p>
          </div>
        )}

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-gray-200 font-semibold text-sm flex items-center gap-2">
            <Video size={16} className="text-violet-400" />
            Generation Settings
          </h3>

          {/* Aspect Ratio */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block font-semibold">Aspect Ratio</label>
            <div className="flex bg-[#0c0a14] p-1 rounded-xl border border-white/[0.07]">
              {RATIOS.map(r => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    ratio === r
                      ? 'bg-gradient-to-b from-violet-500 to-violet-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block font-semibold">Duration</label>
            <div className="flex bg-[#0c0a14] p-1 rounded-xl border border-white/[0.07]">
              {LENGTHS.map(l => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    length === l
                      ? 'bg-gradient-to-b from-violet-500 to-violet-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {l}s
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block font-semibold">Resolution</label>
            <div className="flex bg-[#0c0a14] p-1 rounded-xl border border-white/[0.07]">
              {RESOLUTIONS.map(r => (
                <button
                  key={r}
                  onClick={() => setRes(r)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    res === r
                      ? 'bg-gradient-to-b from-violet-500 to-violet-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Upscale toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-200 font-medium">HD Upscale</p>
              <p className="text-xs text-gray-500 mt-0.5">Upscale to HD after generation</p>
            </div>
            <button
              onClick={() => setUpscale(v => !v)}
              className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${upscale ? 'bg-violet-500' : 'bg-white/[0.07]'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${upscale ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

          <button
            onClick={generate}
            disabled={loading || !state.selectedPrompt}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 text-sm"
          >
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Video size={15} />}
            {loading ? 'Generating…' : result ? 'Regenerate' : 'Generate Video'}
          </button>
        </div>

        </div>{/* end scrollable */}

        {/* Navigation — always visible */}
        <div className="flex justify-between pt-3 pb-6 shrink-0">
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

      {/* ── Right: Result panel ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner text="Grok is generating your video — this may take a minute…" size="lg" />
          </div>
        )}

        {!loading && !result && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <Clapperboard size={36} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">No video yet</p>
            <p className="text-gray-700 text-sm mt-1">Configure settings and click Generate Video</p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <h3 className="text-violet-400 font-semibold">Video Generated</h3>
            </div>

            {/* Video preview */}
            {(result.hd_video_url || result.video_url || result.download_url) && (() => {
              const src = toMediaUrl(result.download_url || result.hd_video_url || result.video_url)
              return (
                <div className="bg-black rounded-2xl overflow-hidden border border-white/[0.08]">
                  <video key={src} src={src} controls className="w-full" />
                </div>
              )
            })()}

            <div className="grid grid-cols-2 gap-3">
              {result.download_url && (
                <a
                  href={toMediaUrl(result.download_url)}
                  download
                  className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] text-gray-200 px-4 py-2.5 rounded-xl transition-all text-sm"
                >
                  <ExternalLink size={14} /> Download Local
                </a>
              )}
              {result.hd_video_url && (
                <a
                  href={result.hd_video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] text-gray-200 px-4 py-2.5 rounded-xl transition-all text-sm"
                >
                  <ExternalLink size={14} /> HD Version (Grok)
                </a>
              )}
            </div>

            <div className="text-xs text-gray-600 font-mono space-y-1">
              <p>post_id: {result.post_id}</p>
              <p>file: {result.local_filename}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
