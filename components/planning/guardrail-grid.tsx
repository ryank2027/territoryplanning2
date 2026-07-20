import { ShieldCheck } from 'lucide-react'
import type { Guardrail } from '@/lib/planning'
import { cn } from '@/lib/utils'

/** Grid of guardrail cards (segmentation design, quota governance, etc.). */
export function GuardrailGrid({
  items,
  columns = 2,
  className,
}: {
  items: Guardrail[]
  columns?: 2 | 3
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2',
        className,
      )}
    >
      {items.map((g) => (
        <div
          key={g.title}
          className="flex flex-col gap-2 rounded-xl border border-border/70 bg-surface p-4"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-ink text-brand-green">
            <ShieldCheck className="size-4" aria-hidden />
          </span>
          <p className="text-sm font-bold text-ink">{g.title}</p>
          <p className="text-sm leading-relaxed text-ink-2">{g.body}</p>
        </div>
      ))}
    </div>
  )
}
