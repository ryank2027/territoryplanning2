// Deterministic seeded dataset + KPI compute layer for the territory dashboard.
// Everything derives from a fixed seed so the numbers are stable across
// renders while still looking like a real 40-rep book of business.

export type Tone = 'default' | 'success' | 'warning' | 'critical'

export type Assignment = 'Permanent' | 'Temporary'
export type Tier = 'A' | 'B' | 'C'

export interface Rep {
  id: string
  name: string
  manager: string
  territory: string
  vertical: string
  tier: Tier
  assignment: Assignment
  adjustedQuota: number
  currentARR: number
  currentAUM: number
  aumTarget: number
  nbb: number
  sam: number
  tam: number
  mqls: number
  meetings: number
  territoryScore: number
  scoreTrend: number
  rampMonths: number
  totalAccounts: number
  coveredAccounts: number
  reassignments: number
  adHocMoves: number
  quotaRevised: boolean
  changeApproved: boolean
}

export const VERTICAL_NAMES = [
  'Corporate',
  'Government',
  'Non-Profit',
  'Higher Education',
  'Healthcare',
]

export const MANAGER_NAMES = [
  'A. Okafor',
  'B. Nguyen',
  'C. Alvarez',
  'D. Patel',
  'E. Rossi',
]

export const TERRITORIES = [
  'Pacific NW',
  'California',
  'Southwest',
  'Mountain',
  'Great Plains',
  'Great Lakes',
  'Southeast',
  'Mid-Atlantic',
  'Northeast',
  'South Central',
]

const FIRST = [
  'Maya', 'Liam', 'Sofia', 'Noah', 'Ava', 'Ethan', 'Zoe', 'Lucas',
  'Iris', 'Owen', 'Nina', 'Jack', 'Priya', 'Diego', 'Hana', 'Ravi',
  'Elena', 'Kai', 'Mara', 'Theo', 'Yara', 'Cole', 'Lena', 'Finn',
  'Aria', 'Milo', 'Sana', 'Reid', 'Tara', 'Beau', 'Nova', 'Jonah',
  'Isla', 'Dean', 'Rosa', 'Wren', 'Gia', 'Seth', 'Lux', 'Cruz',
]
const LAST = [
  'Reyes', 'Kim', 'Bauer', 'Odom', 'Frost', 'Nair', 'Vance', 'Hale',
  'Cross', 'Mora', 'Webb', 'Lang', 'Diaz', 'Shaw', 'Roy', 'Pace',
  'Quinn', 'Bell', 'Fox', 'Ito', 'Cabe', 'Nash', 'Wolfe', 'Dunn',
  'Park', 'Ruiz', 'Snow', 'Beck', 'Tate', 'Lowe', 'Voss', 'Aoki',
  'Marsh', 'Cano', 'Ford', 'Hunt', 'Gray', 'Rhee', 'Blum', 'Cyr',
]

// --- seeded RNG (mulberry32) ---------------------------------------------
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildReps(): Rep[] {
  const rand = mulberry32(20260720)
  const between = (lo: number, hi: number) => lo + rand() * (hi - lo)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]

  const reps: Rep[] = []
  for (let i = 0; i < 40; i++) {
    const territory = TERRITORIES[i % TERRITORIES.length]
    const assignment: Assignment = rand() < 0.75 ? 'Permanent' : 'Temporary'
    const tier: Tier = rand() < 0.4 ? 'A' : rand() < 0.75 ? 'B' : 'C'

    const adjustedQuota = Math.round(between(1.2, 3.5) * 1_000_000)
    const attainRatio = between(0.58, 1.16)
    const currentARR = Math.round(adjustedQuota * attainRatio)
    const currentAUM = Math.round(currentARR * between(3, 6))
    const aumTarget = Math.round(currentAUM * between(0.85, 1.18))

    const nbb = Math.round(currentARR * between(0.18, 0.42))
    const sam = Math.round(nbb * between(2.4, 3.8))
    const tam = Math.round(sam * between(3, 6))

    const mqls = Math.round(between(60, 320))
    const meetings = Math.round(mqls * between(0.28, 0.52))

    const territoryScore = Math.round(between(45, 95))
    const scoreTrend = Math.round(between(-8, 10))
    const rampMonths = Math.round(between(1, 20))

    const totalAccounts = Math.round(between(60, 170))
    const coveredAccounts = Math.round(totalAccounts * between(0.55, 0.95))

    const reassignments = Math.round(between(0, 6))
    const adHocMoves = Math.round(reassignments * between(0, 0.5))
    const quotaRevised = rand() < 0.11
    const changeApproved = rand() < 0.93

    reps.push({
      id: `rep-${i + 1}`,
      name: `${FIRST[i]} ${LAST[i]}`,
      manager: MANAGER_NAMES[i % MANAGER_NAMES.length],
      territory,
      vertical: pick(VERTICAL_NAMES),
      tier,
      assignment,
      adjustedQuota,
      currentARR,
      currentAUM,
      aumTarget,
      nbb,
      sam,
      tam,
      mqls,
      meetings,
      territoryScore,
      scoreTrend,
      rampMonths,
      totalAccounts,
      coveredAccounts,
      reassignments,
      adHocMoves,
      quotaRevised,
      changeApproved,
    })
  }
  return reps
}

