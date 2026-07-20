import { ArrowRight, Database, Download, Upload } from 'lucide-react'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { cn } from '@/lib/utils'

interface SalesforceLane {
  define: string
  object: string
  fields: string
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
    <div className="flex flex-1 flex-col gap-3 rounded-xl border border-border/70 bg-card p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            tone === 'teal' ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-green/15 text-ink',
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        <p className="text-sm font-bold text-ink">{label}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink-2">
            <ArrowRight className="mt-1 size-3.5 shrink-0 text-brand-teal" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

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
    <div className={cn('grid gap-3 md:grid-cols-2', className)}>
      <IoColumn icon={Download} tone="teal" label="Inputs" items={inputs} />
      <IoColumn icon={Upload} tone="green" label="Outputs" items={outputs} />
    </div>
  )
}

export function SalesforceLaneCard({
  lane,
  className,
}: {
  lane: SalesforceLane
  className?: string
}) {
  return (
    <div className={cn('grid gap-3 rounded-xl border border-border/70 bg-card p-4 md:grid-cols-[1fr_auto_1fr] md:items-center', className)}>
      <div className="flex flex-col gap-1">
        <Eyebrow tone="teal">Define</Eyebrow>
        <p className="text-sm leading-relaxed text-ink-2">{lane.define}</p>
      </div>
      <ArrowRight className="hidden size-5 text-brand-teal md:block" aria-hidden />
      <div className="flex flex-col gap-2 rounded-lg bg-surface-tint p-3">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-brand-teal" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-wide text-ink">Stored in Salesforce</p>
        </div>
        <p className="text-sm font-semibold text-ink">{lane.object}</p>
        <p className="text-xs leading-relaxed text-ink-2">Fields: {lane.fields}</p>
      </div>
    </div>
  )
}
