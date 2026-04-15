import { useEffect, useState } from 'react'
import { X, Settings, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../api/client'

interface Props {
  onClose: () => void
}

export default function SettingsModal({ onClose }: Props) {
  const [browserApiUrl, setBrowserApiUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getSettings()
      .then(d => setBrowserApiUrl(d.browser_api_url))
      .catch(() => setBrowserApiUrl('http://127.0.0.1:19995/api'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!browserApiUrl.trim()) return
    setError(null)
    setSaving(true)
    setSaved(false)
    try {
      const d = await api.updateSettings(browserApiUrl.trim())
      setBrowserApiUrl(d.browser_api_url)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-[#110e1c] border border-white/[0.10] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Settings size={14} className="text-white" />
            </div>
            <p className="text-gray-100 font-semibold text-sm">Settings</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-200 bg-white/[0.06] p-1.5 rounded-lg transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
              Anti-detect Browser API URL
            </label>
            <p className="text-gray-600 text-xs mb-2">
              TaoThaoAI Claw API endpoint. Check Settings trong app để xem port hiện tại.
            </p>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <RefreshCw size={13} className="animate-spin" /> Loading…
              </div>
            ) : (
              <input
                value={browserApiUrl}
                onChange={e => { setBrowserApiUrl(e.target.value); setSaved(false) }}
                placeholder="http://127.0.0.1:58641/api"
                className="w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 font-mono"
              />
            )}
            <p className="text-gray-700 text-[11px] mt-1.5">
              Ví dụ: <span className="font-mono text-gray-600">http://127.0.0.1:58641/api</span>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-2">
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-950/40 border border-green-500/30 rounded-xl px-3 py-2">
              <CheckCircle size={13} />
              Đã lưu — backend đã reload settings
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/[0.07]">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-4 py-2 rounded-xl text-sm transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading || !browserApiUrl.trim()}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
