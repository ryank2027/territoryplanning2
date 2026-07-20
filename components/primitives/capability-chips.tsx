import { cn } from '@/lib/utils'

/** Small labeled chips showing Capability Function Mapping codes (e.g. L2.1.1). */
export function CapabilityChips({
  codes,
  className,
}: {
  codes: string[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sage-2">
        Capability mapping
      </span>
      {codes.map((code) => (
        <span
          key={code}
          className="rounded-md border border-brand-purple/25 bg-brand-purple/5 px-2 py-0.5 font-mono text-[11px] font-bold text-brand-purple"
        >
          {code}
        </span>
      ))}
    </div>
  )
}
