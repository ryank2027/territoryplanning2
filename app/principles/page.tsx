import { Compass, ListChecks, RotateCcw, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/primitives/page-header'
import { SectionCard } from '@/components/primitives/section-card'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { GuidingPrinciples } from '@/components/principles/guiding-principles'
import { RecommendationRecap } from '@/components/principles/recommendation-recap'

export default function PrinciplesPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Summary"
        title="Guiding Principles & Recommendations"
        lede="Four principles connect the full territory design model. Nine recommendations translate them into practical decisions across prerequisites, planning, and monitoring."
      />

      <InsightPanel title="The whole model in one line" icon={Sparkles} tone="green">
        Standardize the shared spine, score and size the work objectively, balance
        books on effort, and keep the plan alive with a feedback loop — the same
        framework for every business unit.
      </InsightPanel>

      <SectionCard
        title="Four guiding principles"
        description="The throughlines that keep the framework consistent, fair, and durable across business units."
        icon={Compass}
      >
        <GuidingPrinciples />
      </SectionCard>

      <SectionCard
        title="Nine recommendations"
        description="Each recommendation is examined through the same three lenses — rationale, inputs & outputs, and Salesforce translation. Select any to revisit its detail."
        icon={ListChecks}
      >
        <RecommendationRecap />
      </SectionCard>

      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-brand-purple/40 bg-brand-purple/5 px-5 py-4">
        <RotateCcw className="mt-0.5 size-5 shrink-0 text-brand-purple" aria-hidden />
        <p className="text-sm leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">It closes the loop.</span>{' '}
          Monitoring feeds insight back into Prerequisites and Planning, so the model
          adapts as conditions change instead of being rebuilt from scratch each cycle.
          That feedback loop is what makes the four principles hold over time.
        </p>
      </div>
    </div>
  )
}
