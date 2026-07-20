'use client'

import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ListChecks,
  ShieldCheck,
} from 'lucide-react'
import { useWorkspace } from '@/components/workspace/workspace-provider'
import { FOUNDATIONS } from '@/lib/prerequisites'
import { Eyebrow } from '@/components/primitives/eyebrow'

export function HubGrid() {
  const { readiness } = useWorkspace()
  const documentedCount = FOUNDATIONS.filter((f) => readiness[f.key]).length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {FOUNDATIONS.map((f, i) => {
          const done = readiness[f.key]
          return (
            <Link
              key={f.key}
              href={`/prerequisites/${f.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-colors hover:border-brand-green/50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-semibold text-sage-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={done ? 'text-brand-green' : 'text-sage'}>
                  {done ? (
                    <CheckCircle2 className="size-4" aria-hidden />
                  ) : (
                    <Circle className="size-4" aria-hidden />
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-base font-bold text-ink">{f.short}</h2>
                <p className="text-sm leading-relaxed text-ink-2">{f.lede}</p>
              </div>
              <div className="mt-auto flex items-center gap-1.5 pt-1 font-mono text-[11px] text-sage-2">
                {f.capability.join(' · ')}
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
                Open
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/prerequisites/inputs-outputs"
          className="group flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-colors hover:border-brand-teal/50"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
              <ListChecks className="size-5" aria-hidden />
            </span>
            <div className="flex flex-col gap-1">
              <Eyebrow tone="teal">Operating model</Eyebrow>
              <h2 className="text-base font-bold text-ink">
                Inputs / Outputs & Salesforce Translation
              </h2>
              <p className="text-sm leading-relaxed text-ink-2">
                What each prerequisite consumes and produces, and how it lands in
                Salesforce.
              </p>
            </div>
          </div>
          <ArrowRight
            className="mt-1 size-4 shrink-0 text-sage-2 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>

        <Link
          href="/prerequisites/readiness-gate"
          className="group flex items-start justify-between gap-4 rounded-2xl border border-brand-green/30 bg-brand-green/5 p-5 shadow-sm transition-colors hover:border-brand-green/60"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-green/20 text-ink">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div className="flex flex-col gap-1">
              <Eyebrow tone="sage">Gate</Eyebrow>
              <h2 className="text-base font-bold text-ink">Readiness Gate</h2>
              <p className="text-sm leading-relaxed text-ink-2">
                {documentedCount} of {FOUNDATIONS.length} prerequisites documented.
                All four gate territory planning.
              </p>
            </div>
          </div>
          <ArrowRight
            className="mt-1 size-4 shrink-0 text-sage-2 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  )
}
