import { CalendarRange, GitPullRequestArrow, Sparkles, Timer } from 'lucide-react'
import { PageHeader } from '@/components/primitives/page-header'
import { SectionCard } from '@/components/primitives/section-card'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { ThreeLenses } from '@/components/primitives/three-lenses'
import { Disclaimer } from '@/components/primitives/disclaimers'
import {
  InputsOutputsLens,
  SalesforceLaneCard,
} from '@/components/prerequisites/lens-content'
import { CadenceTimeline } from '@/components/monitoring/cadence-timeline'
import { ChangeControlFlow } from '@/components/monitoring/change-control'

const SF_LANES = [
  {
    define:
      'Every refinement is a governed edit to territory and account records, versioned so the plan’s history is auditable.',
    object: 'Territory & Account objects',
    fields: 'model version, effective date, change reason, approver',
  },
  {
    define:
      'Changes are staged and released inside the scheduled window, never applied silently mid-period.',
    object: 'Change request records',
    fields: 'status, cadence tier, impact assessment, release window',
  },
]

export default function RefinementPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Territory Monitoring · Recommendation 02"
        title="Territory Strategy Refinement"
        lede="A four-tier cadence — Weekly, Monthly, Quarterly, and Annual — with a governed change-control window, so decision frequency matches how fast conditions actually change."
        capability={['L3.4.4', 'L3.4.5']}
      />

      <InsightPanel title="Key takeaway" icon={Sparkles} tone="green">
        Match each decision to the pace of change. Faster cadences support small,
        reversible moves; slower cadences govern structural decisions. Schedule
        material changes within the agreed release window.
      </InsightPanel>

      <SectionCard
        title="The refinement cadence"
        description="Four review tiers, each with its own owner, horizon, and the specific changes it is allowed to make. Select a tier to see how it works."
        icon={CalendarRange}
      >
        <CadenceTimeline />
      </SectionCard>

      <SectionCard
        title="Governed change-control window"
        description="Structural refinements — reboundaries, re-tiering, quota revisions — pass through a single controlled flow before they take effect."
        icon={GitPullRequestArrow}
      >
        <div className="flex flex-col gap-4">
          <ChangeControlFlow />
          <InsightPanel tone="teal">
            The window is what separates refinement from thrash. Reps and
            managers get a stable book between releases, while the plan still
            adapts on a predictable schedule.
          </InsightPanel>
        </div>
      </SectionCard>

      <SectionCard
        title="Why a cadence at all"
        description="Continuous tinkering destabilizes books; annual-only reviews let problems fester. The cadence is the middle path."
        icon={Timer}
      >
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
              <p className="text-sm font-semibold text-ink">
                Too frequent → thrash
              </p>
              <p className="mt-1 text-sm leading-relaxed text-sage-2">
                Constant reassignment breaks relationships, resets ramp, and
                erodes trust in the plan.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
              <p className="text-sm font-semibold text-ink">
                Too rare → drift
              </p>
              <p className="mt-1 text-sm leading-relaxed text-sage-2">
                Annual-only reviews let workload imbalance and coverage gaps
                compound for months before anyone acts.
              </p>
            </div>
          </div>
          <Disclaimer kind="guardrails" />
        </div>
      </SectionCard>

      <ThreeLenses
        content={{
          inputsOutputs: (
            <InputsOutputsLens
              inputs={[
                'Early-warning flags from the monitoring dashboards',
                'Workload-balance and coverage exceptions',
                'Scoring and Rep Skill Score refreshes',
                'Market, headcount, and quota-plan changes',
                'Manager and RevOps review outcomes',
              ]}
              outputs={[
                'A four-tier review calendar with clear owners',
                'Scoped changes matched to each cadence',
                'A governed change-control window with sign-off',
                'A versioned, auditable history of the plan',
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
