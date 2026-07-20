'use client'

import {
  Scale,
  Flame,
  Feather,
  Activity,
  Users2,
  Repeat,
  FilePen,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'
import {
  type Rep,
  type Tone,
  fmtNumber,
  fmtPct,
  fmtCurrency,
  capacityBand,
  reassignmentFrequency,
  quotaRevisionRate,
  approvalCompliance,
  territoryLoads,
  hiringPlan,
} from '@/lib/territory-data'
import { SectionCard } from '@/components/primitives/section-card'
import {
  StatCard,
  NextBestActions,
  InsightList,
  Pill,
  DataTable,
  type Insight,
  type NextAction,
} from './shell'
import { HBarChart, BubbleScatter, SegmentBar, SERIES } from './charts'

const ACTION_TONE: Record<string, Tone> = {
  Hire: 'critical',
  'Backfill (TBH)': 'warning',
  Hold: 'success',
}

export function BalanceView({ reps }: { reps: Rep[] }) {
  const loads = territoryLoads(reps)
  const overloaded = loads.filter((l) => l.status === 'overloaded')
  const underutilized = loads.filter((l) => l.status === 'underutilized')
  const avgIndex = loads.reduce((a, l) => a + l.loadIndex, 0) / (loads.length || 1)

  const cap = capacityBand(reps)
  const reassign = reassignmentFrequency(reps)
  const quotaRev = quotaRevisionRate(reps)
  const approval = approvalCompliance(reps)
  const plan = hiringPlan(reps)

  const loadBars = [...loads]
    .sort((a, b) => b.loadIndex - a.loadIndex)
    .map((l) => ({
      label: l.territory,
      value: l.loadIndex,
      color:
        l.status === 'overloaded'
          ? '#e5484d'
          : l.status === 'underutilized'
            ? SERIES[3]
            : SERIES[1],
    }))

  const bubbles = loads.map((l) => ({
    x: l.loadIndex,
    y: l.whitespace,
    r: l.reps,
    color: l.status === 'overloaded' ? '#e5484d' : SERIES[0],
    title: `${l.territory} · index ${l.loadIndex} · ${fmtNumber(l.whitespace)} whitespace`,
  }))

  // Suggested rebalancing moves: overloaded -> underutilized pairs
  const moves = overloaded.slice(0, 4).map((o, i) => {
    const target = underutilized[i % (underutilized.length || 1)]
    const shift = Math.round((o.accounts - o.reps * 100) * 0.15)
    return {
      from: <span className="font-medium text-ink">{o.territory}</span>,
      to: target ? target.territory : 'TBH container',
      accounts: fmtNumber(Math.max(8, shift)),
      quota: fmtCurrency(Math.max(8, shift) * 12000),
      result: <Pill tone="success">Both → Balanced</Pill>,
    }
  })

  const loadRows = loads.map((l) => {
    const tone =
      l.status === 'overloaded'
        ? 'critical'
        : l.status === 'underutilized'
          ? 'warning'
          : 'success'
    return {
      territory: <span className="font-medium text-ink">{l.territory}</span>,
      reps: String(l.reps),
      quota: fmtCurrency(l.quotaPerRep),
      accounts: Math.round(l.accountsPerRep).toString(),
      index: <span className="font-semibold tabular-nums">{l.loadIndex}</span>,
      status: (
        <Pill tone={tone}>
          {l.status === 'overloaded'
            ? 'Overloaded'
            : l.status === 'underutilized'
              ? 'Underutilized'
              : 'Balanced'}
        </Pill>
      ),
    }
  })

  const hireRows = plan.rows.map((r) => ({
    territory: <span className="font-medium text-ink">{r.territory}</span>,
    accounts: fmtNumber(r.accounts),
    target: fmtNumber(r.targetPerRep),
    now: String(r.holdersNow),
    ideal: String(r.ideal),
    add: r.add > 0 ? <span className="font-semibold text-ink">+{r.add}</span> : '—',
    uncovered: fmtCurrency(r.uncovered),
    action: <Pill tone={ACTION_TONE[r.action]}>{r.action}</Pill>,
  }))

  const mostOverloaded = [...loads].sort((a, b) => b.loadIndex - a.loadIndex)[0]

  const insights: Insight[] = [
    {
      severity: overloaded.length > 0 ? 'critical' : 'positive',
      title: `${mostOverloaded.territory} is most overloaded`,
      detail: `Load index ${mostOverloaded.loadIndex} vs 100 target. Split or rebalance before attrition risk rises.`,
    },
    {
      severity: cap.tone === 'success' ? 'positive' : 'warning',
      title: `${fmtPct(cap.pct)} of reps within capacity band`,
      detail: `${cap.over} over, ${cap.under} under. Overloaded books lead both missed quota and churn.`,
    },
    {
      severity: reassign.tone === 'success' ? 'positive' : 'warning',
      title: `${fmtPct(reassign.adHocPct)} of moves were ad hoc`,
      detail: `${reassign.adHoc} of ${reassign.total} account moves bypassed the governed window.`,
    },
    {
      severity: quotaRev.tone === 'success' ? 'positive' : 'warning',
      title: `Quota revised on ${fmtPct(quotaRev.pct)} of books`,
      detail: 'Frequent post-assignment revisions signal a planning problem, not an execution one.',
    },
  ]

  const actions: NextAction[] = [
    {
      priority: 'High',
      owner: 'RevOps + Finance',
      action: `Open ${plan.hireGap} new territory holders`,
      rationale: `Ideal ${plan.idealHolders} vs current ${plan.currentHolders} holders given account loads.`,
      impact: `Covers ${fmtCurrency(plan.uncoveredOpportunity)} at-risk opportunity`,
    },
    {
      priority: 'Medium',
      owner: 'RevOps',
      action: `Backfill ${plan.openCoverage} open books with TBH`,
      rationale: 'Temporary coverage is a stop-gap; TBH containers hold the plan.',
      impact: 'Stabilizes coverage ahead of hiring',
    },
    {
      priority: 'Medium',
      owner: 'Sales leadership',
      action: `Split the most-overloaded territory (${mostOverloaded.territory})`,
      rationale: `Load index ${mostOverloaded.loadIndex} is well above the balance band.`,
      impact: 'Brings two books back inside ±10%',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Territories Analyzed" value={String(loads.length)} icon={Scale} />
        <StatCard label="Overloaded Territories" value={String(overloaded.length)} icon={Flame} tone={overloaded.length === 0 ? 'success' : 'critical'} sub="index ≥ 118" />
        <StatCard label="Underutilized" value={String(underutilized.length)} icon={Feather} tone={underutilized.length === 0 ? 'success' : 'warning'} sub="index ≤ 82" />
        <StatCard label="Load Spread" value={avgIndex.toFixed(0)} icon={Activity} tone={Math.abs(avgIndex - 100) <= 10 ? 'success' : 'warning'} sub="avg index · target 100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Reps Within Capacity Band" value={fmtPct(cap.pct)} icon={Users2} tone={cap.tone} />
        <StatCard label="Reassignment Frequency" value={fmtNumber(reassign.total)} icon={Repeat} tone={reassign.tone} sub={`${reassign.adHoc} ad hoc`} />
        <StatCard label="Quota Revision Rate" value={fmtPct(quotaRev.pct)} icon={FilePen} tone={quotaRev.tone} sub="target < 5%" />
        <StatCard label="Change Approval Compliance" value={fmtPct(approval.pct)} icon={ShieldCheck} tone={approval.tone} />
      </div>

      <NextBestActions actions={actions} />

      {/* Hiring & Capacity Plan */}
      <div className="rounded-xl border border-border/70 bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-ink text-brand-green">
              <UserPlus className="size-4" aria-hidden />
            </span>
            <span className="text-sm font-bold text-ink">Hiring & capacity plan</span>
          </div>
          <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
            {plan.hireGap} recommended hires
          </span>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Current vs Ideal Holders" value={`${plan.currentHolders} / ${plan.idealHolders}`} tone="warning" />
            <StatCard label="Recommended Hires" value={String(plan.hireGap)} tone={plan.hireGap === 0 ? 'success' : 'critical'} />
            <StatCard label="Open / TBH Books" value={String(plan.openCoverage)} tone="warning" />
            <StatCard label="Opportunity Uncovered" value={fmtCurrency(plan.uncoveredOpportunity)} tone="critical" />
          </div>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <DataTable
              maxHeight={320}
              columns={[
                { key: 'territory', label: 'Territory' },
                { key: 'accounts', label: 'Accounts', align: 'right' },
                { key: 'target', label: 'Target/rep', align: 'right' },
                { key: 'now', label: 'Holders now', align: 'right' },
                { key: 'ideal', label: 'Ideal', align: 'right' },
                { key: 'add', label: 'Add', align: 'right' },
                { key: 'uncovered', label: 'Opp. uncovered', align: 'right' },
                { key: 'action', label: 'Recommended action' },
              ]}
              rows={hireRows}
            />
          </div>
          <p className="text-xs leading-relaxed text-sage-2">
            Leading practice: size holders from account load against the capacity
            midpoint, backfill open books with TBH containers, and hire only where
            overload persists after rebalancing.
          </p>
        </div>
      </div>

      <SectionCard
        title="Workload balance by territory"
        description="Load index per territory; 100 is the balanced reference."
      >
        <HBarChart
          data={loadBars}
          reference={{ value: 100, label: 'Balanced (100)' }}
          format={(n) => `${Math.round(n)}`}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Capacity vs opportunity"
          description="Load index vs whitespace; bubble size = reps. Overloaded points in red."
        >
          <BubbleScatter
            points={bubbles}
            xLabel="Load index"
            yLabel="Whitespace accounts"
          />
        </SectionCard>
        <InsightList insights={insights} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Capacity band compliance"
          description="Reps within, over, and under their role capacity band."
        >
          <div className="flex flex-col gap-4">
            <SegmentBar
              segments={[
                { label: 'Within band', value: cap.within, color: SERIES[1] },
                { label: 'Over capacity', value: cap.over, color: '#e5484d' },
                { label: 'Under capacity', value: cap.under, color: SERIES[3] },
              ]}
            />
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Within', value: cap.within, tone: 'text-brand-teal' },
                { label: 'Over', value: cap.over, tone: 'text-destructive' },
                { label: 'Under', value: cap.under, tone: 'text-ink' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border/60 bg-surface p-3 text-center"
                >
                  <div className={`text-xl font-bold ${s.tone}`}>{s.value}</div>
                  <div className="text-[11px] text-sage-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Governance & fairness"
          description="How disciplined the change process is."
        >
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Ad-hoc moves', value: fmtPct(reassign.adHocPct), tone: reassign.tone },
              { label: 'Quota revision', value: fmtPct(quotaRev.pct), tone: quotaRev.tone },
              { label: 'Approval', value: fmtPct(approval.pct), tone: approval.tone },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border/60 bg-surface p-3 text-center"
              >
                <div className="text-lg font-bold text-ink">{s.value}</div>
                <div className="text-[11px] text-sage-2">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-sage-2">
            Fairness is a governance outcome: fewer ad-hoc moves and stable quotas
            mean the model is trusted and changes flow through the window.
          </p>
        </SectionCard>
      </div>

      <SectionCard
        title="Suggested rebalancing moves"
        description="Modeled account transfers from overloaded to underutilized books."
        contentClassName="p-0"
      >
        <DataTable
          maxHeight={280}
          columns={[
            { key: 'from', label: 'From (overloaded)' },
            { key: 'to', label: 'To (underutilized)' },
            { key: 'accounts', label: 'Accounts', align: 'right' },
            { key: 'quota', label: 'Quota shifted', align: 'right' },
            { key: 'result', label: 'Result' },
          ]}
          rows={moves}
        />
      </SectionCard>

      <SectionCard
        title="Territory load detail"
        description="Per-territory capacity picture."
        contentClassName="p-0"
      >
        <DataTable
          maxHeight={320}
          columns={[
            { key: 'territory', label: 'Territory' },
            { key: 'reps', label: 'Reps', align: 'right' },
            { key: 'quota', label: 'Quota/rep', align: 'right' },
            { key: 'accounts', label: 'Accounts/rep', align: 'right' },
            { key: 'index', label: 'Load index', align: 'right' },
            { key: 'status', label: 'Status' },
          ]}
          rows={loadRows}
        />
      </SectionCard>
    </div>
  )
}
