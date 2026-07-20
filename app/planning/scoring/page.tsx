import { Calculator, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/primitives/page-header'
import { SectionCard } from '@/components/primitives/section-card'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { ThreeLenses } from '@/components/primitives/three-lenses'
import { Disclaimer } from '@/components/primitives/disclaimers'
import {
  InputsOutputsLens,
  SalesforceLaneCard,
} from '@/components/prerequisites/lens-content'
import { ScoreBuilder } from '@/components/planning/score-builder'
import { TierBand } from '@/components/planning/tier-band'

const SF_LANES = [
  {
    define:
      'Every account is scored on one weighted model—ICP fit 40% + potential 40% + propensity 20%, plus churn and risk flags—so rules act on record data, never an offline Excel calc.',
    object: 'Scores stored on the Account object',
    fields: 'ICP fit, potential, propensity, composite score, A/B/C tier',
  },
]

export default function ScoringPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Territory Planning · Decision 02"
        title="Account Scoring & Mapping"
        lede="Use one weighted account score from 0–100 to drive A/B/C tiering. Apply the same formula and weights across business units, with every input and result maintained on the Salesforce Account record."
        capability={['L3.2.1', 'L3.2.2', 'L3.2.5']}
      />

      <InsightPanel title="Key takeaway" icon={Sparkles} tone="green">
        A single weighted score, built from ICP fitment and account potential,
        produces the A/B/C tier every downstream step reads. The same formula and
        weights run for every business unit, and the score must live on the
        Salesforce Account record.
      </InsightPanel>

      <SectionCard
        title="Interactive score builder"
        description="Move the weights (they always sum to 100%) and pick a sample account to watch the score and tier recompute."
        icon={Calculator}
      >
        <div className="flex flex-col gap-4">
          <ScoreBuilder />
          <Disclaimer kind="weights" />
        </div>
      </SectionCard>

      <SectionCard
        title="Tiering & touch cadence"
        description="Distribute scores into tiers with explicit touch cadence, so a book is balanced on required effort, not headcount."
        icon={Layers3}
      >
        <TierBand />
      </SectionCard>

      <SectionCard
        title="Scoring guardrails"
        description="What keeps the score trustworthy and actionable."
        icon={ShieldCheck}
      >
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2.5">
            {[
              'The Account Score and every input must be stored as fields on the Salesforce Account record. Rules can only act on data on the record, never an offline Excel calc.',
              'The Account Score is the single, canonical value every territory and coverage decision reads from.',
              'Keep the Account Score distinct from opportunity-level and lead-level scores.',
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-2">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-green"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
          <Disclaimer kind="guardrails" />
        </div>
      </SectionCard>

      <ThreeLenses
        content={{
          inputsOutputs: (
            <InputsOutputsLens
              inputs={[
                'Agreed ICP definition across BUs',
                'Account data: company size, industry, revenue, and growth signals',
                'Sales engagement history: meetings, activity, pipeline',
                'Churn risk indicators: declining usage, low engagement, poor fit',
                'Agreed scoring weights and A/B/C tier definitions',
                'Agreed touchpoint expectations per tier',
              ]}
              outputs={[
                'A/B/C priority tier for every account',
                'Consistent scoring model applied across all BUs',
                'Whitespace and growth opportunity flags per account',
                'Risk flags for accounts showing churn signals',
                'Prioritized account list ready for territory assignment',
              ]}
            />
          ),
          salesforce: (
            <div className="flex flex-col gap-3">
              {SF_LANES.map((lane) => (
                <SalesforceLaneCard key={lane.object} lane={lane} />
              ))}
              <Disclaimer kind="architecture" />
            </div>
          ),
        }}
      />
    </div>
  )
}
