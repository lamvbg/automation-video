import { useEffect, useState } from 'react'
import { X, Settings, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../api/client'

interface Props {
  onClose: () => void
}

interface SettingsState {
  browser_api_url: string
  grok_cookies: string
  grok_user_agent: string
  douyin_cookies: string
  x_cookies: string
}

const EMPTY: SettingsState = {
  browser_api_url: '',
  grok_cookies: '',
  grok_user_agent: '',
  douyin_cookies: '',
  x_cookies: '',
}

export default function SettingsModal({ onClose }: Props) {
  const [form, setForm] = useState<SettingsState>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getSettings()
      .then(d => setForm({
        browser_api_url: d.browser_api_url || '',
        grok_cookies: d.grok_cookies || '',
        grok_user_agent: d.grok_user_agent || '',
        douyin_cookies: d.douyin_cookies || '',
        x_cookies: d.x_cookies || '',
      }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key: keyof SettingsState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setError(null)
    setSaving(true)
    setSaved(false)
    try {
      await api.updateSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-[#0c0a14] border border-white/[0.10] rounded-xl px-3 py-2.5 text-gray-200 text-sm focus:outline-none focus:border-violet-500 font-mono resize-none'
  const labelCls = 'text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 block'
  const hintCls = 'text-gray-700 text-[11px] mt-1'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-[#110e1c] border border-white/[0.10] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] shrink-0">
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
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 py-10">
              <RefreshCw size={14} className="animate-spin" /> Loading…
            </div>
          ) : (
            <>
              {/* Browser API */}
              <div>
                <label className={labelCls}>Anti-detect Browser API URL</label>
                <p className={hintCls}>TaoThaoAI Claw port — xem trong Settings của app</p>
                <input
                  value={form.browser_api_url}
                  onChange={set('browser_api_url')}
                  placeholder="http://127.0.0.1:58641/api"
                  className={`${inputCls} mt-1.5`}
                />
              </div>

              {/* Grok Cookies */}
              <div>
                <label className={labelCls}>Grok Cookies</label>
                <p className={hintCls}>Lấy từ DevTools → Network → bất kỳ request grok.com → copy giá trị Cookie:</p>
                <textarea
                  value={form.grok_cookies}
                  onChange={set('grok_cookies')}
                  placeholder="_ga=...; sso=...; x-userid=..."
                  rows={4}
                  className={`${inputCls} mt-1.5`}
                />
              </div>

              {/* Grok User Agent */}
              <div>
                <label className={labelCls}>Grok User Agent</label>
                <input
                  value={form.grok_user_agent}
                  onChange={set('grok_user_agent')}
                  placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
                  className={`${inputCls} mt-1.5`}
                />
              </div>

              {/* Douyin Cookies */}
              <div>
                <label className={labelCls}>Douyin Cookies</label>
                <p className={hintCls}>Lấy từ douyin.com → DevTools → Network → copy Cookie:</p>
                <textarea
                  value={form.douyin_cookies}
                  onChange={set('douyin_cookies')}
                  placeholder="s_v_web_id=...; ttwid=..."
                  rows={4}
                  className={`${inputCls} mt-1.5`}
                />
              </div>

              {/* X (Twitter) Cookies */}
              <div>
                <label className={labelCls}>X (Twitter) Cookies</label>
                <p className={hintCls}>Lấy từ x.com → DevTools → copy auth_token và ct0</p>
                <textarea
                  value={form.x_cookies}
                  onChange={set('x_cookies')}
                  placeholder="auth_token=...; ct0=..."
                  rows={3}
                  className={`${inputCls} mt-1.5`}
                />
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-2">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-950/40 border border-green-500/30 rounded-xl px-3 py-2">
              <CheckCircle size={13} /> Đã lưu — settings có hiệu lực ngay, không cần restart
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/[0.07] shrink-0">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-4 py-2 rounded-xl text-sm transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
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
