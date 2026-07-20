'use client'

import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { KPI_DOMAINS, type KpiMetric } from '@/lib/monitoring'
import { SegmentedControl } from '@/components/planning/segmented-control'
import { Sparkline } from './sparkline'
import { cn } from '@/lib/utils'

const TONE_TEXT = {
  green: 'text-brand-green',
  teal: 'text-brand-teal',
  lime: 'text-brand-lime',
  purple: 'text-brand-purple',
  sage: 'text-sage-2',
} as const

const HEADLINE_BG = {
  green: 'bg-brand-green/10 border-brand-green/30',
  teal: 'bg-brand-teal/5 border-brand-teal/30',
  lime: 'bg-brand-lime/10 border-brand-lime/40',
  purple: 'bg-brand-purple/5 border-brand-purple/30',
  sage: 'bg-muted border-border/70',
} as const

/** True when the metric's movement is a good thing given its polarity. */
function isFavorable(metric: KpiMetric): boolean | null {
  if (metric.trend === 'flat') return null
  return metric.polarity === 'positive'
    ? metric.trend === 'up'
    : metric.trend === 'down'
}

function DeltaBadge({ metric }: { metric: KpiMetric }) {
  const favorable = isFavorable(metric)
  const Icon =
    metric.trend === 'up'
      ? ArrowUpRight
      : metric.trend === 'down'
        ? ArrowDownRight
        : Minus
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-semibold',
        favorable === true && 'text-brand-teal',
        favorable === false && 'text-destructive',
        favorable === null && 'text-sage-2',
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {metric.delta}
    </span>
  )
}

/** Interactive KPI dashboard: switch domains to see live-style metric cards. */
export function KpiDashboard() {
  const [domainId, setDomainId] = useState(KPI_DOMAINS[0].id)
  const domain = KPI_DOMAINS.find((d) => d.id === domainId) ?? KPI_DOMAINS[0]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <SegmentedControl
          ariaLabel="Choose a dashboard domain"
          options={KPI_DOMAINS.map((d) => ({ value: d.id, label: d.label }))}
          value={domainId}
          onChange={setDomainId}
        />
        <p className="text-sm text-sage-2">{domain.tagline}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Headline panel */}
        <div
          className={cn(
            'flex flex-col justify-between gap-4 rounded-xl border p-5',
            HEADLINE_BG[domain.tone],
          )}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-2">
            {domain.label} health
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-bold tracking-tight text-ink">
              {domain.headline.value}
            </span>
            {domain.headline.unit && (
              <span className={cn('text-sm font-semibold', TONE_TEXT[domain.tone])}>
                {domain.headline.unit}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-ink-2">
            {domain.headline.caption}
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {domain.metrics.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-ink-2">
                  {metric.label}
                </span>
                <DeltaBadge metric={metric} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-ink">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm font-medium text-sage-2">
                    {metric.unit}
                  </span>
                )}
              </div>
              <Sparkline series={metric.series} tone={domain.tone} />
              <p className="text-xs leading-relaxed text-sage-2">
                {metric.target}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
