import { ArrowDown } from 'lucide-react'
import { COVERAGE_MODEL } from '@/lib/planning'

/** Four-step "rule gates" flow: score → size → match → guard. */
export function CoverageFlow() {
  return (
    <ol className="flex flex-col gap-2">
      {COVERAGE_MODEL.map((s, i) => (
        <li key={s.step} className="flex flex-col gap-2">
          <div className="flex gap-3 rounded-xl border border-border/70 bg-surface p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-bold text-brand-green">
              {s.step}
            </span>
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-sm font-bold text-ink">{s.title}</p>
              <p className="rounded-md bg-ink px-3 py-1.5 font-mono text-xs leading-relaxed text-brand-green">
                {s.formula}
              </p>
              <p className="text-sm leading-relaxed text-ink-2">{s.outcome}</p>
            </div>
          </div>
          {i < COVERAGE_MODEL.length - 1 && (
            <div className="flex justify-center" aria-hidden>
              <ArrowDown className="size-4 text-sage-2" />
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
