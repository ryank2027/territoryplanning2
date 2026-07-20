import { Download, Upload } from 'lucide-react'
import { FOUNDATIONS } from '@/lib/prerequisites'
import { Eyebrow } from '@/components/primitives/eyebrow'

/**
 * "System of Truth for Prerequisites" matrix: one row per prerequisite with
 * Inputs and Outputs columns. Uses a responsive card/table hybrid so it stays
 * readable on the desktop-first leadership tool without breaking below 1024px.
 */
export function SystemOfTruth() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      {/* Header row (desktop) */}
      <div className="hidden grid-cols-[minmax(200px,1fr)_1.4fr_1.4fr] gap-4 border-b border-border/70 bg-surface-tint/60 px-5 py-3 lg:grid">
        <Eyebrow tone="sage">Prerequisite</Eyebrow>
        <span className="flex items-center gap-1.5">
          <Download className="size-3.5 text-brand-teal" aria-hidden />
          <Eyebrow tone="teal">Inputs</Eyebrow>
        </span>
        <span className="flex items-center gap-1.5">
          <Upload className="size-3.5 text-ink" aria-hidden />
          <Eyebrow tone="sage">Outputs</Eyebrow>
        </span>
      </div>

      <div className="divide-y divide-border/70">
        {FOUNDATIONS.map((f) => (
          <div
            key={f.key}
            className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(200px,1fr)_1.4fr_1.4fr]"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-ink">{f.short}</span>
              <span className="font-mono text-[11px] text-sage-2">
                {f.capability.join(' · ')}
              </span>
            </div>

            <div className="lg:contents">
              <div className="lg:hidden">
                <span className="flex items-center gap-1.5 pb-1">
                  <Download className="size-3.5 text-brand-teal" aria-hidden />
                  <Eyebrow tone="teal">Inputs</Eyebrow>
                </span>
              </div>
              <CellList items={f.inputs} tone="teal" />
            </div>

            <div className="lg:contents">
              <div className="lg:hidden">
                <span className="flex items-center gap-1.5 pb-1 pt-2">
                  <Upload className="size-3.5 text-ink" aria-hidden />
                  <Eyebrow tone="sage">Outputs</Eyebrow>
                </span>
              </div>
              <CellList items={f.outputs} tone="green" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CellList({ items, tone }: { items: string[]; tone: 'teal' | 'green' }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-2">
          <span
            className={
              'mt-1.5 size-1.5 shrink-0 rounded-full ' +
              (tone === 'teal' ? 'bg-brand-teal' : 'bg-brand-green')
            }
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  )
}
