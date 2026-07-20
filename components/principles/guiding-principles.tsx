import { Layers, Gauge, Scale, RefreshCw, type LucideIcon } from 'lucide-react'

interface Principle {
  ordinal: string
  title: string
  icon: LucideIcon
  body: string
  /** Where this principle shows up across the framework. */
  appliesIn: string
}

const PRINCIPLES: Principle[] = [
  {
    ordinal: '01',
    title: 'Standardize the top, localize below',
    icon: Layers,
    body: 'The top of the hierarchy is shared by every business unit — the geographic backbone of Country → Region → State → DMA. BU-specific dimensions (industry, product & venue type, meeting space) layer beneath it. One common spine, with room for BU nuance.',
    appliesIn: 'Segmentation Strategy',
  },
  {
    ordinal: '02',
    title: 'Score once, decide consistently',
    icon: Gauge,
    body: 'A single weighted 0–100 Account Score, built from ICP fitment and account potential, drives A/B/C tiering. The same formula and weights run for every BU and live on the Salesforce record, so prioritization is objective and comparable across the business.',
    appliesIn: 'Account Scoring & Mapping',
  },
  {
    ordinal: '03',
    title: 'Balance books on effort, not headcount',
    icon: Scale,
    body: 'Coverage balances workload, account scale, and rep skill within a ±10% band, so territories are fair by the effort a book actually requires — not by an even split of logos. Tiers carry explicit touch cadence to make that effort visible.',
    appliesIn: 'Coverage, Capacity & Rep Alignment',
  },
  {
    ordinal: '04',
    title: 'Keep the model living',
    icon: RefreshCw,
    body: 'A governed Weekly → Annual monitoring cadence with change control feeds insight back into the plan. The design stays accurate as the market and the book shift, rather than being rebuilt from scratch each planning cycle.',
    appliesIn: 'KPIs & Territory Refinement',
  },
]

export function GuidingPrinciples() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PRINCIPLES.map((p) => {
        const Icon = p.icon
        return (
          <article
            key={p.ordinal}
            className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-colors hover:border-brand-green"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink text-brand-green">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-mono text-sm font-bold text-brand-teal">
                {p.ordinal}
              </span>
              <h3 className="text-pretty text-base font-bold leading-tight text-ink">
                {p.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-ink-2">{p.body}</p>
            <p className="mt-auto flex items-center gap-1.5 text-xs text-sage-2">
              <span className="font-semibold uppercase tracking-[0.12em]">
                Shows up in
              </span>
              <span className="font-medium text-ink">{p.appliesIn}</span>
            </p>
          </article>
        )
      })}
    </div>
  )
}
