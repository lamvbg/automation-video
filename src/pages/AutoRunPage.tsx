import { useState, useRef, useEffect } from 'react'
import {
  Play, Square, CheckCircle, XCircle, Loader2, Zap,
  Plus, X, User, Users, Download, Video, ShieldCheck, ChevronRight, Send,
  Youtube, ChevronDown, AlertCircle, ToggleLeft, ToggleRight
} from 'lucide-react'
import { api, toMediaUrl } from '../api/client'
import { browserApi, type BrowserProfile } from '../api/browserApi'
import PublishModal from '../components/PublishModal'

type LogStatus = 'pending' | 'running' | 'done' | 'error' | 'skipped'
interface LogEntry { step: string; status: LogStatus; detail?: string }

const CRITERIA_DEFAULT = 'Check for inappropriate content and ensure suitability for social media.'

const BASE_SECTIONS = [
  { icon: <User size={13} />, label: 'Fetch' },
  { icon: <Download size={13} />, label: 'Download' },
  { icon: <Video size={13} />, label: 'Generate' },
  { icon: <Send size={13} />, label: 'Merge' },
  { icon: <ShieldCheck size={13} />, label: 'Review' },
]

export default function AutoRunPage() {
  const [mode, setMode] = useState<'user' | 'multi'>('user')
  const [singleId, setSingleId] = useState('')
  const [multiIds, setMultiIds] = useState<string[]>([''])
  const [videoCount, setVideoCount] = useState(5)
  const [topN, setTopN] = useState(1)
  const [segDuration, setSegDuration] = useState(5)
  const [maxSegments, setMaxSegments] = useState(5)
  const [extraPrompt, setExtraPrompt] = useState('')
  const [ratio, setRatio] = useState('16:9')
  const [vidLength, setVidLength] = useState(6)
  const [res, setRes] = useState('480p')
  const [criteria, setCriteria] = useState(CRITERIA_DEFAULT)

  // Auto-publish config
  const [autoPublish, setAutoPublish] = useState(false)
  const [publishProfileId, setPublishProfileId] = useState('')
  const [publishVisibility, setPublishVisibility] = useState('public')
  const [publishTitle, setPublishTitle] = useState('')
  const [publishDescription, setPublishDescription] = useState('')
  const [publishTags, setPublishTags] = useState('')
  const [profiles, setProfiles] = useState<BrowserProfile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [mergedFilename, setMergedFilename] = useState<string | null>(null)
  const [mergedSessionId, setMergedSessionId] = useState<string | null>(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const abortRef = useRef(false)

  useEffect(() => {
    if (autoPublish && profiles.length === 0 && !loadingProfiles) {
      setLoadingProfiles(true)
      setProfileError(null)
      browserApi.getProfiles()
        .then(arr => {
          setProfiles(arr)
          if (arr.length > 0) setPublishProfileId(arr[0].id)
        })
        .catch(() => setProfileError('Cannot connect to browser API (port 19995)'))
        .finally(() => setLoadingProfiles(false))
    }
  }, [autoPublish])

  const log = (step: string, status: LogStatus, detail?: string) =>
    setLogs(prev => {
      const idx = prev.findIndex(l => l.step === step)
      const entry = { step, status, detail }
      return idx >= 0 ? prev.map((l, i) => i === idx ? entry : l) : [...prev, entry]
    })

  const run = async () => {
    abortRef.current = false
    setRunning(true)
    setLogs([])
    setMergedUrl(null)
    setMergedFilename(null)
    try {
      log('1. Fetch top video', 'running')
      const ids = mode === 'user' ? [singleId.trim()] : multiIds.map(s => s.trim()).filter(Boolean)
      if (!ids.length || !ids[0]) throw new Error('No sec_user_id provided')
      let videos
      if (mode === 'user') {
        videos = await api.fetchUserVideos(ids[0], videoCount)
      } else {
        videos = await api.fetchMultiUserVideos(ids, videoCount, topN)
      }
      if (!videos.length) throw new Error('No videos returned')
      const video = videos[0]
      log('1. Fetch top video', 'done', `@${video.nickname}: ${video.desc.slice(0, 60)}`)
      if (abortRef.current) return

      log('2. Download & split', 'running')
      const dlResult = await api.downloadVideo(video.douyin_url, segDuration, maxSegments)
      const { session_id, segments } = dlResult
      log('2. Download & split', 'done', `${segments.length} segments · session ${session_id}`)
      if (abortRef.current) return

      log('3. Generate Grok video', 'running')
      const grokResult = await api.generateVideoFromTweet(extraPrompt.trim(), session_id, ratio, vidLength, res, true)
      log('3. Generate Grok video', 'done', grokResult.local_filename)
      if (abortRef.current) return

      log('4. Merge videos', 'running')
      const sessionFiles = await api.listSessionVideos(session_id)
      const douyinFiles = sessionFiles.douyin.map(f => `douyin/${f.filename}`)
      const grokFiles = sessionFiles.grok.map(f => `grok/${f.filename}`)
      const mergeList = [...douyinFiles, ...grokFiles]
      if (mergeList.length < 2) throw new Error('Not enough files to merge')
      const mergeResult = await api.mergeVideos(session_id, mergeList)
      setMergedUrl(mergeResult.download_url)
      setMergedFilename(mergeResult.filename)
      setMergedSessionId(session_id)
      log('4. Merge videos', 'done', `${mergeResult.duration.toFixed(1)}s · ${mergeResult.size_mb.toFixed(2)} MB`)
      if (abortRef.current) return

      log('5. AI Review', 'running')
      const review = await api.reviewVideo(session_id, mergeResult.filename, criteria)
      log('5. AI Review', review.passed ? 'done' : 'error',
        `Score ${review.score}/10 — ${review.feedback.slice(0, 100)}`)
      if (abortRef.current) return

      if (autoPublish && publishProfileId) {
        log('7. Publish to YouTube', 'running')
        try {
          const pubResult = await api.publishVideo({
            session_id,
            filename: mergeResult.filename,
            profile_id: publishProfileId,
            platform: 'youtube',
            title: publishTitle.trim() || undefined,
            description: publishDescription.trim() || undefined,
            tags: publishTags.trim() ? publishTags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
            visibility: publishVisibility,
          })
          log('7. Publish to YouTube', 'done', pubResult.video_url)
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          log('7. Publish to YouTube', 'error', msg)
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setLogs(prev => {
        const r = prev.find(l => l.status === 'running')
        if (r) return prev.map(l => l.status === 'running' ? { ...l, status: 'error' as LogStatus, detail: msg } : l)
        return [...prev, { step: 'Error', status: 'error' as LogStatus, detail: msg }]
      })
    } finally {
      setRunning(false)
    }
  }

  const stop = () => { abortRef.current = true; setRunning(false) }

  const statusIcon = (s: LogStatus) => ({
    pending: <div className="w-5 h-5 rounded-full border-2 border-white/[0.10]" />,
    running: <div className="w-5 h-5 rounded-full border-2 border-violet-400 flex items-center justify-center"><Loader2 size={11} className="animate-spin text-violet-400" /></div>,
    done: <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"><CheckCircle size={11} className="text-white" /></div>,
    error: <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"><XCircle size={11} className="text-white" /></div>,
    skipped: <div className="w-5 h-5 rounded-full bg-white/[0.08]" />,
  }[s])

  const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-violet-400">{icon}</span>
      <span className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.12em]">{label}</span>
    </div>
  )

  const ToggleGroup = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex bg-[#0c0a14] p-0.5 rounded-lg border border-white/[0.07]">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${value === o ? 'bg-gradient-to-b from-violet-500 to-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
          {o}
        </button>
      ))}
    </div>
  )

  const SECTIONS = autoPublish
    ? [...BASE_SECTIONS, { icon: <Youtube size={13} />, label: 'Publish' }]
    : BASE_SECTIONS

  const isDone = logs.length > 0 && logs.every(l => l.status === 'done' || l.status === 'error')
  const hasError = logs.some(l => l.status === 'error')

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: Config ── */}
      <div className="w-[340px] shrink-0 overflow-y-auto space-y-3 pr-1">

        {/* Section: Video Source */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 space-y-3">
          <SectionLabel icon={<User size={13} />} label="Video Source" />
          <div className="flex bg-[#0c0a14] p-0.5 rounded-lg border border-white/[0.07]">
            {(['user', 'multi'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all ${mode === m ? 'bg-gradient-to-b from-violet-500 to-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {m === 'user' ? <User size={11} /> : <Users size={11} />}
                {m === 'user' ? 'Single' : 'Multi'}
              </button>
            ))}
          </div>
          {mode === 'user' ? (
            <input value={singleId} onChange={e => setSingleId(e.target.value)}
              placeholder="sec_user_id"
              className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 font-mono placeholder-gray-700" />
          ) : (
            <div className="space-y-2">
              {multiIds.map((id, i) => (
                <div key={i} className="flex gap-2">
                  <input value={id} onChange={e => setMultiIds(ids => ids.map((v, j) => j === i ? e.target.value : v))}
                    placeholder={`User ${i + 1}…`}
                    className="flex-1 bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-violet-500 font-mono placeholder-gray-700" />
                  {multiIds.length > 1 && <button onClick={() => setMultiIds(ids => ids.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 p-1.5"><X size={13} /></button>}
                </div>
              ))}
              <button onClick={() => setMultiIds(ids => [...ids, ''])} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300">
                <Plus size={12} /> Add user
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between mb-1"><label className="text-[11px] text-gray-600">Fetch count</label><span className="text-[11px] text-violet-400 font-bold">{videoCount}</span></div>
              <input type="range" min={1} max={20} value={videoCount} onChange={e => setVideoCount(+e.target.value)} className="w-full accent-violet-500" />
            </div>
            {mode === 'multi' && (
              <div>
                <div className="flex justify-between mb-1"><label className="text-[11px] text-gray-600">Top N</label><span className="text-[11px] text-violet-400 font-bold">{topN}</span></div>
                <input type="range" min={1} max={10} value={topN} onChange={e => setTopN(+e.target.value)} className="w-full accent-violet-500" />
              </div>
            )}
          </div>
        </div>

        {/* Section: Download */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 space-y-3">
          <SectionLabel icon={<Download size={13} />} label="Download & Split" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between mb-1"><label className="text-[11px] text-gray-600">Segment duration</label><span className="text-[11px] text-violet-400 font-bold">{segDuration}s</span></div>
              <input type="range" min={3} max={7} value={segDuration} onChange={e => setSegDuration(+e.target.value)} className="w-full accent-violet-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1"><label className="text-[11px] text-gray-600">Max segments</label><span className="text-[11px] text-violet-400 font-bold">{maxSegments}</span></div>
              <input type="range" min={1} max={10} value={maxSegments} onChange={e => setMaxSegments(+e.target.value)} className="w-full accent-violet-500" />
            </div>
          </div>
        </div>

        {/* Section: Video Generation */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 space-y-3">
          <SectionLabel icon={<Video size={13} />} label="Video Generation" />
          <div>
            <label className="text-[11px] text-gray-600 block mb-1.5">Extra Prompt <span className="font-normal">(optional)</span></label>
            <textarea value={extraPrompt} onChange={e => setExtraPrompt(e.target.value)} rows={2}
              placeholder="Custom style or instructions…"
              className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-xs focus:outline-none focus:border-violet-500 resize-none placeholder-gray-700" />
          </div>
          <div>
            <label className="text-[11px] text-gray-600 block mb-1.5">Aspect Ratio</label>
            <ToggleGroup options={['16:9', '9:16', '1:1']} value={ratio} onChange={setRatio} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-600 block mb-1.5">Duration</label>
              <ToggleGroup options={['6s', '10s']} value={`${vidLength}s`} onChange={v => setVidLength(parseInt(v))} />
            </div>
            <div>
              <label className="text-[11px] text-gray-600 block mb-1.5">Resolution</label>
              <ToggleGroup options={['480p', '720p']} value={res} onChange={setRes} />
            </div>
          </div>
        </div>

        {/* Section: Review */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 space-y-3">
          <SectionLabel icon={<ShieldCheck size={13} />} label="Review Criteria" />
          <textarea value={criteria} onChange={e => setCriteria(e.target.value)} rows={2}
            className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-xs focus:outline-none focus:border-violet-500 resize-none" />
        </div>

        {/* Section: Publish */}
        <div className={`border rounded-2xl p-4 space-y-3 transition-all ${autoPublish ? 'bg-red-950/20 border-red-500/25' : 'bg-white/[0.04] border-white/[0.07]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center shrink-0">
                <Youtube size={11} className="text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">Auto Publish</span>
            </div>
            <button onClick={() => setAutoPublish(v => !v)} className="text-gray-500 hover:text-gray-300 transition-all">
              {autoPublish
                ? <ToggleRight size={22} className="text-red-400" />
                : <ToggleLeft size={22} />}
            </button>
          </div>

          {autoPublish && (
            <>
              {/* Profile selector */}
              <div>
                <label className="text-[11px] text-gray-600 block mb-1.5">Browser Profile</label>
                {loadingProfiles ? (
                  <div className="flex items-center gap-2 text-gray-500 text-xs py-1.5">
                    <Loader2 size={11} className="animate-spin" /> Loading profiles…
                  </div>
                ) : profileError ? (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-2">
                    <AlertCircle size={11} /> {profileError}
                  </div>
                ) : profiles.length === 0 ? (
                  <input
                    value={publishProfileId}
                    onChange={e => setPublishProfileId(e.target.value)}
                    placeholder="Enter profile ID manually…"
                    className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-red-500 placeholder-gray-700"
                  />
                ) : (
                  <div className="relative">
                    <select
                      value={publishProfileId}
                      onChange={e => setPublishProfileId(e.target.value)}
                      className="w-full appearance-none bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-red-500 pr-7"
                    >
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.name || p.id}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] text-gray-600 block mb-1.5">Title <span className="text-gray-700 font-normal">(optional, auto-generated if empty)</span></label>
                <input
                  value={publishTitle}
                  onChange={e => setPublishTitle(e.target.value)}
                  placeholder="Auto-generated by Grok AI…"
                  className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-red-500 placeholder-gray-700"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] text-gray-600 block mb-1.5">Description <span className="text-gray-700 font-normal">(optional)</span></label>
                <textarea
                  value={publishDescription}
                  onChange={e => setPublishDescription(e.target.value)}
                  placeholder="Auto-generated by Grok AI…"
                  rows={2}
                  className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-red-500 resize-none placeholder-gray-700"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] text-gray-600 block mb-1.5">Tags <span className="text-gray-700 font-normal">(comma-separated)</span></label>
                <input
                  value={publishTags}
                  onChange={e => setPublishTags(e.target.value)}
                  placeholder="travel, music, viral…"
                  className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-red-500 placeholder-gray-700"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="text-[11px] text-gray-600 block mb-1.5">Visibility</label>
                <div className="flex gap-1.5">
                  {(['public', 'unlisted', 'private'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setPublishVisibility(v)}
                      className={`flex-1 py-1.5 rounded-lg border text-[11px] font-semibold capitalize transition-all ${
                        publishVisibility === v
                          ? 'bg-red-500/15 border-red-500/50 text-red-300'
                          : 'border-white/[0.08] text-gray-600 hover:border-white/[0.18]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right: Run + Progress + Result ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Run button */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <Zap size={17} className="text-white" />
            </div>
            <div>
              <p className="text-gray-100 font-bold">Auto Run</p>
              <p className="text-gray-500 text-xs">Runs all 6 steps sequentially</p>
            </div>
          </div>

          {/* Step chips */}
          <div className="flex items-center gap-1 mb-5 flex-wrap">
            {SECTIONS.map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${
                  running && logs[i]?.status === 'running' ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' :
                  logs[i]?.status === 'done' ? 'bg-violet-950/40 border-violet-500/20 text-violet-400' :
                  logs[i]?.status === 'error' ? 'bg-red-950/40 border-red-500/20 text-red-400' :
                  'border-white/[0.07] text-gray-600'
                }`}>
                  {logs[i]?.status === 'running' ? <Loader2 size={10} className="animate-spin" /> :
                   logs[i]?.status === 'done' ? <CheckCircle size={10} /> :
                   logs[i]?.status === 'error' ? <XCircle size={10} /> :
                   s.icon}
                  {s.label}
                </div>
                {i < SECTIONS.length - 1 && <ChevronRight size={11} className="text-gray-700 shrink-0" />}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={run} disabled={running}
              className="flex items-center gap-2 bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-violet-900/30">
              {running ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
              {running ? 'Running…' : 'Run All Steps'}
            </button>
            {running && (
              <button onClick={stop}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
                <Square size={13} /> Stop
              </button>
            )}
          </div>
        </div>

        {/* Progress log */}
        {logs.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Progress Log</p>
              {isDone && (
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${hasError ? 'bg-red-950/40 border-red-500/30 text-red-400' : 'bg-violet-950/40 border-violet-500/30 text-violet-400'}`}>
                  {hasError ? 'Completed with errors' : 'All steps completed'}
                </span>
              )}
            </div>
            <div className="space-y-0">
              {logs.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  {i < logs.length - 1 && (
                    <div className="absolute left-[9px] top-6 w-px h-full bg-white/[0.05] z-0" />
                  )}
                  <span className="shrink-0 mt-0.5 relative z-10">{statusIcon(entry.status)}</span>
                  <div className={`pb-4 flex-1 min-w-0 transition-all`}>
                    <p className={`text-sm font-semibold leading-tight ${
                      entry.status === 'done' ? 'text-gray-200' :
                      entry.status === 'running' ? 'text-violet-300' :
                      entry.status === 'error' ? 'text-red-400' : 'text-gray-600'
                    }`}>{entry.step}</p>
                    {entry.detail && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed truncate">{entry.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result video */}
        {mergedUrl && mergedFilename && (
          <div className="bg-white/[0.04] border border-violet-500/25 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-violet-950/60 to-transparent border-b border-violet-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-violet-400" />
                <p className="text-violet-300 font-semibold text-sm">Result — saved to History</p>
              </div>
              <button
                onClick={() => setPublishOpen(true)}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-all text-xs"
              >
                <Send size={11} /> Publish to YouTube
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-black rounded-xl overflow-hidden">
                <video src={toMediaUrl(mergedUrl)} controls className="w-full max-h-64" />
              </div>
              <p className="text-xs text-gray-600 font-mono">{mergedFilename}</p>
            </div>
          </div>
        )}

        {publishOpen && mergedSessionId && mergedFilename && (
          <PublishModal
            sessionId={mergedSessionId}
            filename={mergedFilename}
            onClose={() => setPublishOpen(false)}
          />
        )}

        {/* Empty state */}
        {logs.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <Zap size={36} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">Ready to run</p>
            <p className="text-gray-700 text-sm mt-1">Configure the settings on the left, then click Run All Steps</p>
          </div>
        )}
      </div>
    </div>
  )
}
