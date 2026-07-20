// Data model for the Territory Monitoring phase: KPI dashboards and the
// refinement cadence. Values are illustrative fixtures for the design system,
// deterministic so server and client renders stay identical.

export type MetricTrend = 'up' | 'down' | 'flat'
/** Whether an upward movement is good ("positive") or bad ("negative"). */
export type MetricPolarity = 'positive' | 'negative'
export type VizTone = 'green' | 'teal' | 'lime' | 'purple' | 'sage'

export interface KpiMetric {
  id: string
  label: string
  value: string
  unit?: string
  /** Signed change vs. prior period, e.g. "+4.2 pts". */
  delta: string
  trend: MetricTrend
  polarity: MetricPolarity
  /** 8-period history (oldest → newest) driving the sparkline. */
  series: number[]
  /** Plain-language target / guardrail for the metric. */
  target: string
}

export interface KpiDomain {
  id: string
  label: string
  /** One-line description of what the domain answers. */
  tagline: string
  tone: VizTone
  /** Headline stat shown large when the domain is active. */
  headline: { value: string; unit?: string; caption: string }
  metrics: KpiMetric[]
}

export const KPI_DOMAINS: KpiDomain[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    tagline: 'Are territories converting their potential into bookings?',
    tone: 'green',
    headline: {
      value: '92',
      unit: '% attainment',
      caption: 'Blended quota attainment across all books, QTD',
    },
    metrics: [
      {
        id: 'attainment',
        label: 'Quota attainment',
        value: '92',
        unit: '%',
        delta: '+4.2 pts',
        trend: 'up',
        polarity: 'positive',
        series: [78, 81, 80, 84, 86, 88, 90, 92],
        target: 'Target ≥ 90% of reps at or above quota pace',
      },
      {
        id: 'pipeline',
        label: 'Pipeline coverage',
        value: '3.4',
        unit: '×',
        delta: '+0.3×',
        trend: 'up',
        polarity: 'positive',
        series: [2.6, 2.7, 2.9, 3.0, 3.0, 3.1, 3.2, 3.4],
        target: 'Healthy band: 3–4× of remaining quota',
      },
      {
        id: 'winrate',
        label: 'Win rate',
        value: '27',
        unit: '%',
        delta: '+1.5 pts',
        trend: 'up',
        polarity: 'positive',
        series: [22, 23, 24, 24, 25, 25, 26, 27],
        target: 'Watch for tier-A win rate below 30%',
      },
      {
        id: 'arr',
        label: 'Net-new ARR',
        value: '18.6',
        unit: '$M',
        delta: '+11%',
        trend: 'up',
        polarity: 'positive',
        series: [12.4, 13.1, 14.0, 15.2, 15.9, 16.8, 17.5, 18.6],
        target: 'Pacing to $74M annual net-new plan',
      },
    ],
  },
  {
    id: 'coverage',
    label: 'Coverage',
    tagline: 'Is every account in the ICP actually being worked?',
    tone: 'teal',
    headline: {
      value: '87',
      unit: '% whitespace covered',
      caption: 'Share of ICP accounts assigned to an active, ramped rep',
    },
    metrics: [
      {
        id: 'whitespace',
        label: 'ICP whitespace covered',
        value: '87',
        unit: '%',
        delta: '+6 pts',
        trend: 'up',
        polarity: 'positive',
        series: [74, 76, 78, 80, 82, 84, 85, 87],
        target: 'Target ≥ 90% of tier-A/B accounts covered',
      },
      {
        id: 'tierA',
        label: 'Tier-A touch rate',
        value: '94',
        unit: '%',
        delta: '+2 pts',
        trend: 'up',
        polarity: 'positive',
        series: [88, 89, 90, 91, 92, 92, 93, 94],
        target: 'Every tier-A account touched within 30 days',
      },
      {
        id: 'unassigned',
        label: 'Unassigned tier-A/B',
        value: '31',
        unit: 'accts',
        delta: '-18',
        trend: 'down',
        polarity: 'negative',
        series: [96, 84, 72, 63, 52, 44, 38, 31],
        target: 'Drive toward zero via TBH containers',
      },
      {
        id: 'perrep',
        label: 'Accounts per rep',
        value: '148',
        unit: '',
        delta: '-6',
        trend: 'down',
        polarity: 'positive',
        series: [172, 168, 164, 160, 157, 153, 151, 148],
        target: 'Segment guide: 120–160 for commercial books',
      },
    ],
  },
  {
    id: 'productivity',
    label: 'Productivity',
    tagline: 'Are reps ramping and selling efficiently?',
    tone: 'lime',
    headline: {
      value: '5.2',
      unit: 'mo ramp',
      caption: 'Median time to first full-quota month for new hires',
    },
    metrics: [
      {
        id: 'ramp',
        label: 'Time to productivity',
        value: '5.2',
        unit: 'mo',
        delta: '-0.6 mo',
        trend: 'down',
        polarity: 'positive',
        series: [6.4, 6.3, 6.1, 5.9, 5.7, 5.5, 5.4, 5.2],
        target: 'Target ramp ≤ 5 months for commercial roles',
      },
      {
        id: 'activity',
        label: 'Qualified meetings / rep',
        value: '11.3',
        unit: '/wk',
        delta: '+0.9',
        trend: 'up',
        polarity: 'positive',
        series: [8.9, 9.2, 9.6, 10.0, 10.4, 10.8, 11.0, 11.3],
        target: 'Floor of 8 qualified meetings per week',
      },
      {
        id: 'cycle',
        label: 'Avg. sales cycle',
        value: '58',
        unit: 'days',
        delta: '-4 days',
        trend: 'down',
        polarity: 'positive',
        series: [72, 70, 68, 65, 63, 61, 60, 58],
        target: 'Trending down as territories stabilize',
      },
      {
        id: 'dealsize',
        label: 'Avg. deal size',
        value: '42.1',
        unit: '$K',
        delta: '+3%',
        trend: 'up',
        polarity: 'positive',
        series: [37.5, 38.2, 39.0, 39.8, 40.4, 41.0, 41.6, 42.1],
        target: 'Rising with better tier-A targeting',
      },
    ],
  },
  {
    id: 'balance',
    label: 'Balance',
    tagline: 'Is workload distributed fairly across the team?',
    tone: 'purple',
    headline: {
      value: '82',
      unit: '% in band',
      caption: 'Reps whose Workload Index sits within ±10% of segment average',
    },
    metrics: [
      {
        id: 'inband',
        label: 'Reps within ±10% band',
        value: '82',
        unit: '%',
        delta: '+9 pts',
        trend: 'up',
        polarity: 'positive',
        series: [64, 66, 69, 72, 75, 78, 80, 82],
        target: 'Target ≥ 90% of reps inside the balance band',
      },
      {
        id: 'spread',
        label: 'Workload spread',
        value: '0.18',
        unit: 'σ',
        delta: '-0.05',
        trend: 'down',
        polarity: 'positive',
        series: [0.31, 0.29, 0.27, 0.25, 0.23, 0.21, 0.19, 0.18],
        target: 'Lower is better; rebalance above 0.25σ',
      },
      {
        id: 'overloaded',
        label: 'Overloaded books',
        value: '4',
        unit: 'reps',
        delta: '-3',
        trend: 'down',
        polarity: 'negative',
        series: [11, 10, 9, 8, 7, 6, 5, 4],
        target: 'Books > +10% index flagged for reassignment',
      },
      {
        id: 'attrition',
        label: 'Attrition risk flags',
        value: '6',
        unit: 'reps',
        delta: '-2',
        trend: 'down',
        polarity: 'negative',
        series: [12, 11, 10, 9, 8, 7, 7, 6],
        target: 'Overload is a leading indicator of attrition',
      },
    ],
  },
]

