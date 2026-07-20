import { Eyebrow } from './eyebrow'
import { CapabilityChips } from './capability-chips'
import { cn } from '@/lib/utils'

/** Standard page title block: eyebrow, title, optional lede + capability chips. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  capability,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  capability?: string[]
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header className={cn('flex max-w-5xl flex-col gap-4', className)}>
      {eyebrow && <Eyebrow tone="teal">{eyebrow}</Eyebrow>}
      <div className="flex flex-col gap-3">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-[-0.025em] text-ink sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>
        {capability && capability.length > 0 && (
          <CapabilityChips codes={capability} />
        )}
      </div>
      {lede && (
        <p className="max-w-3xl text-pretty text-base leading-7 text-ink-2 md:text-[17px]">{lede}</p>
      )}
      {children}
    </header>
  )
}
