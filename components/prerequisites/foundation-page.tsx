import Link from 'next/link'
import { ArrowRight, ClipboardList, Compass, ListChecks } from 'lucide-react'
import type { FoundationContent } from '@/lib/prerequisites'
import { PageHeader } from '@/components/primitives/page-header'
import { SectionCard } from '@/components/primitives/section-card'
import { ThreeLenses } from '@/components/primitives/three-lenses'
import { Button } from '@/components/ui/button'
import { InputsOutputsLens, SalesforceLaneCard } from './lens-content'

/** Shared template for the four Prerequisites foundation pages. */
export function FoundationPage({ content }: { content: FoundationContent }) {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        lede={content.lede}
        capability={content.capability}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: recommendation + ownership, stacked */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <SectionCard
            title="Recommendation and approach"
            icon={Compass}
          >
            <BulletList items={content.recommendation} />
          </SectionCard>

          <SectionCard title="Ownership and cadence" icon={ClipboardList}>
            <BulletList items={content.ownership} />
          </SectionCard>
        </div>

        {/* Right: requirements */}
        <SectionCard
          title="Requirements"
          description="What each BU needs to define."
          icon={ListChecks}
          className="lg:col-span-1"
        >
          <ul className="flex flex-col gap-4">
            {content.requirements.map((req, i) => {
              const Icon = req.icon
              return (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-green/15 text-ink">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {req.title && (
                      <span className="font-semibold text-ink">{req.title}</span>
                    )}
                    <span className="text-sm leading-relaxed text-ink-2">
                      {req.body}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </SectionCard>
      </div>

      <ThreeLenses
        content={{
          inputsOutputs: (
            <InputsOutputsLens inputs={content.inputs} outputs={content.outputs} />
          ),
          salesforce: <SalesforceLaneCard lane={content.salesforce} />,
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <p className="text-sm text-sage-2">
          See how all four prerequisites converge at the readiness gate.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/prerequisites/readiness-gate" />}
        >
          Readiness Gate
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 leading-relaxed">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-green"
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
