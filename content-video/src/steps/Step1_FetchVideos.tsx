import { useState } from 'react'
import { Users, User, Plus, X, Search, TrendingUp, ChevronRight, Tv2 } from 'lucide-react'
import { api } from '../api/client'
import { useWorkflow } from '../context/WorkflowContext'
import VideoCard from '../components/VideoCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

export default function Step1_FetchVideos() {
  const { state, setFetchMode, setFetchedVideos, setSelectedVideo, next } = useWorkflow()

  const [singleId, setSingleId] = useState('')
  const [singleCount, setSingleCount] = useState(10)
  const [multiIds, setMultiIds] = useState<string[]>([''])
  const [countPerUser, setCountPerUser] = useState(5)
  const [topN, setTopN] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    setError(null)
    setLoading(true)
    try {
      let videos
      if (state.fetchMode === 'user') {
        if (!singleId.trim()) throw new Error('Please enter a sec_user_id')
        videos = await api.fetchUserVideos(singleId.trim(), singleCount)
      } else {
        const ids = multiIds.map(s => s.trim()).filter(Boolean)
        if (!ids.length) throw new Error('Please enter at least one sec_user_id')
        videos = await api.fetchMultiUserVideos(ids, countPerUser, topN, keyword || undefined)
      }
      setFetchedVideos(videos)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (video: typeof state.fetchedVideos[0]) => {
    setSelectedVideo(video)
    next()
  }

  const addUserField = () => setMultiIds(ids => [...ids, ''])
  const removeUserField = (i: number) => setMultiIds(ids => ids.filter((_, idx) => idx !== i))
  const updateUserField = (i: number, v: string) =>
    setMultiIds(ids => ids.map((id, idx) => idx === i ? v : id))

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: Config form ── */}
      <div className="w-80 shrink-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pb-6">
        {/* Mode toggle */}
        <div className="flex gap-1 bg-white/[0.05] p-1 rounded-xl">
          {(['user', 'multi-user'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFetchMode(mode)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                state.fetchMode === mode
                  ? 'bg-violet-500 text-white shadow-md shadow-violet-900/40'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {mode === 'user' ? <User size={14} /> : <Users size={14} />}
              {mode === 'user' ? 'Single' : 'Multi'}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          {state.fetchMode === 'user' ? (
            <>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block uppercase tracking-wider font-semibold">sec_user_id</label>
                <input
                  value={singleId}
                  onChange={e => setSingleId(e.target.value)}
                  placeholder="MS4wLjABAAAA..."
                  onKeyDown={e => e.key === 'Enter' && fetchVideos()}
                  className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 font-mono placeholder-gray-700"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Videos to fetch</label>
                  <span className="text-xs text-violet-400 font-bold">{singleCount}</span>
                </div>
                <input type="range" min={1} max={30} value={singleCount}
                  onChange={e => setSingleCount(Number(e.target.value))}
                  className="w-full accent-violet-500" />
                <div className="flex justify-between text-[10px] text-gray-700 mt-1">
                  <span>1</span><span>30</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider font-semibold">User IDs</label>
                <div className="space-y-2">
                  {multiIds.map((id, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={id}
                        onChange={e => updateUserField(i, e.target.value)}
                        placeholder={`User ${i + 1}…`}
                        className="flex-1 bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-violet-500 font-mono placeholder-gray-700"
                      />
                      {multiIds.length > 1 && (
                        <button onClick={() => removeUserField(i)} className="text-gray-600 hover:text-red-400 p-1.5 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addUserField} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    <Plus size={12} /> Add user
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Per user</label>
                    <span className="text-[11px] text-violet-400 font-bold">{countPerUser}</span>
                  </div>
                  <input type="range" min={1} max={20} value={countPerUser}
                    onChange={e => setCountPerUser(Number(e.target.value))}
                    className="w-full accent-violet-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Top N</label>
                    <span className="text-[11px] text-violet-400 font-bold">{topN}</span>
                  </div>
                  <input type="range" min={1} max={50} value={topN}
                    onChange={e => setTopN(Number(e.target.value))}
                    className="w-full accent-violet-500" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block uppercase tracking-wider font-semibold">Keyword filter</label>
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Optional keyword…"
                    className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl pl-8 pr-3 py-2 text-gray-200 text-xs focus:outline-none focus:border-violet-500 placeholder-gray-700"
                  />
                </div>
              </div>
            </>
          )}

          {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

          <button
            onClick={fetchVideos}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 text-sm"
          >
            <TrendingUp size={15} />
            {loading ? 'Fetching…' : 'Fetch Videos'}
          </button>
        </div>

        {/* Selected video banner */}
        {state.selectedVideo && (
          <div className="flex items-center gap-3 bg-violet-950/40 border border-violet-500/25 rounded-xl p-3">
            <img src={state.selectedVideo.cover} className="w-10 h-14 object-cover rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-violet-400 text-xs font-bold uppercase tracking-wider">Selected</p>
              <p className="text-gray-300 text-xs mt-0.5 truncate">{state.selectedVideo.desc}</p>
            </div>
            <button onClick={next} className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-xs font-semibold shrink-0">
              Next <ChevronRight size={13} />
            </button>
          </div>
        )}
        </div>{/* end scrollable */}
      </div>

      {/* ── Right: Results panel ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner text="Fetching videos from Douyin…" size="lg" />
          </div>
        )}

        {!loading && state.fetchedVideos.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <Tv2 size={36} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">No videos yet</p>
            <p className="text-gray-700 text-sm mt-1">Enter a Douyin user ID and click Fetch Videos</p>
          </div>
        )}

        {!loading && state.fetchedVideos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{state.fetchedVideos.length}</span> videos fetched
                <span className="text-gray-600 ml-2">· click to select &amp; continue</span>
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {state.fetchedVideos.map(video => (
                <VideoCard
                  key={video.aweme_id}
                  video={video}
                  selected={state.selectedVideo?.aweme_id === video.aweme_id}
                  onSelect={() => handleSelect(video)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
