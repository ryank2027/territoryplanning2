import type { WeightedComponent } from '@/lib/planning'
import { cn } from '@/lib/utils'

/** Dark formula plate with the equation, plus an optional weighted-component breakdown. */
export function FormulaBlock({
  formula,
  components,
  note,
  className,
}: {
  formula: string
  components?: WeightedComponent[]
  note?: string
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="rounded-xl border border-border/70 bg-ink p-4">
        <p className="text-center font-mono text-sm leading-relaxed text-brand-green">
          {formula}
        </p>
      </div>

      {components && (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {components.map((c) => (
            <li
              key={c.label}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface p-3"
            >
              <span className="flex min-w-11 shrink-0 items-center justify-center rounded-md bg-brand-teal/10 px-2 py-1 font-mono text-sm font-bold text-brand-teal">
                {Math.round(c.weight * 100)}%
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-ink">{c.label}</span>
                <span className="block text-xs leading-relaxed text-sage-2">
                  {c.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {note && <p className="text-sm leading-relaxed text-ink-2">{note}</p>}
    </div>
  )
}
