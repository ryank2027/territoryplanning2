import { cn } from '@/lib/utils'

/** Labeled horizontal meter: a value out of a max, with an optional target band. */
export function StatMeter({
  label,
  value,
  max = 100,
  displayValue,
  tone = 'green',
  className,
}: {
  label: string
  value: number
  max?: number
  displayValue?: string
  tone?: 'green' | 'teal' | 'purple' | 'lime' | 'sage'
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const barColor = {
    green: 'bg-brand-green',
    teal: 'bg-brand-teal',
    purple: 'bg-brand-purple',
    lime: 'bg-brand-lime',
    sage: 'bg-sage-2',
  }[tone]

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink-2">{label}</span>
        <span className="font-semibold text-ink">{displayValue ?? value}</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-300', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
