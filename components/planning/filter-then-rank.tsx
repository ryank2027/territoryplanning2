'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  RotateCcw,
  Trophy,
  X,
} from 'lucide-react'
import {
  CAPACITY_CEILING,
  REP_CANDIDATES,
  SAMPLE_ASSIGNMENT,
  SEGMENT_AVG_INDEX,
} from '@/lib/planning'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STEPS = [
  {
    title: 'Score the account',
    blurb: `${SAMPLE_ASSIGNMENT.account} contributes +${SAMPLE_ASSIGNMENT.contribution} to a rep's Workload Index, scored from the same four weighted components.`,
  },
  {
    title: 'Filter by Workload Index',
    blurb: `A rep is eligible only if adding this account keeps them at or below ${CAPACITY_CEILING}% of the segment average. Reps at the ceiling drop out.`,
  },
  {
    title: 'Rank by Rep Skill Score',
    blurb:
      'Among reps who pass the capacity gate, assign to the highest Rep Skill Score. Mandatory ranking for Tier A / high-growth.',
  },
  {
    title: 'Assign & update',
    blurb:
      "The account is added to the winning rep's book, their Workload Index updates, and the process repeats for the next account.",
  },
]

export function FilterThenRank() {
  const [step, setStep] = useState(0)
  const { contribution } = SAMPLE_ASSIGNMENT

  const rows = useMemo(
    () =>
      REP_CANDIDATES.map((r) => {
        const projected = r.workloadIndex + contribution
        const eligible = projected <= CAPACITY_CEILING
        return { ...r, projected, eligible }
      }),
    [contribution],
  )

  const winner = useMemo(() => {
    const eligible = rows.filter((r) => r.eligible)
    return eligible.sort((a, b) => b.skillScore - a.skillScore)[0]
  }, [rows])

  const showFilter = step >= 1
  const showRank = step >= 2
  const showAssign = step >= 3

  return (
    <div className="flex flex-col gap-5">
      {/* Stepper header */}
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
        {STEPS.map((s, i) => {
          const active = i === step
          const done = i < step
          return (
            <li key={s.title} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  'flex flex-1 items-center gap-2.5 rounded-xl border p-3 text-left transition-colors',
                  active
                    ? 'border-ink bg-surface shadow-sm'
                    : 'border-border/70 bg-muted/40 hover:bg-surface',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                    active || done
                      ? 'bg-ink text-brand-green'
                      : 'bg-muted text-sage-2',
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    active ? 'text-ink' : 'text-sage-2',
                  )}
                >
                  {s.title}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  className="hidden size-4 shrink-0 text-sage-2 sm:block"
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Current step blurb */}
      <div className="rounded-xl border border-brand-teal/25 bg-brand-teal/5 p-4">
        <Eyebrow tone="teal">
          Step {step + 1}: {STEPS[step].title}
        </Eyebrow>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          {STEPS[step].blurb}
        </p>
      </div>

      {/* Rep candidate rows */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <Eyebrow tone="sage">Rep candidates</Eyebrow>
          <span className="text-xs text-sage-2">
            Segment avg {SEGMENT_AVG_INDEX} · ceiling {CAPACITY_CEILING}
          </span>
        </div>
        {rows.map((r) => {
          const droppedOut = showFilter && !r.eligible
          const isWinner = showRank && winner?.id === r.id
          return (
            <div
              key={r.id}
              className={cn(
                'flex flex-col gap-3 rounded-xl border p-3.5 transition-all sm:flex-row sm:items-center',
                droppedOut && 'border-dashed border-border/60 opacity-45',
                isWinner
                  ? 'border-brand-green bg-brand-green/10'
                  : 'border-border/70 bg-surface',
              )}
            >
              {/* Name + status */}
              <div className="flex min-w-40 items-center gap-2">
                <span className="text-sm font-bold text-ink">{r.name}</span>
                {showFilter &&
                  (r.eligible ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-teal/15 px-2 py-0.5 text-[11px] font-semibold text-brand-teal">
                      <Check className="size-3" aria-hidden />
                      Eligible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-sage-2">
                      <X className="size-3" aria-hidden />
                      At ceiling
                    </span>
                  ))}
                {isWinner && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-green px-2 py-0.5 text-[11px] font-bold text-ink">
                    <Trophy className="size-3" aria-hidden />
                    Assigned
                  </span>
                )}
              </div>

              {/* Workload index bar */}
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-sage-2">Workload Index</span>
                  <span className="font-semibold tabular-nums text-ink">
                    {r.workloadIndex}
                    {showFilter && (
                      <span
                        className={cn(
                          'ml-1',
                          r.eligible ? 'text-brand-teal' : 'text-warn',
                        )}
                      >
                        → {showAssign && isWinner ? r.projected : r.projected}
                      </span>
                    )}
                  </span>
                </div>
                <WorkloadBar
                  base={r.workloadIndex}
                  contribution={showFilter ? contribution : 0}
                  eligible={r.eligible}
                />
              </div>

              {/* Skill score */}
              <div
                className={cn(
                  'flex min-w-24 items-center justify-between gap-2 rounded-lg px-3 py-1.5 transition-colors sm:flex-col sm:items-end sm:gap-0',
                  showRank && r.eligible ? 'bg-muted' : 'bg-transparent',
                )}
              >
                <span className="text-[11px] text-sage-2">Skill</span>
                <span
                  className={cn(
                    'text-lg font-bold tabular-nums',
                    showRank && r.eligible ? 'text-ink' : 'text-sage-2',
                  )}
                >
                  {r.skillScore}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep(0)}
          className="gap-1.5"
          disabled={step === 0}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Restart
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            size="sm"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step === STEPS.length - 1}
          >
            Next step
          </Button>
        </div>
      </div>

      {showAssign && (
        <InsightPanel title="Why two formulas, applied in sequence" tone="teal">
          The Workload Index decides who has room; the Rep Skill Score decides
          who, among those with room, is the best fit. Note {winner?.name} won
          over higher-skilled reps who were already at their capacity ceiling.
          Neither formula is modified to include the other.
        </InsightPanel>
      )}
    </div>
  )
}

function WorkloadBar({
  base,
  contribution,
  eligible,
}: {
  base: number
  contribution: number
  eligible: boolean
}) {
  const scaleMax = 130 // headroom above the 110 ceiling
  const basePct = (base / scaleMax) * 100
  const addPct = (contribution / scaleMax) * 100
  const ceilingPct = (CAPACITY_CEILING / scaleMax) * 100

  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="absolute inset-y-0 left-0 rounded-l-full bg-sage-2"
        style={{ width: `${basePct}%` }}
      />
      {contribution > 0 && (
        <div
          className={cn(
            'absolute inset-y-0',
            eligible ? 'bg-brand-teal' : 'bg-warn',
          )}
          style={{ left: `${basePct}%`, width: `${addPct}%` }}
        />
      )}
      {/* Ceiling marker */}
      <div
        className="absolute inset-y-0 w-0.5 bg-ink"
        style={{ left: `${ceilingPct}%` }}
        aria-hidden
      />
    </div>
  )
}
