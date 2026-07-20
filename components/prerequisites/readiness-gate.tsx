'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, Circle, Flag, RotateCcw } from 'lucide-react'
import {
  useWorkspace,
  type PrereqKey,
} from '@/components/workspace/workspace-provider'
import { FOUNDATIONS } from '@/lib/prerequisites'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function ReadinessGate() {
  const { readiness, setReadiness } = useWorkspace()

  const documentedCount = FOUNDATIONS.filter((f) => readiness[f.key]).length
  const total = FOUNDATIONS.length
  const allReady = documentedCount === total
  const missing = FOUNDATIONS.filter((f) => !readiness[f.key])

  return (
    <div className="flex flex-col gap-6">
      {/* Progress summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-0.5">
          <Eyebrow tone="sage">Documented</Eyebrow>
          <p className="text-2xl font-bold text-ink">
            {documentedCount}
            <span className="text-base font-semibold text-sage-2"> / {total}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden>
          {FOUNDATIONS.map((f) => (
            <span
              key={f.key}
              className={cn(
                'h-2 w-10 rounded-full transition-colors',
                readiness[f.key] ? 'bg-brand-green' : 'bg-border',
              )}
            />
          ))}
        </div>
      </div>

      {/* Four toggles */}
      <div className="grid gap-4 sm:grid-cols-2">
        {FOUNDATIONS.map((f) => (
          <GateToggle
            key={f.key}
            item={f}
            documented={readiness[f.key]}
            onToggle={(v) => setReadiness(f.key, v)}
          />
        ))}
      </div>

      {/* Result state */}
      {allReady ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-green/40 bg-brand-green/10 p-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-green text-ink">
            <CheckCircle2 className="size-7" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-ink">Ready for territory planning</p>
            <p className="max-w-md text-sm leading-relaxed text-ink-2">
              All four prerequisites are documented. The business foundation is set,
              so segmentation and boundary decisions can be made objectively.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/planning/segmentation" />}>
            Start Segmentation Strategy
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-warn/40 bg-warn/10 p-8 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-warn/20 text-warn">
            <Flag className="size-7" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-ink">
              Flag to RevOps: remediate before planning
            </p>
            <p className="max-w-md text-sm leading-relaxed text-ink-2">
              Territory planning is gated until every prerequisite is documented.
              Still outstanding:
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-2">
            {missing.map((f) => (
              <li
                key={f.key}
                className="rounded-full border border-warn/40 bg-card px-3 py-1 text-sm font-semibold text-ink"
              >
                {f.short}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="ghost"
          onClick={() => FOUNDATIONS.forEach((f) => setReadiness(f.key, false))}
        >
          <RotateCcw data-icon="inline-start" />
          Reset gate
        </Button>
      </div>
    </div>
  )
}

function GateToggle({
  item,
  documented,
  onToggle,
}: {
  item: (typeof FOUNDATIONS)[number]
  documented: boolean
  onToggle: (value: boolean) => void
}) {
  const inputId = `gate-${item.key}`
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors',
        documented
          ? 'border-brand-green/40 bg-brand-green/5'
          : 'border-border/70 bg-card',
      )}
    >
      <div className="flex items-start gap-3">
        <span className={documented ? 'text-brand-green' : 'text-sage'}>
          {documented ? (
            <CheckCircle2 className="size-5" aria-hidden />
          ) : (
            <Circle className="size-5" aria-hidden />
          )}
        </span>
        <div className="flex flex-col gap-1">
          <label htmlFor={inputId} className="font-semibold text-ink">
            {item.short}
          </label>
          <p className="text-xs leading-relaxed text-sage-2">
            {documented ? 'Documented' : 'Not yet documented'}
          </p>
          <Link
            href={`/prerequisites/${item.slug}`}
            className="mt-0.5 inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand-teal hover:underline"
          >
            View requirements
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        </div>
      </div>
      <Switch
        id={inputId}
        checked={documented}
        onCheckedChange={onToggle}
        aria-label={`Mark ${item.short} as documented`}
      />
    </div>
  )
}
