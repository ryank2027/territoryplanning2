import { ArrowRight, Gauge, LayoutDashboard, Sparkles } from 'lucide-react'
import { REPORTING_SHIFTS } from '@/lib/monitoring'
import { PageHeader } from '@/components/primitives/page-header'
import { SectionCard } from '@/components/primitives/section-card'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { ThreeLenses } from '@/components/primitives/three-lenses'
import { Disclaimer } from '@/components/primitives/disclaimers'
import {
  InputsOutputsLens,
  SalesforceLaneCard,
} from '@/components/primitives/lens-content'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'

const SF_LANES = [
  {
    define:
      'Every KPI is computed from records in Salesforce — no offline spreadsheet feeds a number a dashboard then repeats.',
    object: 'Reporting objects & dashboards',
    fields: 'attainment, pipeline coverage, workload index, coverage %',
  },
  {
    define:
      'Dashboards are scoped by role so managers, RevOps, and leadership each see the same numbers at their altitude.',
    object: 'Dashboard & report folders',
    fields: 'BU filter, segment, region, rep, fiscal period',
  },
]

export default function KpisPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Territory Monitoring · Recommendation 01"
        title="KPIs & Dashboards"
        lede="Bring revenue, coverage, productivity, and balance into one Salesforce reporting experience. Pair historical performance with forward-looking potential so leaders can identify the next action, not just explain the last result."
        capability={['L3.4.1', 'L3.4.2', 'L3.4.3']}
      />

      <InsightPanel title="Key takeaway" icon={Sparkles} tone="green">
        One dataset, four lenses. Revenue, coverage, productivity, and balance
        are read from the same live territory data — so the debate moves from
        “whose numbers are right?” to “what do we do about them?”
      </InsightPanel>

      <SectionCard
        title="Live territory dashboards"
        description="Four role-ready dashboards computed from the current book of 40 territories. Each opens with headline KPIs and next-best-actions, then breaks the story down by rep, segment, and region."
        icon={LayoutDashboard}
      >
        <DashboardTabs />
      </SectionCard>

      <SectionCard
        title="From backward-looking to potential-based"
        description="The reporting shift that makes the dashboards worth watching."
        icon={Gauge}
      >
        <div className="flex flex-col gap-3">
          {REPORTING_SHIFTS.map((shift) => (
            <div
              key={shift.to}
              className="grid items-center gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm sm:grid-cols-[1fr_auto_1fr]"
            >
              <p className="text-sm leading-relaxed text-sage-2 line-through decoration-sage/50">
                {shift.from}
              </p>
              <ArrowRight
                className="hidden size-4 shrink-0 text-brand-teal sm:block"
                aria-hidden
              />
              <p className="text-sm font-medium leading-relaxed text-ink">
                {shift.to}
              </p>
            </div>
          ))}
          <Disclaimer kind="guardrails" />
        </div>
      </SectionCard>

      <ThreeLenses
        content={{
          inputsOutputs: (
            <InputsOutputsLens
              inputs={[
                'Bookings, pipeline, and win/loss from the CRM',
                'Account potential and A/B/C tiers from Decision 02',
                'Workload Index and Rep Skill Score from Decision 03',
                'Coverage and assignment state per territory',
                'Ramp status, headcount, and open-role data',
              ]}
              outputs={[
                'Role-scoped live dashboards for the four domains',
                'A workload-balance monitor against the ±10% band',
                'Potential-based attainment, not just bookings',
                'Early-warning flags feeding the refinement cadence',
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
