import { Hammer } from 'lucide-react'
import { PageHeader } from './page-header'

/**
 * Temporary placeholder for routes that will be built out in later steps.
 * Keeps navigation functional and on-brand while content is pending.
 */
export function SectionPlaceholder({
  eyebrow,
  title,
  lede,
  capability,
}: {
  eyebrow?: string
  title: string
  lede?: string
  capability?: string[]
}) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow={eyebrow} title={title} lede={lede} capability={capability} />
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
          <Hammer className="size-6" aria-hidden />
        </span>
        <p className="text-base font-semibold text-ink">Section in progress</p>
        <p className="max-w-md text-sm leading-relaxed text-sage-2">
          This page is scaffolded and will be built out in a following step. The global
          shell, brand system, and framework home are complete.
        </p>
      </div>
    </div>
  )
}
