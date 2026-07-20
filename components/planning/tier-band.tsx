'use client'

import { useState } from 'react'
import { TIERS, tierForScore } from '@/lib/planning'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const TIER_COLOR: Record<string, string> = {
  A: 'bg-brand-green',
  B: 'bg-brand-teal',
  C: 'bg-sage',
}

const TIER_TEXT: Record<string, string> = {
  A: 'text-ink',
  B: 'text-white',
  C: 'text-white',
}

export function TierBand() {
  const [score, setScore] = useState(74)
  const tier = tierForScore(score)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Eyebrow tone="teal">Drag the sample score</Eyebrow>
        <span className="text-sm text-sage-2">
          Tier + touch cadence update live
        </span>
      </div>

      {/* Band visual: C (0–59), B (60–89), A (90–100) */}
      <div className="relative">
        <div className="flex h-12 w-full overflow-hidden rounded-lg">
          <BandSegment tier="C" widthPct={60} label="C · < 60" />
          <BandSegment tier="B" widthPct={30} label="B · 60–89" />
          <BandSegment tier="A" widthPct={10} label="A · 90+" />
        </div>
        {/* Marker */}
        <div
          className="pointer-events-none absolute -top-1.5 flex -translate-x-1/2 flex-col items-center transition-[left] duration-150"
          style={{ left: `${score}%` }}
          aria-hidden
        >
          <span className="rounded-md bg-ink px-1.5 py-0.5 text-xs font-bold tabular-nums text-brand-green">
            {score}
          </span>
          <span className="h-14 w-0.5 bg-ink" />
        </div>
      </div>

      <Slider
        value={score}
        onValueChange={(v) => setScore(Array.isArray(v) ? v[0] : v)}
        min={0}
        max={100}
        step={1}
        aria-label="Sample account score"
      />

      {/* Result + tier table */}
      <div className="grid gap-3 sm:grid-cols-3">
        {TIERS.map((t) => {
          const active = t.tier === tier.tier
          return (
            <div
              key={t.tier}
              className={cn(
                'flex flex-col gap-1 rounded-xl border p-3.5 transition-colors',
                active
                  ? 'border-ink bg-surface shadow-sm'
                  : 'border-border/70 bg-muted/40',
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-md text-sm font-bold',
                    TIER_COLOR[t.tier],
                    TIER_TEXT[t.tier],
                  )}
                >
                  {t.tier}
                </span>
                <span className="font-mono text-xs text-sage-2">{t.range}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-ink">{t.definition}</p>
              <p className="text-xs leading-relaxed text-sage-2">
                Touch: {t.cadence}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BandSegment({
  tier,
  widthPct,
  label,
}: {
  tier: string
  widthPct: number
  label: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center text-xs font-semibold',
        TIER_COLOR[tier],
        TIER_TEXT[tier],
      )}
      style={{ width: `${widthPct}%` }}
    >
      <span className="truncate px-1">{label}</span>
    </div>
  )
}
