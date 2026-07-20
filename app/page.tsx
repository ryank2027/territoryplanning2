import { Layers, Target, Activity } from 'lucide-react'
import { FrameworkDiagram } from '@/components/overview/framework-diagram'
import { LensesLegend } from '@/components/overview/lenses-legend'
import { Eyebrow } from '@/components/primitives/eyebrow'

const COUNTERS = [
  { icon: Target, value: '3', label: 'focus areas' },
  { icon: Layers, value: '9', label: 'recommendations' },
  { icon: Activity, value: '3', label: 'evaluation lenses' },
]

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {/* Dark hero */}
      <section className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 md:px-10 md:py-14">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-brand-green"
          aria-hidden
        />
        <div className="flex flex-col gap-5">
          <Eyebrow tone="teal">Territory Design Workspace · FY26</Eyebrow>
          <h1 className="max-w-3xl text-pretty text-3xl font-bold leading-tight tracking-tight text-surface md:text-5xl">
            One territory framework,{' '}
            <span className="text-brand-green">three focus areas.</span>
          </h1>
          <p className="max-w-2xl text-pretty leading-relaxed text-surface/75">
            The top of the hierarchy is standardized across every business unit, with
            BU-specific structure below it. A feedback loop keeps strategy agile:
            Prerequisites inform Planning, Planning is kept accurate by Monitoring, and
            Monitoring feeds insight back into the model.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            {COUNTERS.map((counter) => {
              const Icon = counter.icon
              return (
                <div
                  key={counter.label}
                  className="flex items-center gap-3 rounded-xl border border-surface/10 bg-surface/5 px-4 py-3"
                >
                  <Icon className="size-5 text-brand-green" aria-hidden />
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-surface">
                      {counter.value}
                    </span>
                    <span className="text-sm text-surface/70">{counter.label}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Framework as an interactive diagram */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Eyebrow tone="teal">The framework</Eyebrow>
          <h2 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
            Prerequisites → Planning → Monitoring
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-2">
            Select any recommendation to open its detail. Each is examined through the
            same three evaluation lenses. Hover a card for a one-line summary.
          </p>
        </div>
        <FrameworkDiagram />
      </section>

      {/* Three-lens legend */}
      <LensesLegend />
    </div>
  )
}
