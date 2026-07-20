'use client'

import { useMemo, useState } from 'react'

// Deterministic set of rep workload indices, expressed as a ratio to the
// segment average (1.00 = perfectly average). Illustrative fixture.
const REP_INDICES = [
  0.82, 0.86, 0.88, 0.9, 0.91, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1.0,
  1.0, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.08, 1.11, 1.14, 1.19,
]

const LOW = 0.9
const HIGH = 1.1
const MIN = 0.78
const MAX = 1.22

type Status = 'under' | 'in' | 'over'

function statusFor(v: number): Status {
  if (v < LOW) return 'under'
  if (v > HIGH) return 'over'
  return 'in'
}

const STATUS_META: Record<Status, { label: string; dot: string; text: string }> =
  {
    under: {
      label: 'Under-loaded',
      dot: 'bg-sage-2',
      text: 'text-sage-2',
    },
    in: {
      label: 'In band (±10%)',
      dot: 'bg-brand-teal',
      text: 'text-brand-teal',
    },
    over: {
      label: 'Over-loaded',
      dot: 'bg-destructive',
      text: 'text-destructive',
    },
  }

function pct(v: number) {
  return ((v - MIN) / (MAX - MIN)) * 100
}

/**
 * Interactive workload-balance strip: every rep is a marker positioned by
 * their Workload Index relative to the segment average, with the ±10% target
 * band highlighted. Toggle a status to isolate that group.
 */
export function WorkloadBalance() {
  const [focus, setFocus] = useState<Status | 'all'>('all')

  const counts = useMemo(() => {
    return REP_INDICES.reduce(
      (acc, v) => {
        acc[statusFor(v)] += 1
        return acc
      },
      { under: 0, in: 0, over: 0 } as Record<Status, number>,
    )
  }, [])

  const total = REP_INDICES.length
  const bandLeft = pct(LOW)
  const bandWidth = pct(HIGH) - pct(LOW)

  return (
    <div className="flex flex-col gap-5">
      {/* Legend / filter toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFocus('all')}
          aria-pressed={focus === 'all'}
          className={
            'rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
            (focus === 'all'
              ? 'border-transparent bg-ink text-brand-green'
              : 'border-border/70 bg-surface text-sage-2 hover:text-ink')
          }
        >
          All reps · {total}
        </button>
        {(['in', 'over', 'under'] as Status[]).map((s) => {
          const meta = STATUS_META[s]
          const active = focus === s
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFocus(active ? 'all' : s)}
              aria-pressed={active}
              className={
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ' +
                (active
                  ? 'border-ink bg-ink text-surface'
                  : 'border-border/70 bg-surface text-ink-2 hover:text-ink')
              }
            >
              <span className={'size-2 rounded-full ' + meta.dot} aria-hidden />
              {meta.label} · {counts[s]}
            </button>
          )
        })}
      </div>

      {/* Distribution strip */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="relative h-24">
          {/* Target band */}
          <div
            className="absolute inset-y-6 rounded-lg border border-brand-teal/40 bg-brand-teal/10"
            style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
            aria-hidden
          />
          {/* Center (segment average) line */}
          <div
            className="absolute inset-y-4 w-px bg-ink/40"
            style={{ left: `${pct(1.0)}%` }}
            aria-hidden
          />
          {/* Rep markers */}
          {REP_INDICES.map((v, i) => {
            const s = statusFor(v)
            const dimmed = focus !== 'all' && focus !== s
            const meta = STATUS_META[s]
            return (
              <span
                key={i}
                title={`Rep ${i + 1} · index ${v.toFixed(2)}× · ${meta.label}`}
                className={
                  'absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card transition-opacity ' +
                  meta.dot +
                  (dimmed ? ' opacity-15' : ' opacity-100')
                }
                style={{ left: `${pct(v)}%` }}
              />
            )
          })}
        </div>
        {/* Axis labels */}
        <div className="mt-1 flex justify-between text-[11px] font-medium text-sage-2">
          <span>Lighter books</span>
          <span>Segment average · ±10% band</span>
          <span>Heavier books</span>
        </div>
      </div>
    </div>
  )
}
