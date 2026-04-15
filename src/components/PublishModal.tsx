import { useEffect, useRef, useState } from 'react'
import { X, Send, RefreshCw, ChevronDown, Youtube, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { api } from '../api/client'
import { browserApi, type BrowserProfile } from '../api/browserApi'

interface Props {
  sessionId: string
  filename: string
  onClose: () => void
}

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', desc: 'Anyone can search and view' },
  { value: 'unlisted', label: 'Unlisted', desc: 'Only people with the link' },
  { value: 'private', label: 'Private', desc: 'Only you can view' },
]

export default function PublishModal({ sessionId, filename, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null)

  const [profiles, setProfiles] = useState<BrowserProfile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [profileId, setProfileId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [visibility, setVisibility] = useState('public')

  const [publishing, setPublishing] = useState(false)
  const [result, setResult] = useState<{ video_url: string; title: string; status: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    browserApi.getProfiles()
      .then(arr => {
        setProfiles(arr)
        if (arr.length > 0) setProfileId(arr[0].id)
      })
      .catch(() => setProfileError('Cannot connect to local browser API (port 19995)'))
      .finally(() => setLoadingProfiles(false))
  }, [])

  const handlePublish = async () => {
    if (!profileId) return
    setError(null)
    setPublishing(true)
    try {
      const data = await api.publishVideo({
        session_id: sessionId,
        filename,
        profile_id: profileId,
        platform: 'youtube',
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        tags: tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        visibility,
      })
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg bg-[#110e1c] border border-white/[0.10] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
              <Youtube size={14} className="text-white" />
            </div>
            <div>
              <p className="text-gray-100 font-semibold text-sm">Publish to YouTube</p>
              <p className="text-gray-600 text-[11px] font-mono truncate max-w-[260px]">{filename}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-200 bg-white/[0.06] p-1.5 rounded-lg transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {result ? (
            /* Success state */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-950/60 border border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <div>
                <p className="text-gray-100 font-bold text-lg">Published!</p>
                <p className="text-gray-400 text-sm mt-1">{result.title}</p>
              </div>
              <a
                href={result.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
              >
                <ExternalLink size={14} /> View on YouTube
              </a>
              <p className="text-gray-600 text-xs font-mono">{result.video_url}</p>
            </div>
          ) : (
            <>
              {/* Profile selector */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Browser Profile
                </label>
                {loadingProfiles ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                    <RefreshCw size={13} className="animate-spin" /> Loading profiles…
                  </div>
                ) : profileError ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-amber-400 text-xs bg-amber-950/40 border border-amber-500/30 rounded-xl px-3 py-2.5">
                      <AlertCircle size={13} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Browser API not available (port 19995)</p>
                        <p className="text-amber-500/80 mt-0.5">Please open your anti-detect browser tool (e.g. TaoThaoAI Claw) first, then retry.</p>
                      </div>
                    </div>
                    <input
                      value={profileId}
                      onChange={e => setProfileId(e.target.value)}
                      placeholder="Or enter profile ID manually…"
                      className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-700"
                    />
                  </div>
                ) : profiles.length === 0 ? (
                  <input
                    value={profileId}
                    onChange={e => setProfileId(e.target.value)}
                    placeholder="Enter profile ID manually…"
                    className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-700"
                  />
                ) : (
                  <div className="relative">
                    <select
                      value={profileId}
                      onChange={e => setProfileId(e.target.value)}
                      className="w-full appearance-none bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 pr-8"
                    >
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.name || p.id} — {p.folder}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Title <span className="text-gray-700 normal-case tracking-normal font-normal">(leave empty to auto-generate)</span>
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Auto-generated by Grok AI…"
                  className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-700"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Description <span className="text-gray-700 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Auto-generated by Grok AI…"
                  rows={3}
                  className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 resize-none placeholder-gray-700"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Tags <span className="text-gray-700 normal-case tracking-normal font-normal">(comma-separated, optional)</span>
                </label>
                <input
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="travel, music, viral…"
                  className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-700"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">Visibility</label>
                <div className="flex gap-2">
                  {VISIBILITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setVisibility(opt.value)}
                      className={`flex-1 py-2 px-2 rounded-xl border text-xs font-semibold transition-all text-center ${
                        visibility === opt.value
                          ? 'bg-violet-500/15 border-violet-500/50 text-violet-300'
                          : 'border-white/[0.08] text-gray-500 hover:border-white/[0.18]'
                      }`}
                    >
                      <p>{opt.label}</p>
                      <p className="text-[10px] font-normal text-gray-600 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-950/50 border border-red-500/30 rounded-xl px-3 py-2.5 text-red-300 text-sm">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {publishing && (
                <div className="flex items-center gap-2 text-violet-400 text-sm bg-violet-950/30 border border-violet-500/20 rounded-xl px-3 py-2.5">
                  <RefreshCw size={13} className="animate-spin shrink-0" />
                  <p>Uploading to YouTube — this may take a few minutes…</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/[0.07]">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-4 py-2 rounded-xl text-sm transition-all">
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || !profileId || loadingProfiles}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm"
            >
              {publishing ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
