'use client'

import { useMemo, useState } from 'react'
import {
  ICP_FACTORS,
  POTENTIAL_FACTORS,
  SAMPLE_ACCOUNTS,
  tierForScore,
} from '@/lib/planning'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { Slider } from '@/components/ui/slider'
import { SegmentedControl } from './segmented-control'
import { cn } from '@/lib/utils'

const TIER_STYLES: Record<string, string> = {
  A: 'bg-brand-green text-ink',
  B: 'bg-brand-teal text-white',
  C: 'bg-sage-2 text-white',
}

export function ScoreBuilder() {
  const [icpWeight, setIcpWeight] = useState(50)
  const [accountId, setAccountId] = useState(SAMPLE_ACCOUNTS[0].id)
  const potentialWeight = 100 - icpWeight

  const account = SAMPLE_ACCOUNTS.find((a) => a.id === accountId)!

  const score = useMemo(
    () =>
      Math.round(
        (icpWeight / 100) * account.icpFitment +
          (potentialWeight / 100) * account.potential,
      ),
    [icpWeight, potentialWeight, account],
  )
  const tier = tierForScore(score)

  return (
    <div className="flex flex-col gap-5">
      {/* Formula */}
      <div className="rounded-xl border border-border/70 bg-ink p-4 text-center">
        <p className="font-mono text-sm text-brand-green sm:text-base">
          Account Score = ({(icpWeight / 100).toFixed(2)} × ICP Fitment) + (
          {(potentialWeight / 100).toFixed(2)} × Potential)
        </p>
      </div>

      {/* Account selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Eyebrow tone="sage">Sample account</Eyebrow>
        <SegmentedControl
          ariaLabel="Choose a sample account"
          size="sm"
          options={SAMPLE_ACCOUNTS.map((a) => ({ value: a.id, label: a.name }))}
          value={accountId}
          onChange={setAccountId}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
        {/* Sliders + factors */}
        <div className="flex flex-col gap-5">
          <WeightSlider
            label="ICP Fitment weight"
            tone="teal"
            weight={icpWeight}
            indexValue={account.icpFitment}
            factors={ICP_FACTORS.map((f) => f.label)}
            onChange={(v) => setIcpWeight(v)}
          />
          <WeightSlider
            label="Potential weight"
            tone="green"
            weight={potentialWeight}
            indexValue={account.potential}
            factors={POTENTIAL_FACTORS.map((f) => f.label)}
            onChange={(v) => setIcpWeight(100 - v)}
          />
        </div>

        {/* Live score readout */}
        <div className="flex min-w-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-border/70 bg-surface p-5">
          <Eyebrow tone="sage">{account.name}</Eyebrow>
          <span className="text-5xl font-bold tabular-nums tracking-tight text-ink">
            {score}
          </span>
          <span className="text-xs text-sage-2">Account Score (0–100)</span>
          <span
            className={cn(
              'mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold',
              TIER_STYLES[tier.tier],
            )}
          >
            Tier {tier.tier}
          </span>
          <span className="text-center text-xs text-sage-2">
            {tier.definition} · {tier.cadence}
          </span>
        </div>
      </div>
    </div>
  )
}

function WeightSlider({
  label,
  tone,
  weight,
  indexValue,
  factors,
  onChange,
}: {
  label: string
  tone: 'teal' | 'green'
  weight: number
  indexValue: number
  factors: string[]
  onChange: (v: number) => void
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'size-2.5 rounded-full',
              tone === 'teal' ? 'bg-brand-teal' : 'bg-brand-green',
            )}
            aria-hidden
          />
          <span className="text-sm font-bold text-ink">{label}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-xs text-sage-2">
            index {indexValue}
          </span>
          <span className="text-lg font-bold tabular-nums text-ink">{weight}%</span>
        </div>
      </div>
      <Slider
        value={weight}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
        min={0}
        max={100}
        step={5}
        aria-label={label}
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {factors.map((f) => (
          <span
            key={f}
            className="rounded-md bg-muted px-2 py-0.5 text-xs text-sage-2"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