/** The old (Excel) vs. new (Salesforce) reporting posture. */
export interface ReportingShift {
  from: string
  to: string
}

export const REPORTING_SHIFTS: ReportingShift[] = [
  {
    from: 'Monthly Excel exports stitched together by hand',
    to: 'Live Salesforce dashboards refreshed continuously',
  },
  {
    from: 'Backward-looking: last quarter’s bookings',
    to: 'Potential-based: attainment against account potential',
  },
  {
    from: 'One blended number hides territory-level problems',
    to: 'Drill-down by BU, segment, region, and rep',
  },
  {
    from: 'Reconciliation debates about whose numbers are right',
    to: 'A single system of record everyone reads from',
  },
]

// ---- Refinement cadence -------------------------------------------------

export interface CadenceTier {
  id: string
  cadence: string
  horizon: string
  owner: string
  tone: VizTone
  /** The core question this review answers. */
  question: string
  /** What gets reviewed at this cadence. */
  reviews: string[]
  /** Changes that may be made at this cadence. */
  changes: string[]
  /** The kind of change control that gates action. */
  control: string
}

export const CADENCE_TIERS: CadenceTier[] = [
  {
    id: 'weekly',
    cadence: 'Weekly',
    horizon: 'This week',
    owner: 'Front-line managers',
    tone: 'green',
    question: 'Is anything on fire in the current book?',
    reviews: [
      'New unassigned tier-A/B accounts',
      'Reps tripping the overload flag',
      'Stalled deals in strategic accounts',
    ],
    changes: [
      'Reassign a single account within a team',
      'Assign a guest owner for cover',
      'Flag a book for the monthly balance review',
    ],
    control: 'Manager discretion, logged as a note — no approval needed.',
  },
  {
    id: 'monthly',
    cadence: 'Monthly',
    horizon: 'This month',
    owner: 'RevOps + Sales leadership',
    tone: 'teal',
    question: 'Are workloads and coverage drifting out of band?',
    reviews: [
      'Workload Index spread vs. the ±10% band',
      'Whitespace coverage by segment',
      'TBH container fill and open-role progress',
    ],
    changes: [
      'Rebalance accounts across a segment',
      'Open or resize a TBH container',
      'Adjust guardrail thresholds for the month',
    ],
    control: 'RevOps review; changes batched into a monthly release.',
  },
  {
    id: 'quarterly',
    cadence: 'Quarterly',
    horizon: 'This quarter',
    owner: 'Sales Ops + Finance',
    tone: 'lime',
    question: 'Do the territory boundaries still fit the market?',
    reviews: [
      'Segment mix and tier distribution shifts',
      'Quota attainment vs. capacity assumptions',
      'Rep Skill Score movement and ramp outcomes',
    ],
    changes: [
      'Redraw territory boundaries for a BU',
      'Re-tier accounts after a scoring refresh',
      'Revise quota within the governed window',
    ],
    control: 'Change-control board sign-off before the window opens.',
  },
  {
    id: 'annual',
    cadence: 'Annual',
    horizon: 'Next fiscal year',
    owner: 'GTM leadership',
    tone: 'purple',
    question: 'Is the whole model still the right one?',
    reviews: [
      'Segmentation model and dimension cuts per BU',
      'Coverage philosophy and capacity formulas',
      'KPI definitions and dashboard targets',
    ],
    changes: [
      'Reset the segmentation model version',
      'Re-baseline capacity and quota planning',
      'Approve the fiscal-year territory container plan',
    ],
    control: 'Annual planning cycle; full governance and exec approval.',
  },
]

/** Steps in the governed change-control window that gates structural change. */
export interface ChangeControlStep {
  id: string
  label: string
  detail: string
}

export const CHANGE_CONTROL_STEPS: ChangeControlStep[] = [
  {
    id: 'propose',
    label: 'Propose',
    detail:
      'A change is raised with its trigger, scope, and the accounts or reps affected.',
  },
  {
    id: 'assess',
    label: 'Assess impact',
    detail:
      'RevOps models the effect on workload balance, coverage, and quota before anything moves.',
  },
  {
    id: 'approve',
    label: 'Approve',
    detail:
      'The right authority for the cadence signs off — manager, RevOps, or the change-control board.',
  },
  {
    id: 'window',
    label: 'Release in window',
    detail:
      'Approved changes are applied only inside the scheduled change window, never ad hoc.',
  },
  {
    id: 'record',
    label: 'Record & measure',
    detail:
      'The change is versioned in Salesforce and its effect is tracked on the next dashboard refresh.',
  },
]
