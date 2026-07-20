'use client'

import {
  Radar,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  MapPinned,
  Clock,
  Star,
  MapPin,
} from 'lucide-react'
import {
  type Rep,
  fmtNumber,
  fmtPct,
  penetrationRate,
  coverageGap,
  stateCoverage,
  territoryLoads,
  groupBy,
  sum,
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
import { StackedBarChart, BubbleScatter, Legend, SERIES } from './charts'
import { cn } from '@/lib/utils'

const STATUS_STYLE = {
  covered: { bg: 'bg-brand-teal/80 text-white', label: 'Covered' },
  temporary: { bg: 'bg-brand-lime/70 text-ink', label: 'Temporary' },
  unallocated: { bg: 'bg-destructive/70 text-white', label: 'Unallocated' },
} as const

export function CoverageView({ reps }: { reps: Rep[] }) {
  const pen = penetrationRate(reps)
  const gap = coverageGap(reps)
  const states = stateCoverage(reps)
  const covered = sum(reps, (r) => r.coveredAccounts)
  const loads = territoryLoads(reps)
  const byTerr = groupBy(reps, (r) => r.territory)

  const unallocated = states.filter((s) => s.status === 'unallocated')
  const temporary = states.filter((s) => s.status === 'temporary')
  const priorityStates = states.filter((s) => s.priority)
  const priorityCovered = priorityStates.filter((s) => s.status === 'covered')
  const priorityPct = priorityStates.length
    ? (priorityCovered.length / priorityStates.length) * 100
    : 0
  const coveragePct = pen.pct

  const mixByTerr = loads.map((l) => {
    const group = byTerr[l.territory]
    const cov = sum(group, (r) => r.coveredAccounts)
    const tempCov = sum(
      group.filter((r) => r.assignment === 'Temporary'),
      (r) => r.coveredAccounts,
    )
    const white = sum(group, (r) => r.totalAccounts - r.coveredAccounts)
    return { label: l.territory, values: [cov - tempCov, tempCov, white] }
  })

  const bubbles = reps.map((r) => ({
    x: r.totalAccounts,
    y: (r.coveredAccounts / r.totalAccounts) * 100,
    r: r.currentARR,
    color: r.assignment === 'Permanent' ? SERIES[0] : SERIES[3],
    title: `${r.name} · ${r.totalAccounts} accts · ${fmtPct((r.coveredAccounts / r.totalAccounts) * 100)} covered`,
  }))

  const rows = loads.map((l) => {
    const group = byTerr[l.territory]
    const total = sum(group, (r) => r.totalAccounts)
    const cov = sum(group, (r) => r.coveredAccounts)
    const tmp = sum(
      group.filter((r) => r.assignment === 'Temporary'),
      (r) => r.coveredAccounts,
    )
    const white = total - cov
    const covPct = total ? (cov / total) * 100 : 0
    const tone = covPct >= 85 ? 'success' : covPct >= 70 ? 'warning' : 'critical'
    const unalloc = states.filter(
      (s) => s.territory === l.territory && s.status === 'unallocated',
    )
    return {
      territory: <span className="font-medium text-ink">{l.territory}</span>,
      reps: String(group.length),
      total: fmtNumber(total),
      covered: fmtNumber(cov),
      temporary: fmtNumber(tmp),
      whitespace: fmtNumber(white),
      pct: <Pill tone={tone}>{fmtPct(covPct)}</Pill>,
      unalloc:
        unalloc.length > 0 ? (
          <span className="text-destructive">
            {unalloc.map((s) => s.code).join(', ')}
          </span>
        ) : (
          <span className="text-sage-2">None</span>
        ),
    }
  })

  const biggestWhite = [...loads].sort(
    (a, b) => b.whitespace - a.whitespace,
  )[0]

  const insights: Insight[] = [
    {
      severity: gap.tone === 'critical' ? 'critical' : 'warning',
      title: `${gap.unowned} markets have no owner`,
      detail: `${fmtPct(gap.pct)} coverage gap. Assign or place a guest owner before pipeline decays.`,
    },
    {
      severity: 'warning',
      title: `${biggestWhite.territory} holds the most whitespace`,
      detail: `${fmtNumber(biggestWhite.whitespace)} uncovered accounts — prioritize overlay coverage here.`,
    },
    {
      severity: priorityPct >= 90 ? 'positive' : 'warning',
      title: `Priority states ${fmtPct(priorityPct)} covered`,
      detail: `${priorityCovered.length} of ${priorityStates.length} priority markets have a permanent owner.`,
    },
    {
      severity: 'info',
    },
  ]

  const actions: NextAction[] = [
    {
      priority: 'High',
      owner: 'RevOps',
      action: `Assign the ${gap.unowned} unowned markets`,
      rationale: 'Every unassigned market is whitespace no one is accountable for.',
      impact: 'Drives coverage gap toward zero',
    },
    {
      priority: 'Medium',
      owner: 'Sales leadership',
      action: `Deploy overlay into ${biggestWhite.territory}`,
      rationale: `Largest concentration of uncovered accounts (${fmtNumber(biggestWhite.whitespace)}).`,
      impact: 'Unlocks the biggest single whitespace pocket',
    },
    {
      priority: 'Low',
      owner: 'Front-line managers',
      action: 'Convert stable temporary books to permanent',
      rationale: `${temporary.length} markets run on temporary coverage today.`,
      impact: 'Improves continuity and account trust',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Coverage %" value={fmtPct(coveragePct)} icon={Radar} tone={pen.tone} />
        <StatCard label="Account Penetration" value={fmtPct(pen.pct)} icon={PieChart} tone={pen.tone} />
        <StatCard label="Coverage Gap" value={fmtPct(gap.pct)} icon={AlertTriangle} tone={gap.tone} sub="target → 0" />
        <StatCard label="Covered Accounts" value={fmtNumber(covered)} icon={CheckCircle2} tone="success" />
        <StatCard label="Unallocated Territories" value={String(unallocated.length)} icon={MapPinned} tone={unallocated.length === 0 ? 'success' : 'critical'} />
        <StatCard label="Temporary Territories" value={String(temporary.length)} icon={Clock} tone={temporary.length <= 3 ? 'warning' : 'critical'} />
        <StatCard label="Priority-State Coverage" value={fmtPct(priorityPct)} icon={Star} tone={priorityPct >= 90 ? 'success' : 'warning'} />
        <StatCard label="Markets Without Owner" value={String(gap.unowned)} icon={MapPin} tone={gap.unowned === 0 ? 'success' : 'critical'} />
      </div>

      <NextBestActions actions={actions} />

      <SectionCard
        title="Market coverage map"
        description="Every in-scope state, colored by ownership status. Priority markets are outlined."
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
            {states.map((s) => {
              const st = STATUS_STYLE[s.status]
              return (
                <div
                  key={s.code}
                  title={`${s.name} · ${st.label}${s.owner ? ` · ${s.owner}` : ''} · ${s.territory}`}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg px-2 py-3 text-center',
                    st.bg,
                    s.priority && 'ring-2 ring-ink/40 ring-offset-1 ring-offset-card',
                  )}
                >
                  <span className="text-sm font-bold">{s.code}</span>
                  <span className="text-[10px] opacity-90">{st.label}</span>
                </div>
              )
            })}
          </div>
          <Legend
            items={[
              { label: 'Covered', color: '#00b8c5' },
              { label: 'Temporary', color: '#c7f522' },
              { label: 'Unallocated', color: '#e5484d' },
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Coverage mix by territory"
        description="Permanent coverage, temporary coverage, and remaining whitespace."
      >
        <StackedBarChart
          data={mixByTerr}
          series={[
            { name: 'Permanent covered', color: SERIES[0] },
            { name: 'Temporary covered', color: SERIES[3] },
            { name: 'Whitespace', color: '#e5484d' },
          ]}
          format={fmtNumber}
        />
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Coverage concentration"
          description="Accounts vs coverage %; bubble size = current ARR."
        >
          <BubbleScatter
            points={bubbles}
            xLabel="Total accounts"
            yLabel="Coverage %"
            legend={[
              { label: 'Permanent', color: SERIES[0] },
              { label: 'Temporary', color: SERIES[3] },
            ]}
          />
        </SectionCard>
        <InsightList insights={insights} />
      </div>

      <SectionCard
        title="Territory coverage detail"
        description="Where whitespace and unallocated states concentrate."
        contentClassName="p-0"
      >
        <DataTable
          maxHeight={360}
          columns={[
            { key: 'territory', label: 'Territory' },
            { key: 'reps', label: 'Reps', align: 'right' },
            { key: 'total', label: 'Total Accts', align: 'right' },
            { key: 'covered', label: 'Covered', align: 'right' },
            { key: 'temporary', label: 'Temporary', align: 'right' },
            { key: 'whitespace', label: 'Whitespace', align: 'right' },
            { key: 'pct', label: 'Coverage %' },
            { key: 'unalloc', label: 'Unallocated States' },
          ]}
          rows={rows}
        />
      </SectionCard>
    </div>
  )
}
