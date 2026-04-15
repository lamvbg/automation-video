import { useState } from 'react'
import { ShieldCheck, ArrowLeft, RefreshCw, CheckCircle, XCircle, Star, ScanEye, Send } from 'lucide-react'
import { api } from '../api/client'
import { useWorkflow } from '../context/WorkflowContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import PublishModal from '../components/PublishModal'

const DEFAULT_CRITERIA = 'Check for inappropriate content, copyright violations, and ensure the video is suitable for social media publishing.'

export default function Step6_Review() {
  const { state, back, setReviewResult, reset } = useWorkflow()

  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [filename, setFilename] = useState(state.mergedVideo?.filename ?? '')
  const [fps, setFps] = useState(1.0)
  const [maxFrames, setMaxFrames] = useState(15)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [publishOpen, setPublishOpen] = useState(false)

  const result = state.reviewResult
  const sessionId = state.sessionId

  const availableFiles: string[] = [
    ...(state.mergedVideo ? [state.mergedVideo.filename] : []),
    ...(state.sessionVideos?.douyin ?? []).map(f => `douyin/${f.filename}`),
    ...(state.sessionVideos?.grok ?? []).map(f => `grok/${f.filename}`),
  ]

  const handleReview = async () => {
    if (!sessionId || !filename) return
    setError(null)
    setLoading(true)
    try {
      const data = await api.reviewVideo(sessionId, filename, criteria, fps, maxFrames)
      setReviewResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (score: number) => {
    if (score >= 8) return 'text-violet-400'
    if (score >= 5) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: Config ── */}
      <div className="w-80 shrink-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto min-h-0 pb-2">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-gray-200 font-semibold text-sm flex items-center gap-2">
            <ShieldCheck size={16} className="text-violet-400" />
            AI Content Review
          </h3>

          {/* File selector */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">Video to review</label>
            <select
              value={filename}
              onChange={e => setFilename(e.target.value)}
              className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="">— select a file —</option>
              {availableFiles.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Criteria */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">Review criteria</label>
            <textarea
              value={criteria}
              onChange={e => setCriteria(e.target.value)}
              rows={4}
              className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">FPS</label>
                <span className="text-xs text-violet-400 font-bold">{fps.toFixed(1)}</span>
              </div>
              <input type="range" min={0.1} max={5} step={0.1} value={fps}
                onChange={e => setFps(Number(e.target.value))}
                className="w-full accent-violet-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Max frames</label>
                <span className="text-xs text-violet-400 font-bold">{maxFrames}</span>
              </div>
              <input type="range" min={1} max={30} value={maxFrames}
                onChange={e => setMaxFrames(Number(e.target.value))}
                className="w-full accent-violet-500" />
            </div>
          </div>

          {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

          <button
            onClick={handleReview}
            disabled={loading || !filename || !sessionId}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 text-sm"
          >
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
            {loading ? 'Reviewing…' : result ? 'Re-review' : 'Run AI Review'}
          </button>
        </div>

        </div>{/* end scrollable */}

        {/* Navigation — always visible */}
        <div className="flex justify-between pt-3 pb-6 shrink-0">
          <button onClick={back} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-2">
            {state.mergedVideo && sessionId && (
              <button
                onClick={() => setPublishOpen(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl transition-all text-sm"
              >
                <Send size={13} /> Publish
              </button>
            )}
            <button
              onClick={reset}
              className="flex items-center gap-2 bg-white/[0.07] hover:bg-white/[0.10] text-gray-200 font-semibold px-5 py-2 rounded-xl transition-all text-sm"
            >
              New Session
            </button>
          </div>
        </div>
      </div>

      {/* ── Right: Result panel ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner text="Extracting frames and sending to Grok for review…" size="lg" />
          </div>
        )}

        {!loading && !result && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <ScanEye size={36} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">No review yet</p>
            <p className="text-gray-700 text-sm mt-1">Select a video file and click Run AI Review</p>
          </div>
        )}

        {result && !loading && (
          <div className={`rounded-2xl border overflow-hidden ${result.passed ? 'border-violet-500/30' : 'border-red-500/30'}`}>
            {/* Banner header */}
            <div className={`px-6 py-4 flex items-center justify-between ${
              result.passed
                ? 'bg-gradient-to-r from-violet-950/80 to-violet-900/40 border-b border-violet-500/20'
                : 'bg-gradient-to-r from-red-950/80 to-red-900/40 border-b border-red-500/20'
            }`}>
              <div className="flex items-center gap-3">
                {result.passed
                  ? <CheckCircle size={26} className="text-violet-400" />
                  : <XCircle size={26} className="text-red-400" />
                }
                <div>
                  <p className={`font-bold text-lg tracking-wide ${result.passed ? 'text-violet-300' : 'text-red-300'}`}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </p>
                  <p className="text-gray-500 text-xs">{result.frame_count} frames analyzed</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className={`text-3xl font-bold ${scoreColor(result.score)}`}>{result.score}</span>
                  <span className="text-gray-500 text-sm">/10</span>
                </div>
                <p className="text-gray-500 text-xs">Quality Score</p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-5 space-y-5 bg-white/[0.02]">
              {/* Score bar */}
              <div className="w-full bg-white/[0.05] rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${result.score >= 8 ? 'bg-gradient-to-r from-violet-500 to-violet-400' : result.score >= 5 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                  style={{ width: `${result.score * 10}%` }}
                />
              </div>

              {/* Feedback */}
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">AI Feedback</p>
                <p className="text-gray-300 text-sm leading-relaxed">{result.feedback}</p>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div>
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Issues Found</p>
                  <div className="flex flex-wrap gap-2">
                    {result.issues.map((issue, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-red-950/60 border border-red-500/30 text-red-300 text-xs px-3 py-1.5 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw response */}
              <details className="text-xs">
                <summary className="text-gray-500 cursor-pointer hover:text-gray-400">Raw AI Response</summary>
                <pre className="mt-2 bg-[#110e1c] rounded-xl p-3 text-gray-400 overflow-auto whitespace-pre-wrap">
                  {result.raw_response}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>

      {publishOpen && state.mergedVideo && sessionId && (
        <PublishModal
          sessionId={sessionId}
          filename={state.mergedVideo.filename}
          onClose={() => setPublishOpen(false)}
        />
      )}
    </div>
  )
}
