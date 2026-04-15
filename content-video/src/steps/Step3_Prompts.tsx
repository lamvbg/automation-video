import { useState } from 'react'
import { Sparkles, ArrowLeft, ChevronRight, Check, RefreshCw, FileText } from 'lucide-react'
import { api } from '../api/client'
import { useWorkflow } from '../context/WorkflowContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

const STYLES = ['', 'cinematic', 'funny', 'dramatic', 'documentary', 'anime', 'minimalist', 'action']

export default function Step3_Prompts() {
  const { state, back, next, setGeneratedPrompts, setSelectedPrompt } = useWorkflow()

  const [content, setContent] = useState(state.selectedVideo?.desc ?? '')
  const [count, setCount] = useState(5)
  const [style, setStyle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!content.trim()) return setError('Please enter some content to generate prompts from')
    setError(null)
    setLoading(true)
    try {
      const { prompts } = await api.generatePrompts(content.trim(), count, style || undefined)
      setGeneratedPrompts(prompts)
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
        <div className="flex-1 overflow-y-auto min-h-0 pb-2">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <h3 className="text-gray-200 font-semibold text-sm flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            Generate Prompts
          </h3>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">Source content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={5}
              placeholder="Paste tweet text, video description, or any content…"
              className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-gray-700"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Number of prompts</label>
              <span className="text-xs text-violet-400 font-bold">{count}</span>
            </div>
            <input type="range" min={1} max={20} value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-[10px] text-gray-700 mt-1">
              <span>1</span><span>20</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2 block">Style</label>
            <div className="flex flex-wrap gap-1.5">
              {STYLES.map(s => (
                <button
                  key={s || 'auto'}
                  onClick={() => setStyle(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    style === s
                      ? 'bg-violet-500 border-violet-500 text-white'
                      : 'border-white/[0.10] text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {s || 'auto'}
                </button>
              ))}
            </div>
          </div>

          {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 text-sm"
          >
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {loading ? 'Generating…' : state.generatedPrompts.length ? 'Regenerate' : 'Generate Prompts'}
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
            disabled={!state.selectedPrompt}
            className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Right: Prompts panel ── */}
      <div className="flex-1 min-w-0">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner text="Grok is crafting video prompts…" size="lg" />
          </div>
        )}

        {!loading && state.generatedPrompts.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <FileText size={36} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">No prompts yet</p>
            <p className="text-gray-700 text-sm mt-1">Enter source content and click Generate Prompts</p>
          </div>
        )}

        {!loading && state.generatedPrompts.length > 0 && (
          <div className="space-y-3 overflow-y-auto h-full pr-1">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{state.generatedPrompts.length}</span> prompts generated
              <span className="text-gray-600 ml-2">· click to select</span>
            </p>
            {state.generatedPrompts.map((prompt, i) => {
              const selected = state.selectedPrompt === prompt
              return (
                <button
                  key={i}
                  onClick={() => setSelectedPrompt(prompt)}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all relative
                    ${selected
                      ? 'border-violet-400 bg-violet-950/40 shadow-[0_0_16px_rgba(139,92,246,0.15)]'
                      : 'border-white/[0.08] bg-white/[0.04] hover:border-white/[0.18]'
                    }
                  `}
                >
                  <div className="flex gap-3">
                    <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${
                      selected ? 'border-violet-400 bg-violet-400' : 'border-white/[0.10]'
                    }`}>
                      {selected && <Check size={12} className="text-gray-900" strokeWidth={3} />}
                    </span>
                    <div>
                      <span className="text-xs text-violet-400 font-semibold mb-1 block">Prompt {i + 1}</span>
                      <p className="text-gray-200 text-sm leading-relaxed">{prompt}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
