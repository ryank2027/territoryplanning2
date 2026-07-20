import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type KpiTrend = 'up' | 'down' | 'flat'

/** Compact KPI stat card for dashboards and hero counters. */
export function KpiCard({
  label,
  value,
  unit,
  delta,
  trend = 'flat',
  icon: Icon,
  hint,
  className,
}: {
  label: string
  value: string | number
  unit?: string
  delta?: string
  trend?: KpiTrend
  icon?: LucideIcon
  hint?: string
  className?: string
}) {
  return (
    <Card
      className={cn(
        'gap-3 border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(20,32,26,0.04),0_10px_28px_rgba(20,32,26,0.04)] transition-transform duration-200 hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-sage-2">
          {label}
        </span>
        {Icon && <Icon className="size-4 text-sage-2" aria-hidden />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight text-ink">{value}</span>
        {unit && <span className="text-sm font-medium text-sage-2">{unit}</span>}
      </div>
      {(delta || hint) && (
        <div className="flex items-center gap-2 text-xs">
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold',
                trend === 'up' && 'text-brand-teal',
                trend === 'down' && 'text-destructive',
                trend === 'flat' && 'text-sage-2',
              )}
            >
              {trend === 'up' && <ArrowUpRight className="size-3.5" aria-hidden />}
              {trend === 'down' && <ArrowDownRight className="size-3.5" aria-hidden />}
              {delta}
            </span>
          )}
          {hint && <span className="text-sage-2">{hint}</span>}
        </div>
      )}
    </Card>
  )
}
