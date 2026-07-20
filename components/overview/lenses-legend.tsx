import { ArrowLeftRight, Cloud, Compass } from 'lucide-react'
import { Eyebrow } from '@/components/primitives/eyebrow'

const LENSES = [
  {
    icon: Compass,
    label: 'Rationale & Approach',
    desc: 'Why this, why now, and why the approach fits.',
  },
  {
    icon: ArrowLeftRight,
    label: 'Inputs & Outputs',
    desc: 'What data flows in and out; what exists vs. must be sourced.',
  },
  {
    icon: Cloud,
    label: 'Salesforce Translation',
    desc: 'How it lands in the platform: ETM objects, fields, automation.',
  },
]

export function LensesLegend() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <Eyebrow tone="teal">Three lenses</Eyebrow>
        <p className="text-sm text-ink-2">
          Every one of the four recommendations is answered through all three
          evaluation lenses, mapped to Territory Management capability functions
          feeding the L3/L4 process flows.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {LENSES.map((lens) => {
          const Icon = lens.icon
          return (
            <div
              key={lens.label}
              className="flex flex-col gap-2 rounded-xl border border-border/70 bg-surface-tint/60 p-4"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-sm font-bold text-ink">{lens.label}</span>
              <span className="text-xs leading-relaxed text-sage-2">{lens.desc}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
