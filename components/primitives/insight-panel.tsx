import { Lightbulb, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type InsightTone = 'teal' | 'green' | 'purple' | 'amber'

const TONE_STYLES: Record<InsightTone, string> = {
  teal: 'border-brand-teal/30 bg-brand-teal/5',
  green: 'border-brand-green/40 bg-brand-green/10',
  purple: 'border-brand-purple/30 bg-brand-purple/5',
  amber: 'border-warn/40 bg-warn/10',
}

const ICON_STYLES: Record<InsightTone, string> = {
  teal: 'text-brand-teal',
  green: 'text-ink',
  purple: 'text-brand-purple',
  amber: 'text-warn',
}

/** Callout / insight panel used for takeaways, guardrails, and "why" notes. */
export function InsightPanel({
  title,
  icon: Icon = Lightbulb,
  tone = 'teal',
  children,
  className,
}: {
  title?: string
  icon?: LucideIcon
  tone?: InsightTone
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 shadow-[0_1px_2px_rgba(20,32,26,0.03)] sm:p-5',
        TONE_STYLES[tone],
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface/80 shadow-sm',
            ICON_STYLES[tone],
          )}
        >
          <Icon className="size-4.5" aria-hidden />
        </span>
        <div className="flex min-w-0 flex-col gap-1.5">
          {title && <p className="font-bold leading-snug text-ink">{title}</p>}
          <div className="text-sm leading-relaxed text-ink-2">{children}</div>
        </div>
      </div>
    </div>
  )
}
