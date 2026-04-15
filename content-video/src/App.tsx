import { useState } from 'react'
import { WorkflowProvider, useWorkflow } from './context/WorkflowContext'
import Stepper from './components/Stepper'
import Step1_FetchVideos from './steps/Step1_FetchVideos'
import Step2_Download from './steps/Step2_Download'
import Step3_Prompts from './steps/Step3_Prompts'
import Step4_GenerateVideo from './steps/Step4_GenerateVideo'
import Step5_Merge from './steps/Step5_Merge'
import Step6_Review from './steps/Step6_Review'
import HistoryPage from './pages/HistoryPage'
import AutoRunPage from './pages/AutoRunPage'
import { Film, Zap, History } from 'lucide-react'

const STEP_TITLES = [
  'Fetch Videos',
  'Download & Segments',
  'Generate Prompts',
  'Generate Video',
  'Merge Videos',
  'Review',
]

const STEPS = [
  Step1_FetchVideos,
  Step2_Download,
  Step3_Prompts,
  Step4_GenerateVideo,
  Step5_Merge,
  Step6_Review,
]

type Tab = 'workflow' | 'auto' | 'history'

const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'workflow', label: 'Workflow',  icon: <Film size={18} />,    desc: 'Step-by-step' },
  { id: 'auto',     label: 'Auto Run', icon: <Zap size={18} />,     desc: 'Full automation' },
  { id: 'history',  label: 'History',  icon: <History size={18} />, desc: 'Past sessions' },
]

function WorkflowApp() {
  const { state } = useWorkflow()
  const StepComponent = STEPS[state.currentStep]
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Stepper bar */}
      <div className="border-b border-white/[0.06] bg-white/[0.02] px-8 shrink-0">
        <Stepper />
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden px-8">
          {/* Step header — fixed height */}
          <div className="pt-7 pb-5 shrink-0">
            <span className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.15em]">
              Step {state.currentStep + 1} / {STEPS.length}
            </span>
            <h1 className="text-2xl font-bold text-white mt-1">{STEP_TITLES[state.currentStep]}</h1>
          </div>
          {/* Step content — fills remaining height */}
          <div className="flex-1 min-h-0">
            <StepComponent />
          </div>
        </main>
      </div>
    </div>
  )
}

function AppInner() {
  const [tab, setTab] = useState<Tab>('workflow')

  return (
    <div className="flex h-screen bg-[#0c0a14] text-gray-100 overflow-hidden">

      {/* ── Left Sidebar ── */}
      <aside className="w-52 shrink-0 flex flex-col bg-[#110e1c] border-r border-white/[0.06]">
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-3 border-b border-white/[0.05]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/50 shrink-0">
            <Film size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-100 text-sm leading-tight">Content Video</p>
            <p className="text-gray-600 text-[11px]">Studio</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {TABS.map(t => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group relative
                  ${active
                    ? 'bg-violet-500/12 border border-violet-500/20 text-violet-200'
                    : 'border border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-violet-400 rounded-r-full" />
                )}
                <span className={`shrink-0 transition-colors ${active ? 'text-violet-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {t.icon}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${active ? '' : 'text-gray-400'}`}>{t.label}</p>
                  <p className="text-[11px] text-gray-600 leading-tight mt-0.5">{t.desc}</p>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <p className="text-[11px] text-gray-700">Powered by Grok AI</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {tab === 'workflow' && <WorkflowApp />}

        {tab === 'auto' && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-8">
              <div className="mb-7">
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.15em]">Automation</span>
                <h1 className="text-2xl font-bold text-white mt-1">Auto Run</h1>
                <p className="text-gray-500 text-sm mt-1">Configure once, run all 6 steps automatically.</p>
              </div>
              <AutoRunPage />
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-8">
              <div className="mb-7">
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-[0.15em]">Sessions</span>
                <h1 className="text-2xl font-bold text-white mt-1">History</h1>
                <p className="text-gray-500 text-sm mt-1">All completed workflow sessions on the server.</p>
              </div>
              <HistoryPage />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WorkflowProvider>
      <AppInner />
    </WorkflowProvider>
  )
}
