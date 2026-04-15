import React, { createContext, useContext, useState } from 'react'
import type { WorkflowState, FetchMode, DouyinVideo, DownloadResult, GenerateVideoResult, SessionVideos, MergeResult, ReviewResult } from '../types'

const INITIAL: WorkflowState = {
  currentStep: 0,
  fetchMode: 'user',
  fetchedVideos: [],
  selectedVideo: null,
  downloadResult: null,
  selectedSegments: new Set(),
  sessionId: null,
  generatedPrompts: [],
  selectedPrompt: null,
  generatedVideo: null,
  sessionVideos: null,
  mergeSelection: [],
  mergedVideo: null,
  reviewResult: null,
}

interface WorkflowCtx {
  state: WorkflowState
  goTo: (step: number) => void
  next: () => void
  back: () => void
  setFetchMode: (m: FetchMode) => void
  setFetchedVideos: (v: DouyinVideo[]) => void
  setSelectedVideo: (v: DouyinVideo) => void
  setDownloadResult: (r: DownloadResult) => void
  toggleSegment: (filename: string) => void
  removeSegment: (filename: string) => void
  setSessionId: (id: string) => void
  setGeneratedPrompts: (p: string[]) => void
  setSelectedPrompt: (p: string) => void
  setGeneratedVideo: (v: GenerateVideoResult) => void
  setSessionVideos: (v: SessionVideos) => void
  setMergeSelection: (filenames: string[]) => void
  setMergedVideo: (v: MergeResult) => void
  setReviewResult: (r: ReviewResult) => void
  reset: () => void
}

const WorkflowContext = createContext<WorkflowCtx | null>(null)

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WorkflowState>(INITIAL)

  const patch = (partial: Partial<WorkflowState>) =>
    setState(s => ({ ...s, ...partial }))

  const ctx: WorkflowCtx = {
    state,
    goTo: (step) => patch({ currentStep: step }),
    next: () => setState(s => ({ ...s, currentStep: Math.min(s.currentStep + 1, 5) })),
    back: () => setState(s => ({ ...s, currentStep: Math.max(s.currentStep - 1, 0) })),
    setFetchMode: (m) => patch({ fetchMode: m }),
    setFetchedVideos: (v) => patch({ fetchedVideos: v }),
    setSelectedVideo: (v) => patch({ selectedVideo: v }),
    setDownloadResult: (r) => patch({
      downloadResult: r,
      sessionId: r.session_id,
      selectedSegments: new Set(r.segments.map(s => s.filename)),
    }),
    toggleSegment: (filename) =>
      setState(s => {
        const next = new Set(s.selectedSegments)
        if (next.has(filename)) next.delete(filename)
        else next.add(filename)
        return { ...s, selectedSegments: next }
      }),
    removeSegment: (filename) =>
      setState(s => {
        const nextSelected = new Set(s.selectedSegments)
        nextSelected.delete(filename)
        const nextDownload = s.downloadResult
          ? {
              ...s.downloadResult,
              segments: s.downloadResult.segments.filter(seg => seg.filename !== filename),
              segment_count: s.downloadResult.segments.filter(seg => seg.filename !== filename).length,
            }
          : null
        return { ...s, selectedSegments: nextSelected, downloadResult: nextDownload }
      }),
    setSessionId: (id) => patch({ sessionId: id }),
    setGeneratedPrompts: (p) => patch({ generatedPrompts: p }),
    setSelectedPrompt: (p) => patch({ selectedPrompt: p }),
    setGeneratedVideo: (v) => patch({ generatedVideo: v }),
    setSessionVideos: (v) => patch({ sessionVideos: v }),
    setMergeSelection: (filenames) => patch({ mergeSelection: filenames }),
    setMergedVideo: (v) => patch({ mergedVideo: v }),
    setReviewResult: (r) => patch({ reviewResult: r }),
    reset: () => setState(INITIAL),
  }

  return <WorkflowContext.Provider value={ctx}>{children}</WorkflowContext.Provider>
}

export const useWorkflow = () => {
  const ctx = useContext(WorkflowContext)
  if (!ctx) throw new Error('useWorkflow must be used inside WorkflowProvider')
  return ctx
}
