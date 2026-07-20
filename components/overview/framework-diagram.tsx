'use client'

import Link from 'next/link'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { FOCUS_AREAS, type FocusArea } from '@/lib/recommendations'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const FOCUS_HREF: Record<string, string> = {
  prerequisites: '/prerequisites',
  planning: '/planning/segmentation',
  monitoring: '/monitoring/kpis',
}

function RecommendationRow({
  href,
  ordinal,
  label,
  blurb,
}: {
  href: string
  ordinal?: string
  label: string
  blurb: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={href}
            className="group flex items-start gap-2 rounded-lg border border-border/70 bg-card px-3 py-2.5 text-left outline-none transition-colors hover:border-brand-green hover:bg-brand-green/5 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ordinal && (
              <span className="mt-0.5 font-mono text-xs font-bold text-brand-teal">
                {ordinal}
              </span>
            )}
            <span className="flex-1 text-sm font-semibold leading-tight text-ink">
              {label}
            </span>
            <ArrowRight className="mt-0.5 size-4 shrink-0 text-sage-2 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
          </Link>
        }
      />
      <TooltipContent className="max-w-xs">{blurb}</TooltipContent>
    </Tooltip>
  )
}

function FocusColumn({ area, step }: { area: FocusArea; step: number }) {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-border/70 bg-surface-tint/60 p-4">
      <Link
        href={FOCUS_HREF[area.id]}
        className="mb-3 flex flex-col gap-1 rounded-lg px-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-ink text-xs font-bold text-brand-green">
            {step}
          </span>
          <span className="text-base font-bold text-ink">{area.title}</span>
        </span>
        <span className="text-xs text-sage-2">{area.subtitle}</span>
      </Link>
      <div className="flex flex-col gap-2">
        {area.recommendations.map((rec) => (
          <RecommendationRow
            key={rec.id}
            href={rec.href}
            ordinal={rec.ordinal}
            label={rec.label}
            blurb={rec.blurb}
          />
        ))}
      </div>
    </div>
  )
}

function ColumnConnector() {
  return (
    <div className="flex shrink-0 items-center justify-center py-2 lg:py-0" aria-hidden>
      <span className="flex size-8 rotate-90 items-center justify-center rounded-full border border-border bg-card text-brand-teal shadow-sm lg:rotate-0">
        <ArrowRight className="size-4" />
      </span>
    </div>
  )
}

export function FrameworkDiagram() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-stretch gap-1 lg:flex-row lg:items-stretch">
        {FOCUS_AREAS.map((area, i) => (
          <div key={area.id} className="contents">
            <FocusColumn area={area} step={i + 1} />
            {i < FOCUS_AREAS.length - 1 && <ColumnConnector />}
          </div>
        ))}
      </div>

      {/* Feedback loop back from Monitoring to Prerequisites / Planning */}
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-brand-purple/40 bg-brand-purple/5 px-4 py-2.5">
        <RotateCcw className="size-4 shrink-0 text-brand-purple" aria-hidden />
        <p className="text-xs leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">Feedback loop.</span> Monitoring
          feeds insight back into Prerequisites and Planning. Strategy stays agile as
          conditions change, rather than being rebuilt from scratch.
        </p>
      </div>
    </div>
  )
}
