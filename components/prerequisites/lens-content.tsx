import { ArrowRight, Database, Download, Upload } from 'lucide-react'
import type { SalesforceLane } from '@/lib/prerequisites'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { cn } from '@/lib/utils'

/** Two-column Inputs / Outputs list used in the ThreeLenses I/O lens. */
export function InputsOutputsLens({
  inputs,
  outputs,
  className,
}: {
  inputs: string[]
  outputs: string[]
  className?: string
}) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <IoColumn icon={Download} tone="teal" label="Inputs" items={inputs} />
      <IoColumn icon={Upload} tone="green" label="Outputs" items={outputs} />
    </div>
  )
}

function IoColumn({
  icon: Icon,
  tone,
  label,
  items,
}: {
  icon: typeof Download
  tone: 'teal' | 'green'
  label: string
  items: string[]
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'flex size-6 items-center justify-center rounded-md',
            tone === 'teal'
              ? 'bg-brand-teal/15 text-brand-teal'
              : 'bg-brand-green/20 text-ink',
          )}
        >
          <Icon className="size-3.5" aria-hidden />
        </span>
        <Eyebrow tone={tone === 'teal' ? 'teal' : 'sage'}>{label}</Eyebrow>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-2">
            <span
              className={cn(
                'mt-1.5 size-1.5 shrink-0 rounded-full',
                tone === 'teal' ? 'bg-brand-teal' : 'bg-brand-green',
              )}
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** "Define -> stored in Salesforce" card for a single prerequisite lane. */
export function SalesforceLaneCard({
  lane,
  className,
}: {
  lane: SalesforceLane
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 sm:flex-row sm:items-stretch',
        className,
      )}
    >
      <div className="flex-1 rounded-lg bg-surface p-3">
        <Eyebrow tone="sage">Define</Eyebrow>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{lane.define}</p>
      </div>
      <div
        className="flex items-center justify-center text-sage-2 sm:px-1"
        aria-hidden
      >
        <ArrowRight className="size-4 rotate-90 sm:rotate-0" />
      </div>
      <div className="flex-1 rounded-lg border border-brand-teal/25 bg-brand-teal/5 p-3">
        <div className="flex items-center gap-1.5">
          <Database className="size-3.5 text-brand-teal" aria-hidden />
          <Eyebrow tone="teal">Stored in Salesforce</Eyebrow>
        </div>
        <p className="mt-1 text-sm font-semibold text-ink">{lane.object}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-sage-2">
          Fields: {lane.fields}
        </p>
      </div>
    </div>
  )
}
