// ── Douyin ────────────────────────────────────────────────────────────────────

export interface DouyinVideo {
  aweme_id: string
  desc: string
  created_at: string
  nickname: string
  digg_count: number
  comment_count: number
  share_count: number
  collect_count: number
  cover: string
  video_url: string
  douyin_url: string
  score: number
}

export interface VideoSegment {
  filename: string
  duration: number
  size_mb: number
  download_url: string
}

export interface DownloadResult {
  session_id: string
  video_info: DouyinVideo
  original_filename: string
  original_duration: number
  original_size_mb: number
  segment_count: number
  segments: VideoSegment[]
}

// ── Session Videos ────────────────────────────────────────────────────────────

export interface VideoFileInfo {
  source: string
  filename: string
  size_mb: number
  duration: number
  download_url: string
}

export interface SessionVideos {
  session_id: string
  douyin: VideoFileInfo[]
  grok: VideoFileInfo[]
}

// ── Grok ──────────────────────────────────────────────────────────────────────

export interface GenerateVideoResult {
  post_id: string
  video_post_id: string | null
  video_url: string
  hd_video_url: string
  local_filename: string
  download_url: string
}

export interface MergeResult {
  filename: string
  duration: number
  size_mb: number
  download_url: string
}

export interface ReviewResult {
  filename: string
  frame_count: number
  passed: boolean
  score: number
  feedback: string
  issues: string[]
  raw_response: string
}

// ── Workflow State ────────────────────────────────────────────────────────────

export type FetchMode = 'user' | 'multi-user'

export interface WorkflowState {
  currentStep: number
  fetchMode: FetchMode
  fetchedVideos: DouyinVideo[]
  selectedVideo: DouyinVideo | null
  downloadResult: DownloadResult | null
  selectedSegments: Set<string>          // filenames of kept segments
  sessionId: string | null
  remadeImages: string[]
  selectedKolImage: string | null
  generatedVideo: GenerateVideoResult | null
  sessionVideos: SessionVideos | null
  mergeSelection: string[]               // prefixed filenames like 'douyin/file.mp4'
  mergedVideo: MergeResult | null
  reviewResult: ReviewResult | null
}
