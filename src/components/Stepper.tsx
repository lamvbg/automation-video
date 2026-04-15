import { Check } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'

const STEPS = [
  { label: 'Fetch' },
  { label: 'Download' },
  { label: 'KOL Image' },
  { label: 'Generate' },
  { label: 'Merge' },
  { label: 'Review' },
]

export default function Stepper() {
  const { state, goTo } = useWorkflow()
  const current = state.currentStep

  return (
    <nav className="w-full py-3">
      <ol className="flex items-center w-full">
        {STEPS.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li
              key={i}
              className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <button
                onClick={() => done && goTo(i)}
                disabled={!done}
                className="flex flex-col items-center gap-1 group"
              >
                <span
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                    ${done ? 'bg-gradient-to-b from-violet-400 to-violet-600 border-violet-500 text-white cursor-pointer shadow-md shadow-violet-900/40 group-hover:from-violet-300 group-hover:to-violet-500' : ''}
                    ${active ? 'bg-[#1a1625] border-violet-400 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.5)] ring-3 ring-violet-400/10' : ''}
                    ${!done && !active ? 'bg-white/[0.04] border-white/[0.10] text-gray-600' : ''}
                  `}
                >
                  {done ? <Check size={14} /> : i + 1}
                </span>
                <span
                  className={`text-[10px] font-medium whitespace-nowrap
                    ${active ? 'text-violet-400' : done ? 'text-violet-500/60' : 'text-gray-700'}
                  `}
                >
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 rounded-full transition-all ${
                  i < current
                    ? 'bg-gradient-to-r from-violet-500 to-violet-400'
                    : i === current - 1
                    ? 'bg-gradient-to-r from-violet-500/40 to-white/[0.06]'
                    : 'bg-white/[0.06]'
                }`} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
