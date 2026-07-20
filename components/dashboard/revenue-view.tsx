'use client'

import {
  DollarSign,
  TrendingUp,
  Target,
  Map as MapIcon,
  Layers,
  Wallet,
  AlertTriangle,
  Users,
} from 'lucide-react'
import {
  type Rep,
  VERTICAL_NAMES,
  MANAGER_NAMES,
  fmtCurrency,
  fmtPct,
  healthOf,
  territoryAttainment,
  samCapture,
  territoryLoads,
  monthlyTrend,
  groupBy,
  sum,
} from '@/lib/territory-data'
import { SectionCard } from '@/components/primitives/section-card'
import {
  StatCard,
  NextBestActions,
  InsightList,
  HealthBadge,
  Pill,
  DataTable,
  TONE_TEXT,
  type Insight,
  type NextAction,
} from './shell'
import {
  GroupedBarChart,
  DonutChart,
  LineChart,
  HBarChart,
  StackedBarChart,
  Heatmap,
  SERIES,
} from './charts'
import { cn } from '@/lib/utils'

export function RevenueView({ reps }: { reps: Rep[] }) {
  const totalQuota = sum(reps, (r) => r.adjustedQuota)
  const totalARR = sum(reps, (r) => r.currentARR)
  const attainPct = totalQuota ? (totalARR / totalQuota) * 100 : 0
  const terr = territoryAttainment(reps)
  const sam = samCapture(reps)
  const totalAUM = sum(reps, (r) => r.currentAUM)
  const aumTarget = sum(reps, (r) => r.aumTarget)
  const belowTarget = reps.filter(
    (r) => r.currentARR / r.adjustedQuota < 0.8,
  ).length

  const loads = territoryLoads(reps)
  const byVertical = groupBy(reps, (r) => r.vertical)

  const attainTone =
    attainPct >= 95 ? 'success' : attainPct >= 80 ? 'warning' : 'critical'

  // Charts
  const verticalBars = Object.entries(byVertical).map(([v, group]) => ({
    label: v.split(' ')[0],
    values: [
      sum(group, (r) => r.adjustedQuota),
      sum(group, (r) => r.currentARR),
      sum(group, (r) => r.currentAUM),
    ],
  }))

  const permARR = sum(
    reps.filter((r) => r.assignment === 'Permanent'),
    (r) => r.currentARR,
  )
  const tempARR = totalARR - permARR

  const trend = monthlyTrend(reps)

  const attainByTerr = loads.map((l) => {
    const group = groupBy(reps, (r) => r.territory)[l.territory]
    const q = sum(group, (r) => r.adjustedQuota)
    const a = sum(group, (r) => r.currentARR)
    const p = q ? (a / q) * 100 : 0
    return {
      label: l.territory,
      value: Math.round(p),
      color: p >= 90 ? SERIES[1] : p >= 75 ? SERIES[3] : '#e5484d',
    }
  })

  const samByTerr = loads.map((l) => {
    const group = groupBy(reps, (r) => r.territory)[l.territory]
    const booked = sum(group, (r) => r.nbb)
    const unreal = Math.max(0, sum(group, (r) => r.sam) - booked)
    return { label: l.territory, values: [booked, unreal] }
  })

  // Table sorted lowest attainment first
  const rows = [...reps]
    .sort(
      (a, b) =>
        a.currentARR / a.adjustedQuota - b.currentARR / b.adjustedQuota,
    )
    .map((r) => {
      const h = healthOf(r)
      const vsTgt = (r.currentARR / r.adjustedQuota) * 100
      return {
        rep: <span className="font-medium text-ink">{r.name}</span>,
        manager: r.manager,
        territory: r.territory,
        vertical: r.vertical,
        tier: <Pill tone="default">{r.tier}</Pill>,
        quota: fmtCurrency(r.adjustedQuota),
        arr: fmtCurrency(r.currentARR),
        vs: (
          <span className={cn('font-semibold', TONE_TEXT[h.tone])}>
            {fmtPct(vsTgt)}
          </span>
        ),
        aum: fmtCurrency(r.currentAUM),
        gap: fmtCurrency(r.currentAUM - r.aumTarget),
        health: <HealthBadge label={h.label} tone={h.tone} />,
      }
    })

  const worstRep = [...reps].sort(
    (a, b) => a.currentARR / a.adjustedQuota - b.currentARR / b.adjustedQuota,
  )[0]

  const insights: Insight[] = [
    {
      severity: 'critical',
      title: `${worstRep.name} is furthest below plan`,
      detail: `${fmtPct((worstRep.currentARR / worstRep.adjustedQuota) * 100)} of quota in ${worstRep.territory}. Review book weight before quota relief.`,
    },
    {
      severity: terr.tone === 'success' ? 'positive' : 'warning',
      title: `${terr.onPlan} of ${terr.total} territories on plan`,
      detail: `${fmtPct(terr.pct)} on-plan rate. Target is ≥ 70% of territories at or above 90% attainment.`,
    },
    {
      severity: 'warning',
      title: `${fmtCurrency(sam.unrealized)} SAM unrealized`,
      detail: `Only ${fmtPct(sam.pct)} of serviceable opportunity is booked — the largest lever for net-new.`,
    },
    {
      severity: 'info',
    },
  ]

  const actions: NextAction[] = [
    {
      priority: 'High',
      owner: 'Sales leadership',
      action: 'Run a quota-relief review for below-plan books',
      rationale: `${belowTarget} reps sit under 80% attainment — separate execution from territory-design causes first.`,
      impact: 'Protects morale and isolates true design gaps',
    },
    {
      priority: 'Medium',
      owner: 'RevOps + Finance',
      action: 'Rebase FY26 quota on AUM potential',
      rationale: `AUM is ${fmtCurrency(Math.abs(totalAUM - aumTarget))} off target; bookings-based quotas understate potential.`,
      impact: 'Aligns quota to real account opportunity',
    },
    {
      priority: 'Medium',
      owner: 'Front-line managers',
      action: 'Prioritize SAM capture in top-gap territories',
      rationale: `${fmtCurrency(sam.unrealized)} of serviceable opportunity remains unworked.`,
      impact: 'Converts whitespace into pipeline',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Adjusted Quota" value={fmtCurrency(totalQuota)} icon={Target} />
        <StatCard
          label="Current ARR"
          value={fmtCurrency(totalARR)}
          icon={DollarSign}
          tone="success"
          delta="+8.4%"
          trend="up"
        />
        <StatCard
          label="Quota Attainment"
          value={fmtPct(attainPct)}
          icon={TrendingUp}
          tone={attainTone}
        />
        <StatCard
          label="Territories On Plan"
          value={fmtPct(terr.pct)}
          icon={MapIcon}
          tone={terr.tone}
          sub="target ≥ 70%"
        />
        <StatCard
          label="SAM Capture"
          value={fmtPct(sam.pct)}
          icon={Layers}
          tone={sam.tone}
        />
        <StatCard
          label="Current AUM vs Target"
          value={fmtPct((totalAUM / aumTarget) * 100)}
          icon={Wallet}
          tone={totalAUM >= aumTarget ? 'success' : 'warning'}
        />
        <StatCard
          label="Net AUM Gap"
          value={fmtCurrency(totalAUM - aumTarget)}
          icon={AlertTriangle}
          tone={totalAUM >= aumTarget ? 'success' : 'critical'}
        />
        <StatCard
          label="Reps Below Target"
          value={String(belowTarget)}
          icon={Users}
          tone={belowTarget === 0 ? 'success' : belowTarget <= 6 ? 'warning' : 'critical'}
          sub="< 80% attainment"
        />
      </div>

      <NextBestActions actions={actions} />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Quota vs ARR vs AUM by vertical"
          description="Where booked revenue and account value diverge from quota."
        >
          <GroupedBarChart
            data={verticalBars}
            series={[
              { name: 'Adj. Quota', color: SERIES[0] },
              { name: 'Current ARR', color: SERIES[1] },
              { name: 'Current AUM', color: SERIES[2] },
            ]}
            format={fmtCurrency}
          />
        </SectionCard>
        <SectionCard
          title="ARR composition"
          description="Permanent vs temporary book share."
        >
          <DonutChart
            data={[
              { label: 'Permanent', value: permARR, color: SERIES[0] },
              { label: 'Temporary', value: tempARR, color: SERIES[3] },
            ]}
          />
          <p className="mt-3 text-center text-xs text-sage-2">
            {fmtPct((tempARR / (totalARR || 1)) * 100)} of ARR sits in temporary
            books — a continuity risk.
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Monthly ARR / Quota / AUM trend"
          description="Trailing nine periods (quota dashed)."
        >
          <LineChart
            data={trend.map((t) => ({
              label: t.month,
              values: [t.arr, t.quota, t.aum],
            }))}
            series={[
              { name: 'ARR', color: SERIES[1] },
              { name: 'Quota', color: SERIES[4], dashed: true },
              { name: 'AUM', color: SERIES[2] },
            ]}
            format={fmtCurrency}
          />
        </SectionCard>
        <SectionCard
          title="Manager attainment heatmap"
          description="Blended quota attainment by manager and vertical."
        >
          <Heatmap
            rows={MANAGER_NAMES}
            cols={VERTICAL_NAMES.map((v) => v.split(' ')[0])}
            cell={(mgr, colShort) => {
              const group = reps.filter(
                (r) =>
                  r.manager === mgr && r.vertical.startsWith(colShort),
              )
              if (group.length === 0) return { value: null, label: '—' }
              const q = sum(group, (r) => r.adjustedQuota)
              const a = sum(group, (r) => r.currentARR)
              const ratio = q ? a / q : 0
              return { value: ratio, label: fmtPct(ratio * 100) }
            }}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Quota attainment by territory"
          description="Green reference line marks the 90% on-plan threshold."
        >
          <HBarChart
            data={attainByTerr}
            reference={{ value: 90, label: '90% on plan' }}
            format={(n) => `${Math.round(n)}`}
            unit="%"
          />
        </SectionCard>
        <SectionCard
          title="SAM capture by territory"
          description="Booked bookings vs unrealized serviceable opportunity."
        >
          <StackedBarChart
            data={samByTerr}
            series={[
              { name: 'Booked', color: SERIES[0] },
              { name: 'Unrealized', color: SERIES[4] },
            ]}
            format={fmtCurrency}
          />
          <p className="mt-3 text-xs text-sage-2">
            The unrealized band is the growth headroom already inside each
            territory.
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Book-level performance"
          description="Sorted lowest attainment first — the review queue."
          contentClassName="p-0"
        >
          <DataTable
            maxHeight={420}
            columns={[
              { key: 'rep', label: 'Rep' },
              { key: 'manager', label: 'Manager' },
              { key: 'territory', label: 'Territory' },
              { key: 'vertical', label: 'Vertical' },
              { key: 'tier', label: 'Tier' },
              { key: 'quota', label: 'Adj. Quota', align: 'right' },
              { key: 'arr', label: 'Current ARR', align: 'right' },
              { key: 'vs', label: 'ARR vs Tgt', align: 'right' },
              { key: 'aum', label: 'Current AUM', align: 'right' },
              { key: 'gap', label: 'Net AUM Gap', align: 'right' },
              { key: 'health', label: 'Health' },
            ]}
            rows={rows}
          />
        </SectionCard>
        <InsightList insights={insights} />
      </div>
    </div>
  )
}
