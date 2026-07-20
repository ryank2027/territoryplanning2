import Link from 'next/link'
import { ArrowDown, CheckCircle2, Diamond, Flag } from 'lucide-react'
import { FOUNDATIONS } from '@/lib/prerequisites'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { Button } from '@/components/ui/button'

/**
 * Four parallel "define -> stored in Salesforce" lanes that converge into a
 * single "all four ready?" decision diamond (PRD 6.1.5).
 */
export function TranslationFlow() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 lg:grid-cols-4">
        {FOUNDATIONS.map((f) => (
          <div
            key={f.key}
            className="flex flex-col rounded-xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <Eyebrow tone="teal">{f.short}</Eyebrow>

            <div className="mt-3 flex-1 rounded-lg bg-surface-tint/60 p-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sage-2">
                Define
              </span>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {f.salesforce.define}
              </p>
            </div>

            <div className="flex justify-center py-2 text-sage-2" aria-hidden>
              <ArrowDown className="size-4" />
            </div>

            <div className="rounded-lg border border-brand-teal/25 bg-brand-teal/5 p-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-teal">
                Stored in Salesforce
              </span>
              <p className="mt-1 text-sm font-semibold text-ink">
                {f.salesforce.object}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-sage-2">
                Fields: {f.salesforce.fields}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Convergence */}
      <div className="flex justify-center text-sage-2" aria-hidden>
        <ArrowDown className="size-5" />
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border border-brand-purple/30 bg-brand-purple/5 p-5 text-center">
        <span className="flex items-center gap-2 text-brand-purple">
          <Diamond className="size-4" aria-hidden />
          <Eyebrow>Decision</Eyebrow>
        </span>
        <p className="text-lg font-bold text-ink">
          All four ready and documented?
        </p>

        <div className="grid w-full gap-3 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-green/40 bg-brand-green/10 p-4">
            <CheckCircle2 className="size-5 text-ink" aria-hidden />
            <span className="text-sm font-bold text-ink">Yes</span>
            <span className="text-sm leading-relaxed text-ink-2">
              Ready for territory planning.
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-warn/40 bg-warn/10 p-4">
            <Flag className="size-5 text-warn" aria-hidden />
            <span className="text-sm font-bold text-ink">No</span>
            <span className="text-sm leading-relaxed text-ink-2">
              Flag to RevOps. Remediate the element before planning begins.
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="mt-1"
          nativeButton={false}
          render={<Link href="/prerequisites/readiness-gate" />}
        >
          Open the readiness gate
        </Button>
      </div>
    </div>
  )
}
