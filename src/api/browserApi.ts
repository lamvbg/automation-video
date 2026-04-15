/**
 * Browser profile API — calls through our FastAPI backend (/browser/profiles)
 * so the anti-detect browser URL/port is configured in one place: BROWSER_API_URL in .env
 */

// Route through backend so BROWSER_API_URL port is configured in .env, not hardcoded here
const BROWSER_BASE = window.location.protocol === 'file:'
  ? 'http://127.0.0.1:8000/api/v1/content'
  : '/api/v1/content'

export interface BrowserProfile {
  id: string
  name: string
  folder: string
  proxy?: { mode: string; host: string; port: number }
}

async function browserGet(path: string): Promise<unknown> {
  let res: Response
  try {
    res = await fetch(`${BROWSER_BASE}${path}`, { signal: AbortSignal.timeout(8000) })
  } catch {
    throw new Error('Cannot reach backend on port 8000')
  }
  if (res.status === 503) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.detail || 'Browser API unavailable')
  }
  if (!res.ok) throw new Error(`Browser API HTTP ${res.status}`)
  const json = await res.json()
  return json.data ?? json
}

function extractProfiles(data: unknown): BrowserProfile[] {
  if (Array.isArray(data)) return data as BrowserProfile[]
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    for (const key of ['profiles', 'data', 'items', 'result', 'list']) {
      if (Array.isArray(obj[key])) return obj[key] as BrowserProfile[]
    }
  }
  return []
}

export const browserApi = {
  getProfiles: () => browserGet('/browser/profiles').then(extractProfiles),
}
