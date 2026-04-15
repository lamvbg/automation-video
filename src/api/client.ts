// In Electron (file:// protocol), relative URLs resolve to file:///C:/api/...
// Must use absolute URL to reach the local backend instead.
const BASE = window.location.protocol === 'file:'
  ? 'http://127.0.0.1:8000/api/v1/content'
  : '/api/v1/content'

/** Convert absolute BE URL → relative path so Vite proxy handles it (avoids CORS / tab jump) */
export function toRelativePath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

/** Get the backend origin for media/download URLs.
 *  In Electron (file://), we need the full http://127.0.0.1:8000 prefix.
 *  In dev (http://localhost:3000), relative paths work via Vite proxy.
 */
const BACKEND_ORIGIN = window.location.protocol === 'file:'
  ? 'http://127.0.0.1:8000'
  : ''

/** Convert a BE URL (absolute or relative) to a URL usable in the renderer */
export function toMediaUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    return `${BACKEND_ORIGIN}${pathname}`
  } catch {
    // already a relative path like /downloads/...
    return `${BACKEND_ORIGIN}${url}`
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.detail || `HTTP ${res.status}`)
  }
  const json = await res.json()
  return json.data as T
}

const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })

const get = <T>(path: string) => request<T>(path, { method: 'GET' })

// ── Douyin ────────────────────────────────────────────────────────────────────

import type {
  DouyinVideo,
  DownloadResult,
  SessionVideos,
  GenerateVideoResult,
  MergeResult,
  ReviewResult,
} from '../types'

export const api = {
  fetchUserVideos: (sec_user_id: string, count = 10) =>
    post<DouyinVideo[]>('/douyin/user-videos', { sec_user_id, count }),

  fetchMultiUserVideos: (sec_user_ids: string[], count_per_user = 5, top = 10, keyword?: string) =>
    post<DouyinVideo[]>('/douyin/multi-user-videos', { sec_user_ids, count_per_user, top, keyword }),

  downloadVideo: (url: string, segment_duration = 5, max_segments = 5) =>
    post<DownloadResult>('/douyin/download', { url, segment_duration, max_segments }),

  listSessionVideos: (session_id: string) =>
    get<SessionVideos>(`/videos/${session_id}`),

  mergeVideos: (session_id: string, filenames: string[]) =>
    post<MergeResult>('/videos/merge', { session_id, filenames }),

  deleteVideos: (session_id: string, filenames: string[]) =>
    post('/videos/delete', { session_id, filenames }),

  remakeKolImage: (file: File, sessionId: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('session_id', sessionId)
    return request<{ image_urls: string[]; count: number }>('/grok/remake-kol-image', {
      method: 'POST',
      body: form,
      headers: {},  // let browser set Content-Type with boundary
    })
  },

  generateVideoFromTweet: (
    extra_prompt: string,
    session_id: string | null,
    ratio = '16:9',
    length = 6,
    res = '480p',
    upscale = true,
    kol_image_url?: string | null,
  ) => post<GenerateVideoResult>('/grok/generate-video-from-tweet', { extra_prompt, session_id, ratio, length, res, upscale, kol_image_url }),

  reviewVideo: (
    session_id: string,
    filename: string,
    criteria: string,
    fps = 1.0,
    max_frames = 15,
  ) => post<ReviewResult>('/videos/review', { session_id, filename, criteria, fps, max_frames }),

  hotKeywords: () => get<{ keywords: string[] }>('/douyin/hot-keywords'),

  deleteSession: (session_id: string) =>
    request<void>(`/videos/session/${session_id}`, { method: 'DELETE' }),

  publishVideo: (params: {
    session_id: string
    filename: string
    profile_id: string
    platform?: string
    title?: string
    description?: string
    tags?: string[]
    visibility?: string
  }) => post<{
    platform: string
    video_url: string
    video_id: string
    title: string
    status: string
    visibility: string
  }>('/videos/publish', params),

  listSessions: () => get<{
    sessions: Array<{
      session_id: string
      created_at: string
      douyin_count: number
      grok_count: number
      merged_files: string[]
      merged_urls: string[]
    }>
  }>('/sessions'),

  getSettings: () => get<{
    browser_api_url: string
    grok_cookies: string
    grok_user_agent: string
    douyin_cookies: string
    x_cookies: string
  }>('/settings'),

  updateSettings: (data: {
    browser_api_url?: string
    grok_cookies?: string
    grok_user_agent?: string
    douyin_cookies?: string
    x_cookies?: string
  }) => post<{ saved: boolean }>('/settings', data),
}
