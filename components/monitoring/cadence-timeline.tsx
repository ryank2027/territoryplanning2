'use client'

import { useState } from 'react'
import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  HelpCircle,
  Lock,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react'
import { CADENCE_TIERS, type VizTone } from '@/lib/monitoring'
import { cn } from '@/lib/utils'

const TIER_ICON: Record<string, LucideIcon> = {
  weekly: CalendarClock,
  monthly: CalendarDays,
  quarterly: CalendarRange,
  annual: CalendarRange,
}

const TONE_ACTIVE: Record<VizTone, string> = {
  green: 'border-brand-green bg-brand-green/10',
  teal: 'border-brand-teal bg-brand-teal/5',
  lime: 'border-brand-lime bg-brand-lime/10',
  purple: 'border-brand-purple bg-brand-purple/5',
  sage: 'border-sage bg-muted',
}

const TONE_DOT: Record<VizTone, string> = {
  green: 'bg-brand-green',
  teal: 'bg-brand-teal',
  lime: 'bg-brand-lime',
  purple: 'bg-brand-purple',
  sage: 'bg-sage-2',
}

const TONE_TEXT: Record<VizTone, string> = {
  green: 'text-brand-green',
  teal: 'text-brand-teal',
  lime: 'text-ink',
  purple: 'text-brand-purple',
  sage: 'text-sage-2',
}

/**
 * Interactive cadence timeline. Selecting a tier reveals what it reviews, the
 * changes it may make, and how those changes are governed — reinforcing that
 * decision frequency should match how fast each thing actually changes.
 */
export function CadenceTimeline() {
  const [activeId, setActiveId] = useState(CADENCE_TIERS[0].id)
  const active =
    CADENCE_TIERS.find((t) => t.id === activeId) ?? CADENCE_TIERS[0]
  const activeIndex = CADENCE_TIERS.findIndex((t) => t.id === activeId)

  return (
    <div className="flex flex-col gap-5">
      {/* Timeline selector */}
      <ol className="grid gap-3 sm:grid-cols-4">
        {CADENCE_TIERS.map((tier, i) => {
          const Icon = TIER_ICON[tier.id] ?? CalendarDays
          const isActive = tier.id === activeId
          return (
            <li key={tier.id} className="flex">
              <button
                type="button"
                onClick={() => setActiveId(tier.id)}
                aria-current={isActive}
                className={cn(
                  'flex w-full flex-col gap-2 rounded-xl border p-4 text-left transition-colors',
                  isActive
                    ? TONE_ACTIVE[tier.tone]
                    : 'border-border/70 bg-card hover:border-border',
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg',
                      isActive ? 'bg-ink text-brand-green' : 'bg-muted text-sage-2',
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-sage-2">
                    {`0${i + 1}`}
                  </span>
                </div>
                <span className="text-sm font-bold text-ink">{tier.cadence}</span>
                <span className="text-xs leading-relaxed text-sage-2">
                  {tier.horizon} · {tier.owner}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Cadence progression bar */}
      <div className="flex items-center gap-2" aria-hidden>
        {CADENCE_TIERS.map((tier, i) => (
          <div
            key={tier.id}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i <= activeIndex ? TONE_DOT[active.tone] : 'bg-muted',
            )}
          />
        ))}
      </div>

      {/* Detail panel */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex items-start gap-3 border-b border-border/60 pb-4">
          <HelpCircle
            className={cn('mt-0.5 size-5 shrink-0', TONE_TEXT[active.tone])}
            aria-hidden
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-2">
              {active.cadence} review · {active.owner}
            </span>
            <p className="text-base font-semibold text-ink">{active.question}</p>
          </div>
        </div>

        <div className="grid gap-6 pt-4 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-2">
              What gets reviewed
            </span>
            <ul className="flex flex-col gap-2">
              {active.reviews.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink-2">
                  <span
                    className={cn(
                      'mt-1.5 size-1.5 shrink-0 rounded-full',
                      TONE_DOT[active.tone],
                    )}
                    aria-hidden
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-2">
              Changes allowed
            </span>
            <ul className="flex flex-col gap-2">
              {active.changes.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-ink-2">
                  <SlidersHorizontal
                    className="mt-0.5 size-3.5 shrink-0 text-brand-teal"
                    aria-hidden
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg bg-muted/60 p-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-sage-2" aria-hidden />
          <p className="text-xs leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">Change control:</span>{' '}
            {active.control}
          </p>
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-sage-2">
        <CheckCircle2 className="size-3.5 text-brand-teal" aria-hidden />
        Faster cadences make small, reversible moves; slower cadences make big,
        governed ones. Match the decision to how fast the thing changes.
      </p>
    </div>
  )
}
