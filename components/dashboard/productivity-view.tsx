'use client'

import {
  Users,
  CalendarCheck,
  DollarSign,
  Gauge,
  ShieldCheck,
  Clock3,
  Timer,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  type Rep,
  fmtNumber,
  fmtPct,
  fmtCurrency,
  rampMetrics,
  territoryLoads,
  groupBy,
  sum,
  avg,
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
import { GroupedBarChart, BubbleScatter, HBarChart, SERIES } from './charts'
import { cn } from '@/lib/utils'

export function ProductivityView({ reps }: { reps: Rep[] }) {
  const totalMqls = sum(reps, (r) => r.mqls)
  const totalMeetings = sum(reps, (r) => r.meetings)
  const totalNbb = sum(reps, (r) => r.nbb)
  const wins = Math.round(totalMeetings * 0.32)
  const avgScore = avg(reps, (r) => r.territoryScore)
  const permScore = avg(
    reps.filter((r) => r.assignment === 'Permanent'),
    (r) => r.territoryScore,
  )
  const tempScore = avg(
    reps.filter((r) => r.assignment === 'Temporary'),
    (r) => r.territoryScore,
  )
  const ramp = rampMetrics(reps)
  const declining = reps.filter((r) => r.scoreTrend < 0).length
  const loads = territoryLoads(reps)
  const byTerr = groupBy(reps, (r) => r.territory)

  const meetingRate = totalMqls ? (totalMeetings / totalMqls) * 100 : 0
  const winRate = totalMeetings ? (wins / totalMeetings) * 100 : 0

  const funnel = [
    { label: 'MQLs', value: totalMqls, color: SERIES[0] },
    { label: 'Meetings', value: totalMeetings, color: SERIES[1] },
    { label: 'Wins', value: wins, color: SERIES[2] },
  ]
  const funnelMax = totalMqls || 1

  const bubbles = reps.map((r) => ({
    x: r.meetings,
    y: r.nbb,
    r: r.tam,
    color: r.assignment === 'Permanent' ? SERIES[0] : SERIES[3],
    title: `${r.name} · ${r.meetings} meetings · ${fmtCurrency(r.nbb)} NBB`,
  }))

  // Ramp buckets
  const buckets = [
    { label: '0–3 mo', lo: 0, hi: 3 },
    { label: '3–6 mo', lo: 3, hi: 6 },
    { label: '6–9 mo', lo: 6, hi: 9 },
    { label: '9–12 mo', lo: 9, hi: 12 },
    { label: '12+ mo', lo: 12, hi: Infinity },
  ]
  const rampBars = buckets.map((b) => {
    const count = reps.filter(
      (r) => r.rampMonths >= b.lo && r.rampMonths < b.hi,
    ).length
    const color =
      b.label === '12+ mo' ? '#e5484d' : b.label === '9–12 mo' ? SERIES[3] : SERIES[0]
    return { label: b.label, value: count, color }
  })

  const scoreByTerr = loads.map((l) => {
    const group = byTerr[l.territory]
    return {
      label: l.territory,
      values: [
        avg(group.filter((r) => r.assignment === 'Permanent'), (r) => r.territoryScore),
        avg(group.filter((r) => r.assignment === 'Temporary'), (r) => r.territoryScore),
      ],
    }
  })

  const rows = [...reps]
    .sort((a, b) => b.nbb - a.nbb)
    .map((r) => {
      const tamCap = (r.nbb / r.tam) * 100
      const scoreTone =
        r.territoryScore >= 80 ? 'success' : r.territoryScore >= 60 ? 'warning' : 'critical'
      return {
        rep: <span className="font-medium text-ink">{r.name}</span>,
        territory: r.territory,
        assignment: r.assignment,
        mqls: fmtNumber(r.mqls),
        meetings: fmtNumber(r.meetings),
        nbb: fmtCurrency(r.nbb),
        tam: fmtCurrency(r.tam),
        tamcap: fmtPct(tamCap, 1),
        score: <Pill tone={scoreTone}>{r.territoryScore}</Pill>,
        trend: (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-semibold',
              r.scoreTrend >= 0 ? 'text-brand-teal' : 'text-destructive',
            )}
          >
            {r.scoreTrend >= 0 ? (
              <ArrowUpRight className="size-3.5" aria-hidden />
            ) : (
              <ArrowDownRight className="size-3.5" aria-hidden />
            )}
            {Math.abs(r.scoreTrend)}
          </span>
        ),
      }
    })

  const insights: Insight[] = [
    {
      severity: winRate >= 30 ? 'positive' : 'warning',
      title: `Meeting-to-win at ${fmtPct(winRate)}`,
      detail: `${fmtPct(meetingRate)} of MQLs convert to meetings. Deal progression is the tightest stage.`,
    },
    {
      severity: declining > 0 ? 'warning' : 'positive',
      title: `${declining} territories with declining scores`,
      detail: 'Falling territory score is an early signal before bookings dip — queue for pipeline review.',
    },
    {
      severity: ramp.tone === 'success' ? 'positive' : 'warning',
      title: `Avg ramp ${ramp.avgRamp.toFixed(1)} mo vs ${ramp.benchmark.toFixed(1)} benchmark`,
      detail: `${ramp.overBenchmark} reps are over benchmark — tighten onboarding for the newest books.`,
    },
    {
      severity: 'info',
    },
  ]

  const actions: NextAction[] = [
    {
      priority: 'High',
      owner: 'Sales enablement',
      action: 'Run a deal-progression clinic',
      rationale: `Meeting-to-win sits at ${fmtPct(winRate)}; the funnel leaks most at close.`,
      impact: 'Lifts conversion on existing pipeline',
    },
    {
      priority: 'Medium',
      owner: 'Front-line managers',
      action: `Pipeline review for ${declining} declining territories`,
      rationale: 'Score decline precedes bookings decline by a quarter.',
      impact: 'Catches erosion before it hits revenue',
    },
    {
      priority: 'Medium',
      owner: 'RevOps',
      action: 'Tighten onboarding for ramping reps',
      rationale: `${ramp.overBenchmark} reps exceed the ramp benchmark.`,
      impact: 'Shortens time to first full-quota month',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total MQLs" value={fmtNumber(totalMqls)} icon={Users} tone="default" />
        <StatCard label="Meetings" value={fmtNumber(totalMeetings)} icon={CalendarCheck} tone="success" sub={`${fmtPct(meetingRate)} of MQLs`} />
        <StatCard label="New Booked Business" value={fmtCurrency(totalNbb)} icon={DollarSign} tone="success" delta="+6.1%" trend="up" />
        <StatCard label="Avg Territory Score" value={avgScore.toFixed(0)} icon={Gauge} tone={avgScore >= 75 ? 'success' : 'warning'} />
        <StatCard label="Permanent Score" value={permScore.toFixed(0)} icon={ShieldCheck} tone="success" />
        <StatCard label="Temporary Score" value={tempScore.toFixed(0)} icon={Clock3} tone={tempScore >= 70 ? 'warning' : 'critical'} />
        <StatCard label="Avg Rep Ramp Time" value={`${ramp.avgRamp.toFixed(1)}`} unit="mo" icon={Timer} tone={ramp.tone} sub={`bench ${ramp.benchmark.toFixed(1)} mo`} />
        <StatCard label="Declining Scores" value={String(declining)} icon={TrendingDown} tone={declining === 0 ? 'success' : declining <= 8 ? 'warning' : 'critical'} />
      </div>

      <NextBestActions actions={actions} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Demand-to-win funnel"
          description="MQLs to meetings to wins, with stage conversion."
        >
          <div className="flex flex-col gap-3">
            {funnel.map((f, i) => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs font-medium text-ink-2">
                  {f.label}
                </span>
                <div className="h-7 flex-1 rounded bg-muted/40">
                  <div
                    className="flex h-7 items-center justify-end rounded px-2 text-[11px] font-semibold text-white"
                    style={{
                      width: `${(f.value / funnelMax) * 100}%`,
                      background: f.color,
                      minWidth: '3rem',
                    }}
                  >
                    {fmtNumber(f.value)}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-1 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/60 bg-surface p-3 text-center">
                <div className="text-lg font-bold text-ink">{fmtPct(meetingRate)}</div>
                <div className="text-[11px] text-sage-2">MQL → Meeting</div>
              </div>
              <div className="rounded-lg border border-border/60 bg-surface p-3 text-center">
                <div className="text-lg font-bold text-ink">{fmtPct(winRate)}</div>
                <div className="text-[11px] text-sage-2">Meeting → Win</div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Activity vs outcomes"
          description="Meetings vs NBB; bubble size = TAM."
        >
          <BubbleScatter
            points={bubbles}
            xLabel="Meetings"
            yLabel="New booked business"
            legend={[
              { label: 'Permanent', color: SERIES[0] },
              { label: 'Temporary', color: SERIES[3] },
            ]}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Ramp-time distribution"
          description="Months to productivity; amber 9–12, red 12+."
        >
          <HBarChart data={rampBars} format={(n) => `${Math.round(n)}`} unit=" reps" />
          <p className="mt-3 text-xs text-sage-2">
            {ramp.overBenchmark} reps sit beyond their ramp benchmark today.
          </p>
        </SectionCard>
        <SectionCard
          title="Territory score composition"
          description="Permanent vs temporary score by territory."
        >
          <GroupedBarChart
            data={scoreByTerr}
            series={[
              { name: 'Permanent', color: SERIES[0] },
              { name: 'Temporary', color: SERIES[3] },
            ]}
            format={(n) => `${Math.round(n)}`}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Territory productivity"
          description="Ranked by new booked business."
          contentClassName="p-0"
        >
          <DataTable
            maxHeight={420}
            columns={[
              { key: 'rep', label: 'Rep' },
              { key: 'territory', label: 'Territory' },
              { key: 'assignment', label: 'Assignment' },
              { key: 'mqls', label: 'MQLs', align: 'right' },
              { key: 'meetings', label: 'Meetings', align: 'right' },
              { key: 'nbb', label: 'NBB', align: 'right' },
              { key: 'tam', label: 'TAM', align: 'right' },
              { key: 'tamcap', label: 'TAM Capture', align: 'right' },
              { key: 'score', label: 'Score' },
              { key: 'trend', label: 'Trend', align: 'right' },
            ]}
            rows={rows}
          />
        </SectionCard>
        <InsightList insights={insights} />
      </div>
    </div>
  )
}
