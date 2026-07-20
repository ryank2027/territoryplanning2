import { ChevronRight } from 'lucide-react'
import { CHANGE_CONTROL_STEPS } from '@/lib/monitoring'

/**
 * The governed change-control window: a left-to-right flow every structural
 * change passes through, so refinements are deliberate and auditable rather
 * than ad hoc.
 */
export function ChangeControlFlow() {
  return (
    <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
      {CHANGE_CONTROL_STEPS.map((step, i) => (
        <li
          key={step.id}
          className="flex flex-col items-stretch gap-2 lg:flex-1 lg:flex-row"
        >
          <div className="flex flex-1 flex-col gap-2 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
            <span className="flex size-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-brand-green">
              {i + 1}
            </span>
            <span className="text-sm font-bold text-ink">{step.label}</span>
            <span className="text-xs leading-relaxed text-sage-2">
              {step.detail}
            </span>
          </div>
          {i < CHANGE_CONTROL_STEPS.length - 1 && (
            <span className="flex items-center justify-center self-center text-sage-2/60">
              <ChevronRight className="size-4 rotate-90 lg:rotate-0" aria-hidden />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
