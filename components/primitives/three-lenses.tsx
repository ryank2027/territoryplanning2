'use client'

import { Compass, ArrowLeftRight, Cloud } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eyebrow } from './eyebrow'
import { cn } from '@/lib/utils'

export interface ThreeLensesContent {
  /** Why this, why now. Optional: omit when it duplicates copy above. */
  rationale?: React.ReactNode
  /** What flows in and out. */
  inputsOutputs: React.ReactNode
  /** How it lands in the platform (Salesforce ETM). */
  salesforce: React.ReactNode
}

const ALL_LENSES = [
  {
    value: 'rationale',
    label: 'Rationale & Approach',
    tagline: 'Why this, why now',
    icon: Compass,
  },
  {
    value: 'inputs-outputs',
    label: 'Inputs & Outputs',
    tagline: 'What flows in and out',
    icon: ArrowLeftRight,
  },
  {
    value: 'salesforce',
    label: 'Salesforce Translation',
    tagline: 'How it lands in the platform',
    icon: Cloud,
  },
] as const

/**
 * The reusable evaluation-lenses block that closes every recommendation page.
 * Renders the Rationale lens only when provided, so pages that already cover
 * the rationale above can show just Inputs/Outputs and Salesforce Translation.
 */
export function ThreeLenses({
  content,
  className,
}: {
  content: ThreeLensesContent
  className?: string
}) {
  const bodyByValue: Record<string, React.ReactNode> = {
    rationale: content.rationale,
    'inputs-outputs': content.inputsOutputs,
    salesforce: content.salesforce,
  }

  const lenses = ALL_LENSES.filter(
    (lens) => bodyByValue[lens.value] != null,
  )
  const defaultValue = lenses[0]?.value

  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(20,32,26,0.04),0_16px_40px_rgba(20,32,26,0.04)] md:p-6',
        className,
      )}
      aria-label="Evaluation lenses"
    >
      <div className="mb-4 flex flex-col gap-1">
        <Eyebrow tone="teal">Evaluation lenses</Eyebrow>
        <p className="text-sm text-sage-2">
          Each recommendation is examined through these lenses.
        </p>
      </div>

      <Tabs defaultValue={defaultValue} className="min-w-0 gap-0">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <TabsList
            className={cn(
              'grid h-auto w-fit gap-1.5 rounded-xl bg-muted p-1.5',
              lenses.length === 3 ? 'grid-cols-3' : 'grid-cols-2',
            )}
          >
          {lenses.map((lens) => {
            const Icon = lens.icon
            return (
              <TabsTrigger
                key={lens.value}
                value={lens.value}
                className="flex h-auto flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left data-active:bg-surface data-active:shadow-sm"
              >
                <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                  <Icon className="size-4 text-brand-teal" aria-hidden />
                  {lens.label}
                </span>
                <span className="text-[11px] font-normal text-sage-2">
                  {lens.tagline}
                </span>
              </TabsTrigger>
            )
          })}
          </TabsList>
        </div>

        {lenses.map((lens) => (
          <TabsContent
            key={lens.value}
            value={lens.value}
            className="mt-5 border-t border-border/60 pt-5 text-sm leading-relaxed text-ink-2"
          >
            {bodyByValue[lens.value]}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
