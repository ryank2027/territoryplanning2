import {
  Boxes,
  GitBranch,
  Filter,
  Gauge,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import {
  QUOTA_GUARDRAILS,
  REP_SKILL_COMPONENTS,
  WORKLOAD_COMPONENTS,
} from '@/lib/planning'
import { PageHeader } from '@/components/primitives/page-header'
import { SectionCard } from '@/components/primitives/section-card'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { ThreeLenses } from '@/components/primitives/three-lenses'
import { Disclaimer } from '@/components/primitives/disclaimers'
import {
  InputsOutputsLens,
  SalesforceLaneCard,
} from '@/components/prerequisites/lens-content'
import { FormulaBlock } from '@/components/planning/formula-block'
import { FilterThenRank } from '@/components/planning/filter-then-rank'
import { CoverageFlow } from '@/components/planning/coverage-flow'
import { ContainerRulesTable } from '@/components/planning/container-rules-table'
import { GuardrailGrid } from '@/components/planning/guardrail-grid'

const SF_LANES = [
  {
    define:
      'RevOps balances books by effort and skill—workload, revenue, rep skill, and continuity—sized to real, fully-ramped capacity. Reps are then linked to territories by hand.',
    object: 'Rep assignments stored in a link (intersection) object',
    fields: 'links each rep to a territory; role, primary flag, capacity',
  },
]

export default function CoveragePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Territory Planning · Decision 03"
        title="Coverage, Capacity & Rep Alignment"
        lede="Balance coverage across workload, revenue scale, and rep skill. First use the Workload Index to identify capacity; then use the Rep Skill Score to select the strongest fit among eligible reps."
        capability={['L3.3.1', 'L3.3.2', 'L3.3.4', 'L3.3.6']}
      />

      <InsightPanel title="Key takeaway" icon={Sparkles} tone="green">
        Coverage is never a single variable. The Rep Skill Score scores the rep,
        not the account, and sits alongside the Workload Index and the containers
        and guardrails that keep hiring and attrition predictable.
      </InsightPanel>

      <SectionCard
        title="Capacity logic"
        description="Start from the ideal, fully-ramped territory count, not current headcount."
        icon={Gauge}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormulaBlock formula="Rep Capacity = Total Target Sales Volume ÷ Quota per Rep" />
          <FormulaBlock formula="Required Reps = Total Addressable Volume (TAM/SAM) ÷ Rep Capacity" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          If onboard affordability is below ideal, build larger interim
          territories (knowingly under-covering whitespace) rather than abandoning
          the target. The ideal count is still created as the container plan for
          the fiscal year.
        </p>
      </SectionCard>

      <SectionCard
        title="Workload-weighted balancing"
        description="Coverage cannot rest on one variable; use a hybrid index per territory, rebalanced against the segment average."
        icon={GitBranch}
      >
        <FormulaBlock
          formula="Territory Workload Index = (0.40 × Tier Load) + (0.30 × ARR/Scale) + (0.20 × Open Opps) + (0.10 × Renewal Complexity)"
          components={WORKLOAD_COMPONENTS}
          note="Target: keep every rep's index within ±10% of the segment average."
        />
      </SectionCard>

      <SectionCard
        title="Rep Skill Score"
        description="A separate formula that scores the rep, quantified from system-of-record data so it can't be gamed. Same for every BU."
        icon={Users}
      >
        <div className="flex flex-col gap-4">
          <FormulaBlock
            formula="Rep Skill Score = (0.30 × Win/Close) + (0.30 × Quota Consistency) + (0.20 × Deal Size) + (0.20 × Cross-sell Depth)"
            components={REP_SKILL_COMPONENTS}
          />
          <Disclaimer kind="weights" />
        </div>
      </SectionCard>

      <SectionCard
        title="Filter, then Rank"
        description="The two scores play two roles in a two-stage process, run account-by-account in tier order. They never combine into one blended number."
        icon={Filter}
      >
        <FilterThenRank />
      </SectionCard>

      <SectionCard
        title="Vacant territory & To-Be-Hired containers"
        description="Every trigger maps to explicit system logic. Containers are pre-built and sized off the Workload Index."
        icon={Boxes}
      >
        <ContainerRulesTable />
      </SectionCard>

      <SectionCard
        title="Quota governance guardrails"
        description="What keeps quota changes predictable and auditable."
        icon={ShieldCheck}
      >
        <div className="flex flex-col gap-3">
          <GuardrailGrid items={QUOTA_GUARDRAILS} columns={3} />
          <Disclaimer kind="guardrails" />
        </div>
      </SectionCard>

      <SectionCard
        title="Coverage model: the full picture"
        description="Score → size → match → guard. One model for every BU; only the segmentation cuts differ, not the math."
        icon={GitBranch}
      >
        <div className="flex flex-col gap-4">
          <CoverageFlow />
          <InsightPanel tone="teal">
            One model for every BU. The same formulas and guardrails run for every
            business unit; what differs is the segmentation cuts and the resulting
            mix, not the math. User assignment is manual: reps are added to
            territories by hand, based on these guardrails and rules.
          </InsightPanel>
        </div>
      </SectionCard>

      <ThreeLenses
        content={{
          inputsOutputs: (
            <InputsOutputsLens
              inputs={[
                'A/B/C account tiers with agreed touchpoint expectations per tier',
                'Total revenue value per account',
                'Rep skill and tenure profiles',
                'Fully ramped headcount and open role data',
                'Confirmed capacity and rebalancing cadence',
              ]}
              outputs={[
                'Territory-to-rep mapping with documented rationale',
                'Workload balance analysis: underloaded / balanced / overloaded',
                'Capacity model reflecting actual ramped headcount',
                'Rep-to-account matching by skill level',
                'Change impact analysis when accounts move',
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