export const REPS: Rep[] = buildReps()

// --- generic helpers ------------------------------------------------------
export function sum<T>(arr: T[], sel: (t: T) => number): number {
  return arr.reduce((a, t) => a + sel(t), 0)
}
export function avg<T>(arr: T[], sel: (t: T) => number): number {
  return arr.length ? sum(arr, sel) / arr.length : 0
}
export function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {}
  for (const t of arr) {
    const k = key(t)
    ;(out[k] ??= []).push(t)
  }
  return out
}

// --- formatters -----------------------------------------------------------
export function fmtNumber(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}
export function fmtPct(n: number, decimals = 0): string {
  return `${n.toFixed(decimals)}%`
}
export function fmtCurrency(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`
  return `${sign}$${Math.round(abs)}`
}

// --- per-rep health -------------------------------------------------------
export function healthOf(r: Rep): { label: string; tone: Tone } {
  const ratio = r.currentARR / r.adjustedQuota
  if (ratio >= 0.95) return { label: 'On track', tone: 'success' }
  if (ratio >= 0.8) return { label: 'At risk', tone: 'warning' }
  return { label: 'Below plan', tone: 'critical' }
}

// --- territory loads (aggregated per territory) ---------------------------
const CAPACITY_PER_REP = 120

export interface TerritoryLoad {
  territory: string
  reps: number
  accounts: number
  accountsPerRep: number
  quotaPerRep: number
  loadIndex: number
  whitespace: number
  status: 'overloaded' | 'underutilized' | 'balanced'
}

export function territoryLoads(reps: Rep[]): TerritoryLoad[] {
  const groups = groupBy(reps, (r) => r.territory)
  return TERRITORIES.filter((t) => groups[t]?.length).map((territory) => {
    const group = groups[territory]
    const accounts = sum(group, (r) => r.totalAccounts)
    const accountsPerRep = accounts / group.length
    const loadIndex = Math.round((accountsPerRep / CAPACITY_PER_REP) * 100)
    const whitespace = sum(group, (r) => r.totalAccounts - r.coveredAccounts)
    const status =
      loadIndex >= 118
        ? 'overloaded'
        : loadIndex <= 82
          ? 'underutilized'
          : 'balanced'
    return {
      territory,
      reps: group.length,
      accounts,
      accountsPerRep,
      quotaPerRep: sum(group, (r) => r.adjustedQuota) / group.length,
      loadIndex,
      whitespace,
      status,
    }
  })
}

// --- revenue & quota ------------------------------------------------------
export function territoryAttainment(reps: Rep[]): {
  onPlan: number
  total: number
  pct: number
  tone: Tone
} {
  const groups = groupBy(reps, (r) => r.territory)
  const terrs = Object.values(groups)
  let onPlan = 0
  for (const g of terrs) {
    const ratio = sum(g, (r) => r.currentARR) / sum(g, (r) => r.adjustedQuota)
    if (ratio >= 0.9) onPlan++
  }
  const total = terrs.length
  const pct = total ? (onPlan / total) * 100 : 0
  return {
    onPlan,
    total,
    pct,
    tone: pct >= 70 ? 'success' : pct >= 50 ? 'warning' : 'critical',
  }
}

export function samCapture(reps: Rep[]): {
  pct: number
  unrealized: number
  tone: Tone
} {
  const booked = sum(reps, (r) => r.nbb)
  const total = sum(reps, (r) => r.sam)
  const pct = total ? (booked / total) * 100 : 0
  return {
    pct,
    unrealized: Math.max(0, total - booked),
    tone: pct >= 40 ? 'success' : pct >= 28 ? 'warning' : 'critical',
  }
}

export function monthlyTrend(reps: Rep[]): {
  month: string
  arr: number
  quota: number
  aum: number
}[] {
  const arr = sum(reps, (r) => r.currentARR)
  const quota = sum(reps, (r) => r.adjustedQuota)
  const aum = sum(reps, (r) => r.currentAUM)
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const rand = mulberry32(77)
  return months.map((month, i) => {
    const t = (i + 1) / months.length
    const wobble = 0.94 + rand() * 0.1
    return {
      month,
      arr: Math.round(arr * t * wobble),
      quota: Math.round((quota / 12) * (i + 4)),
      aum: Math.round(aum * t * (0.9 + rand() * 0.12)),
    }
  })
}

// --- coverage -------------------------------------------------------------
export function penetrationRate(reps: Rep[]): { pct: number; tone: Tone } {
  const covered = sum(reps, (r) => r.coveredAccounts)
  const total = sum(reps, (r) => r.totalAccounts)
  const pct = total ? (covered / total) * 100 : 0
  return { pct, tone: pct >= 85 ? 'success' : pct >= 70 ? 'warning' : 'critical' }
}

export interface StateCoverage {
  code: string
  name: string
  territory: string
  status: 'covered' | 'temporary' | 'unallocated'
  owner?: string
  priority: boolean
}

// Fixed state → territory mapping (3 states per territory).
const STATE_TABLE: {
  code: string
  name: string
  territory: string
  priority: boolean
}[] = [
  { code: 'WA', name: 'Washington', territory: 'Pacific NW', priority: true },
  { code: 'OR', name: 'Oregon', territory: 'Pacific NW', priority: false },
  { code: 'ID', name: 'Idaho', territory: 'Pacific NW', priority: false },
  { code: 'CA', name: 'California', territory: 'California', priority: true },
  { code: 'NV', name: 'Nevada', territory: 'California', priority: false },
  { code: 'HI', name: 'Hawaii', territory: 'California', priority: false },
  { code: 'AZ', name: 'Arizona', territory: 'Southwest', priority: true },
  { code: 'NM', name: 'New Mexico', territory: 'Southwest', priority: false },
  { code: 'UT', name: 'Utah', territory: 'Southwest', priority: false },
  { code: 'CO', name: 'Colorado', territory: 'Mountain', priority: true },
  { code: 'MT', name: 'Montana', territory: 'Mountain', priority: false },
  { code: 'WY', name: 'Wyoming', territory: 'Mountain', priority: false },
  { code: 'MN', name: 'Minnesota', territory: 'Great Plains', priority: false },
  { code: 'MO', name: 'Missouri', territory: 'Great Plains', priority: false },
  { code: 'KS', name: 'Kansas', territory: 'Great Plains', priority: false },
  { code: 'IL', name: 'Illinois', territory: 'Great Lakes', priority: true },
  { code: 'MI', name: 'Michigan', territory: 'Great Lakes', priority: false },
  { code: 'OH', name: 'Ohio', territory: 'Great Lakes', priority: true },
  { code: 'FL', name: 'Florida', territory: 'Southeast', priority: true },
  { code: 'GA', name: 'Georgia', territory: 'Southeast', priority: true },
  { code: 'NC', name: 'North Carolina', territory: 'Southeast', priority: false },
  { code: 'VA', name: 'Virginia', territory: 'Mid-Atlantic', priority: false },
  { code: 'MD', name: 'Maryland', territory: 'Mid-Atlantic', priority: false },
  { code: 'PA', name: 'Pennsylvania', territory: 'Mid-Atlantic', priority: true },
  { code: 'NY', name: 'New York', territory: 'Northeast', priority: true },
  { code: 'MA', name: 'Massachusetts', territory: 'Northeast', priority: true },
  { code: 'CT', name: 'Connecticut', territory: 'Northeast', priority: false },
  { code: 'TX', name: 'Texas', territory: 'South Central', priority: true },
  { code: 'LA', name: 'Louisiana', territory: 'South Central', priority: false },
  { code: 'OK', name: 'Oklahoma', territory: 'South Central', priority: false },
]

export function stateCoverage(reps: Rep[]): StateCoverage[] {
  const groups = groupBy(reps, (r) => r.territory)
  const rand = mulberry32(4242)
  return STATE_TABLE.map((s) => {
    const group = groups[s.territory] ?? []
    const perm = group.filter((r) => r.assignment === 'Permanent')
    const temp = group.filter((r) => r.assignment === 'Temporary')
    const roll = rand()
    let status: StateCoverage['status']
    let owner: string | undefined
    if (perm.length && roll < 0.68) {
      status = 'covered'
      owner = perm[Math.floor(rand() * perm.length)].name
    } else if (temp.length && roll < 0.85) {
      status = 'temporary'
      owner = temp[Math.floor(rand() * temp.length)].name
    } else if (perm.length && roll < 0.9) {
      status = 'covered'
      owner = perm[0].name
    } else {
      status = 'unallocated'
    }
    return { ...s, status, owner }
  })
}

export function coverageGap(reps: Rep[]): {
  pct: number
  unowned: number
  tone: Tone
} {
  const states = stateCoverage(reps)
  const unowned = states.filter((s) => s.status === 'unallocated').length
  const pct = states.length ? (unowned / states.length) * 100 : 0
  return {
    pct,
    unowned,
    tone: pct >= 15 ? 'critical' : pct >= 5 ? 'warning' : 'success',
  }
}

// --- productivity ---------------------------------------------------------
export function rampMetrics(reps: Rep[]): {
  avgRamp: number
  benchmark: number
  overBenchmark: number
  tone: Tone
} {
  const benchmark = 6
  const avgRamp = avg(reps, (r) => r.rampMonths)
  const overBenchmark = reps.filter((r) => r.rampMonths > benchmark).length
  return {
    avgRamp,
    benchmark,
    overBenchmark,
    tone:
      avgRamp <= benchmark
        ? 'success'
        : avgRamp <= benchmark + 3
          ? 'warning'
          : 'critical',
  }
}

// --- balance & fairness ---------------------------------------------------
export function capacityBand(reps: Rep[]): {
  within: number
  over: number
  under: number
  pct: number
  tone: Tone
} {
  let within = 0
  let over = 0
  let under = 0
  for (const r of reps) {
    const idx = (r.totalAccounts / CAPACITY_PER_REP) * 100
    if (idx >= 118) over++
    else if (idx <= 82) under++
    else within++
  }
  const pct = reps.length ? (within / reps.length) * 100 : 0
  return {
    within,
    over,
    under,
    pct,
    tone: pct >= 70 ? 'success' : pct >= 55 ? 'warning' : 'critical',
  }
}

export function reassignmentFrequency(reps: Rep[]): {
  total: number
  adHoc: number
  adHocPct: number
  tone: Tone
} {
  const total = sum(reps, (r) => r.reassignments)
  const adHoc = sum(reps, (r) => r.adHocMoves)
  const adHocPct = total ? (adHoc / total) * 100 : 0
  return {
    total,
    adHoc,
    adHocPct,
    tone: adHocPct < 20 ? 'success' : adHocPct < 35 ? 'warning' : 'critical',
  }
}

export function quotaRevisionRate(reps: Rep[]): { pct: number; tone: Tone } {
  const revised = reps.filter((r) => r.quotaRevised).length
  const pct = reps.length ? (revised / reps.length) * 100 : 0
  return { pct, tone: pct < 5 ? 'success' : pct < 15 ? 'warning' : 'critical' }
}

export function approvalCompliance(reps: Rep[]): { pct: number; tone: Tone } {
  const approved = reps.filter((r) => r.changeApproved).length
  const pct = reps.length ? (approved / reps.length) * 100 : 0
  return { pct, tone: pct >= 90 ? 'success' : pct >= 75 ? 'warning' : 'critical' }
}

export interface HirePlanRow {
  territory: string
  accounts: number
  targetPerRep: number
  holdersNow: number
  ideal: number
  add: number
  uncovered: number
  action: 'Hire' | 'Backfill (TBH)' | 'Hold'
}

export function hiringPlan(reps: Rep[]): {
  hireGap: number
  idealHolders: number
  currentHolders: number
  openCoverage: number
  uncoveredOpportunity: number
  rows: HirePlanRow[]
} {
  const loads = territoryLoads(reps)
  const groups = groupBy(reps, (r) => r.territory)
  const rows: HirePlanRow[] = loads.map((l) => {
    const group = groups[l.territory]
    const ideal = Math.max(1, Math.ceil(l.accounts / CAPACITY_PER_REP))
    const holdersNow = l.reps
    const add = Math.max(0, ideal - holdersNow)
    const avgAcv =
      sum(group, (r) => r.nbb) / Math.max(1, sum(group, (r) => r.coveredAccounts))
    const uncovered = Math.round(l.whitespace * avgAcv)
    const action: HirePlanRow['action'] =
      add >= 2 ? 'Hire' : add === 1 ? 'Backfill (TBH)' : 'Hold'
    return {
      territory: l.territory,
      accounts: l.accounts,
      targetPerRep: CAPACITY_PER_REP,
      holdersNow,
      ideal,
      add,
      uncovered,
      action,
    }
  })
  return {
    hireGap: sum(rows, (r) => r.add),
    idealHolders: sum(rows, (r) => r.ideal),
    currentHolders: sum(rows, (r) => r.holdersNow),
    openCoverage: rows.filter((r) => r.add > 0).length,
    uncoveredOpportunity: sum(
      rows.filter((r) => r.add > 0),
      (r) => r.uncovered,
    ),
    rows,
  }
}
