import { useEffect, useState } from 'react'
import { RefreshCw, Film, Clock, HardDrive, Download, History, ChevronDown, ChevronUp, Trash2, Send } from 'lucide-react'
import { api, toMediaUrl } from '../api/client'
import type { SessionVideos } from '../types'
import PublishModal from '../components/PublishModal'

interface SessionSummary {
  session_id: string
  created_at: string
  douyin_count: number
  grok_count: number
  merged_files: string[]
  merged_urls: string[]
}

type Badge = 'MERGED' | 'DOUYIN' | 'GROK'

interface VideoItem {
  filename: string
  url: string
  badge: Badge
  duration?: number
  size_mb?: number
}

const BADGE_STYLE: Record<Badge, { pill: string; dot: string; border: string }> = {
  MERGED: {
    pill: 'bg-blue-950/80 border-blue-500/50 text-blue-300',
    dot: 'bg-blue-400',
    border: 'border-blue-500/20',
  },
  DOUYIN: {
    pill: 'bg-violet-950/80 border-violet-500/50 text-violet-300',
    dot: 'bg-violet-400',
    border: 'border-violet-500/15',
  },
  GROK: {
    pill: 'bg-fuchsia-950/80 border-fuchsia-500/50 text-fuchsia-300',
    dot: 'bg-fuchsia-400',
    border: 'border-fuchsia-500/15',
  },
}

