import { useState, useRef } from 'react'
import { ImagePlus, ArrowLeft, ChevronRight, RefreshCw, Check, Upload } from 'lucide-react'
import { api } from '../api/client'
import { useWorkflow } from '../context/WorkflowContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

export default function Step3_RemakeImage() {
  const { state, back, next, setRemadeImages, setSelectedKolImage } = useWorkflow()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const images = state.remadeImages
  const selected = state.selectedKolImage

  const handleFile = (f: File) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

  const remake = async () => {
    if (!file) return
    setError(null)
    setLoading(true)
    setRemadeImages([])
    setSelectedKolImage(null)
    try {
      const data = await api.remakeKolImage(file, state.sessionId!)
      setRemadeImages(data.image_urls)
      if (data.image_urls.length > 0) setSelectedKolImage(data.image_urls[0])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* ── Left: Upload ── */}
      <div className="w-80 shrink-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pb-2">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <h3 className="text-gray-200 font-semibold text-sm flex items-center gap-2">
              <ImagePlus size={16} className="text-violet-400" />
              Upload KOL Image
            </h3>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="relative border-2 border-dashed border-white/[0.12] hover:border-violet-500/50 rounded-xl cursor-pointer transition-all overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Upload size={24} className="text-gray-600" />
                  <p className="text-gray-500 text-xs">Drop image here or click to browse</p>
                  <p className="text-gray-700 text-[11px]">JPG, PNG</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
            </div>

            {file && (
              <p className="text-[11px] text-gray-500 truncate">{file.name}</p>
            )}

            {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

            <button
              onClick={remake}
              disabled={!file || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-900/30 text-sm"
            >
              {loading ? <RefreshCw size={15} className="animate-spin" /> : <ImagePlus size={15} />}
              {loading ? 'Remaking…' : images.length ? 'Regenerate' : 'Remake Image'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-3 pb-6 shrink-0">
          <button onClick={back} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={next}
            disabled={!selected}
            className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Right: Results ── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner text="Grok is remaking your image…" size="lg" />
          </div>
        )}

        {!loading && images.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
              <ImagePlus size={36} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">No images yet</p>
            <p className="text-gray-700 text-sm mt-1">Upload a KOL photo and click Remake Image</p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{images.length}</span> images generated
              <span className="text-gray-600 ml-2">· click to select</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {images.map((url, i) => {
                const isSelected = selected === url
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedKolImage(url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-violet-400 shadow-[0_0_16px_rgba(139,92,246,0.25)]'
                        : 'border-white/[0.08] hover:border-white/[0.20]'
                    }`}
                  >
                    <img src={url} alt={`Remade ${i + 1}`} className="w-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
                        <Check size={13} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