function VideoCard({ item, sessionId }: { item: VideoItem; sessionId: string }) {
  const [publishOpen, setPublishOpen] = useState(false)
  const s = BADGE_STYLE[item.badge]
  return (
    <>
      <div className={`rounded-xl overflow-hidden border bg-[#0d0b17] flex flex-col ${s.border}`}>
        <div className="relative bg-black">
          <video
            src={item.url}
            controls
            className="w-full block"
            style={{ maxHeight: '160px', objectFit: 'contain' }}
          />
          <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full border backdrop-blur-sm ${s.pill}`}>
            {item.badge}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-2 border-t border-white/[0.06]">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
          <p className="text-[11px] text-gray-400 font-mono truncate flex-1 min-w-0">{item.filename}</p>
          <div className="flex items-center gap-1 shrink-0 text-gray-600 text-[10px]">
            {item.duration !== undefined && (
              <span className="flex items-center gap-0.5"><Clock size={8} />{item.duration.toFixed(1)}s</span>
            )}
            {item.size_mb !== undefined && (
              <span className="flex items-center gap-0.5 ml-1"><HardDrive size={8} />{item.size_mb.toFixed(1)}MB</span>
            )}
            <a
              href={item.url}
              download={item.filename}
              className="text-gray-600 hover:text-gray-200 bg-white/[0.06] hover:bg-white/[0.14] p-1 rounded-md transition-all ml-1"
            >
              <Download size={10} />
            </a>
            {item.badge === 'MERGED' && (
              <button
                onClick={() => setPublishOpen(true)}
                className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1 rounded-md transition-all"
                title="Publish to YouTube"
              >
                <Send size={10} />
              </button>
            )}
          </div>
        </div>
      </div>

      {publishOpen && (
        <PublishModal
          sessionId={sessionId}
          filename={item.filename}
          onClose={() => setPublishOpen(false)}
        />
      )}
    </>
  )
}

function SessionCard({ session, onDeleted }: { session: SessionSummary; onDeleted: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [sessionVideos, setSessionVideos] = useState<SessionVideos | null>(null)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const totalFiles = session.douyin_count + session.grok_count + session.merged_files.length
  const hasMerged = session.merged_files.length > 0

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteSession(session.session_id)
      onDeleted()
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const handleExpand = async () => {
    if (!expanded && !sessionVideos) {
      setLoadingVideos(true)
      try {
        const data = await api.listSessionVideos(session.session_id)
        setSessionVideos(data)
      } catch { /* ignore */ }
      finally { setLoadingVideos(false) }
    }
    setExpanded(v => !v)
  }

  // Build unified list: merged first, then douyin, then grok
  const allItems: VideoItem[] = [
    ...session.merged_urls.map((url, i) => ({
      filename: session.merged_files[i],
      url: toMediaUrl(url),
      badge: 'MERGED' as Badge,
    })),
    ...(sessionVideos?.douyin ?? []).map(f => ({
      filename: f.filename,
      url: toMediaUrl(f.download_url),
      badge: 'DOUYIN' as Badge,
      duration: f.duration,
      size_mb: f.size_mb,
    })),
    ...(sessionVideos?.grok ?? []).map(f => ({
      filename: f.filename,
      url: toMediaUrl(f.download_url),
      badge: 'GROK' as Badge,
      duration: f.duration,
      size_mb: f.size_mb,
    })),
  ]

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${
      hasMerged ? 'bg-white/[0.025] border-violet-500/20' : 'bg-white/[0.02] border-white/[0.07]'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          hasMerged
            ? 'bg-gradient-to-br from-violet-900/60 to-violet-800/30 border border-violet-500/20'
            : 'bg-white/[0.04] border border-white/[0.07]'
        }`}>
          <Film size={15} className={hasMerged ? 'text-violet-400' : 'text-gray-600'} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-violet-400 text-sm font-mono">{session.session_id}</code>
            {session.douyin_count > 0 && (
              <span className="text-[10px] font-bold bg-violet-950/60 border border-violet-500/25 text-violet-400 px-2 py-0.5 rounded-full">
                {session.douyin_count} douyin
              </span>
            )}
            {session.grok_count > 0 && (
              <span className="text-[10px] font-bold bg-fuchsia-950/60 border border-fuchsia-500/25 text-fuchsia-400 px-2 py-0.5 rounded-full">
                {session.grok_count} grok
              </span>
            )}
            {hasMerged && (
              <span className="text-[10px] font-bold bg-blue-950/60 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded-full">
                {session.merged_files.length} merged
              </span>
            )}
          </div>
          <p className="text-gray-600 text-xs mt-0.5">{new Date(session.created_at).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExpand}
            disabled={totalFiles === 0}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-30 px-3 py-1.5 rounded-lg transition-all"
          >
            {loadingVideos
              ? <RefreshCw size={11} className="animate-spin" />
              : expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />
            }
            {expanded ? 'Collapse' : `${totalFiles} files`}
          </button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-gray-600 hover:text-red-400 bg-white/[0.04] hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
              title="Delete session"
            >
              <Trash2 size={13} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/30 rounded-lg px-2 py-1">
              <span className="text-red-400 text-xs">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-400 hover:text-red-300 text-xs font-bold disabled:opacity-50"
              >
                {deleting ? <RefreshCw size={11} className="animate-spin" /> : 'Yes'}
              </button>
              <span className="text-red-800">·</span>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-gray-500 hover:text-gray-300 text-xs"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded: unified video grid */}
      {expanded && (
        <div className="border-t border-white/[0.06] p-4">
          {loadingVideos ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw size={16} className="animate-spin text-violet-400" />
            </div>
          ) : allItems.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6">No files found</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {allItems.map(item => (
                <VideoCard key={`${item.badge}-${item.filename}`} item={item} sessionId={session.session_id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { sessions } = await api.listSessions()
      setSessions(sessions)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          <span className="text-white font-semibold">{sessions.length}</span> session{sessions.length !== 1 ? 's' : ''} on server
        </p>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 bg-white/[0.05] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg transition-all">
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <RefreshCw size={20} className="animate-spin text-violet-400" />
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-4">
            <History size={26} className="text-gray-600" />
          </div>
          <p className="text-gray-500 font-medium">No sessions yet</p>
          <p className="text-gray-600 text-sm mt-1">Run the Workflow or Auto Run tab to create your first session.</p>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map(s => (
          <SessionCard key={s.session_id} session={s} onDeleted={load} />
        ))}
      </div>
    </div>
  )
}
