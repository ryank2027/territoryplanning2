// Territory Planning content model (synthetic, illustrative).
// Shared across Segmentation (6.2.1), Scoring (6.2.2), and Coverage (6.2.3).

import type { BusinessUnit } from '@/components/workspace/workspace-provider'

// ---- Geography hierarchy (6.2.1) ----------------------------------------

export interface GeoLevel {
  level: string
  name: string
  detail: string
  example: string
}

export const GEO_HIERARCHY: GeoLevel[] = [
  {
    level: 'Level 1',
    name: 'Global Region',
    detail: 'Top of the tree — Americas, EMEA, APAC. Identical across every BU for clean roll-up.',
    example: 'Americas',
  },
  {
    level: 'Level 2',
    name: 'Country',
    detail: 'The national market within a global region.',
    example: 'United States',
  },
  {
    level: 'Level 3',
    name: 'State Region',
    detail: 'Reporting grouping of states — West, Central, East, Canada.',
    example: 'West',
  },
  {
    level: 'Level 4',
    name: 'State',
    detail: 'Primary boundary unit that carries into every downstream cut.',
    example: 'California',
  },
  {
    level: 'Level 5',
    name: 'ZIP3',
    detail: 'Finest cut — first 3 ZIP digits keep books contiguous and drive-time efficient.',
    example: '941xx',
  },
]

// ---- BU segmentation explorer (6.2.1) -----------------------------------

export interface SegmentationCut {
  step: number
  label: string
  note: string
}

export interface BuSegmentation {
  id: BusinessUnit
  name: string
  thesis: string
  cuts: SegmentationCut[]
  guardrail: string
}

export const BU_SEGMENTATION: Record<BusinessUnit, BuSegmentation> = {
  commercial: {
    id: 'commercial',
    name: 'Commercial',
    thesis:
      'Balanced market books on a shared geographic + vertical framework; move away from AM/DS-based territory names.',
    cuts: [
      { step: 1, label: 'Geography', note: 'Region → state → DMA backbone.' },
      { step: 2, label: 'Industry / Vertical', note: 'Group accounts by target vertical.' },
      {
        step: 3,
        label: 'Company Size & Potential',
        note: 'Account complexity refines the book.',
      },
    ],
    guardrail:
      'Keep the top geography levels shared with every other BU so reporting rolls up cleanly.',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    thesis:
      'Protect durable parent relationships while balancing strategic opportunity and workload.',
    cuts: [
      {
        step: 1,
        label: 'Parent Account / Industry',
        note: 'Unit of segmentation is the whole corporate family (one ultimate parent, e.g. "Dell Inc").',
      },
      { step: 2, label: 'Geography', note: 'Applied under the parent family.' },
      {
        step: 3,
        label: 'Company Size',
        note: 'With an expansion / emerging / new-logo tiering overlay by value.',
      },
    ],
    guardrail:
      'Do not use a single revenue threshold (e.g. one $750M cutoff) as the sole Enterprise/Commercial line. Define Enterprise with a durable multi-attribute rule (parent-child family, a named list like Fortune 1000, or deal complexity) so the boundary is stable year over year.',
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality Cloud',
    thesis:
      'Anchor ownership in venue type and geography, then layer strategic relationships.',
    cuts: [
      { step: 1, label: 'Geography', note: 'Shared top-level geography backbone.' },
      {
        step: 2,
        label: 'Product & Venue Type',
        note: 'Branded/enterprise vs. independent property, CVB, convention center.',
      },
      {
        step: 3,
        label: 'Meeting Space & Potential',
        note: 'Meeting space = physical square footage of meeting/event rooms.',
      },
    ],
    guardrail:
      'HC will not run on one default path. Preserve room for account type, management-company affiliation, geography, venue type, and spend as valid cuts for different sub-teams, all sharing the same geography backbone.',
  },
}

export const BU_ORDER: BusinessUnit[] = ['commercial', 'enterprise', 'hospitality']

// ---- Segmentation design guardrails (6.2.1) -----------------------------

export interface Guardrail {
  title: string
  body: string
}

export const SEGMENTATION_GUARDRAILS: Guardrail[] = [
  {
    title: 'Standardize the top of the hierarchy',
    body: 'Keep the top 2–4 geography levels identical across every BU for consistent roll-up reporting.',
  },
  {
    title: 'Map roles to the territory, not to people',
    body: 'SEs, overlays, and product specialists map to the territory container; a successor inherits the territory and its overlays automatically.',
  },
  {
    title: 'Sequence strategy before structure',
    body: 'Territory methodology follows sales strategy and coverage design, not the reverse.',
  },
  {
    title: 'Plan for non-sales teams',
    body: 'Customer-facing non-sales teams (e.g. Client Success) sit on the same hierarchical model once core sales segmentation is stable.',
  },
  {
    title: 'Version and govern the model',
    body: 'Log every segmentation model as a versioned record; revisit only at the defined refinement cadence.',
  },
]

// ---- Scenario impact findings (6.2.1) -----------------------------------

/** Returns validation findings for a perturbed dimension sequence. */
export function segmentationFindings(
  enabled: Record<string, boolean>,
  order: string[],
): { tone: 'warn' | 'ok'; text: string }[] {
  const findings: { tone: 'warn' | 'ok'; text: string }[] = []

  if (enabled.Geography === false) {
    findings.push({
      tone: 'warn',
      text: 'Geography disabled → territory boundaries are not executable in Salesforce.',
    })
  } else if (order[0] !== 'Geography') {
    findings.push({
      tone: 'warn',
      text: 'Geography is not the first cut → books may not stay contiguous or roll up cleanly.',
    })
  }

  const activeCount = Object.values(enabled).filter(Boolean).length
  if (activeCount <= 1) {
    findings.push({
      tone: 'warn',
      text: 'Only one active dimension → books will be coarse and hard to balance on effort.',
    })
  }

  if (findings.length === 0) {
    findings.push({
      tone: 'ok',
      text: 'Sequence is executable: geography anchors the tree and downstream cuts refine the book.',
    })
  }

  return findings
}

// ---- Account Scoring (6.2.2) --------------------------------------------

export interface ScoreFactor {
  label: string
  detail: string
}

export const ICP_FACTORS: ScoreFactor[] = [
  { label: 'Company size', detail: 'Employee count / revenue band vs. ICP.' },
  { label: 'Industry / vertical match', detail: 'Target vertical alignment.' },
  { label: 'Geography fit', detail: 'In-territory, serviceable region.' },
  { label: 'Firmographic profile match', detail: 'Structure and buying-center fit.' },
]

export const POTENTIAL_FACTORS: ScoreFactor[] = [
  { label: 'Average contract value', detail: 'Expected ACV band.' },
  { label: 'Whitespace', detail: 'SAM/TAM gap vs. current spend.' },
  { label: 'Intent signals', detail: 'Trade-show attendance, product/web engagement.' },
  { label: 'Growth trajectory', detail: 'Trend in size and spend.' },
    { label: 'Meeting space', detail: 'Hospitality only: event square footage.' },
]

export interface Tier {
  tier: 'A' | 'B' | 'C'
  range: string
  min: number
  definition: string
  cadence: string
}

export const TIERS: Tier[] = [
  { tier: 'A', range: '90–100', min: 90, definition: 'Top priority', cadence: 'Weekly' },
  {
    tier: 'B',
    range: '60–89',
    min: 60,
    definition: 'Develop',
    cadence: 'Bi-weekly / monthly',
  },
  {
    tier: 'C',
    range: '< 60',
    min: 0,
    definition: 'Nurture / monitor',
    cadence: 'Quarterly or pooled / digital touch',
  },
]

export function tierForScore(score: number): Tier {
  if (score >= 90) return TIERS[0]
  if (score >= 60) return TIERS[1]
  return TIERS[2]
}

/** Geographic region used by the territory map. */
export type MapRegion = 'West' | 'Central' | 'East' | 'Canada'

/** Sample accounts for the interactive score builder and territory map. */
export interface SampleAccount {
  id: string
  name: string
  bu: string
  icpFitment: number
  potential: number
  /** US state name matching us-atlas naming (e.g. "California"). */
  geography: string
  /** DMA / metro market within the state (Level 3 of the geo hierarchy). */
  dma?: string
  region: MapRegion
  /** Level 1 of the geo hierarchy — global region (e.g. "Americas"). */
  globalRegion?: string
  /** Level 2 of the geo hierarchy — country (e.g. "United States"). */
  country?: string
  /** Level 3 of the geo hierarchy — state region (West / Central / East / Canada). */
  stateRegion?: MapRegion
  /** Level 4 of the geo hierarchy — full state name (mirrors `geography`). */
  state?: string
  /** Level 5 of the geo hierarchy — first 3 digits of the ZIP (e.g. "941"). */
  zip3?: string
  /** Industry / vertical cut value (Commercial + Enterprise). */
  vertical?: string
  /** Company size / potential band cut value (all BUs). */
  sizeBand?: string
  /** Product & venue type cut value (Hospitality Cloud). */
  venueType?: string
  /** Meeting space square-footage band (Hospitality Cloud). */
  meetingSpace?: string
  /** Flagged as relocated in the current scenario. */
  moved?: boolean
}

export const SAMPLE_ACCOUNTS: SampleAccount[] = [
  // Commercial — Geography → Industry/Vertical → Company Size
  { id: 'aster', name: 'Aster Labs', bu: 'Commercial', icpFitment: 92, potential: 88, geography: 'California', region: 'West', vertical: 'Technology', sizeBand: 'Mid-Market' },
  { id: 'delta', name: 'Delta Union Co.', bu: 'Commercial', icpFitment: 45, potential: 38, geography: 'Texas', region: 'Central', vertical: 'Retail', sizeBand: 'SMB', moved: true },
  { id: 'ember', name: 'Ember Retail', bu: 'Commercial', icpFitment: 71, potential: 66, geography: 'Illinois', region: 'Central', vertical: 'Healthcare', sizeBand: 'Mid-Market' },
  { id: 'slate', name: 'Slate Digital', bu: 'Commercial', icpFitment: 80, potential: 76, geography: 'Arizona', region: 'West', vertical: 'Technology', sizeBand: 'Enterprise' },
  // Enterprise — Parent Account/Industry → Geography → Company Size
  { id: 'beacon', name: 'Beacon Works', bu: 'Enterprise', icpFitment: 78, potential: 71, geography: 'New York', region: 'East', vertical: 'Financial Services', sizeBand: 'Enterprise' },
  { id: 'fjord', name: 'Fjord Logistics', bu: 'Enterprise', icpFitment: 83, potential: 79, geography: 'Washington', region: 'West', vertical: 'Manufacturing', sizeBand: 'Enterprise' },
  { id: 'gale', name: 'Gale Medical', bu: 'Enterprise', icpFitment: 58, potential: 61, geography: 'Georgia', region: 'East', vertical: 'Healthcare', sizeBand: 'Mid-Market' },
  { id: 'ironwood', name: 'Ironwood Corp', bu: 'Enterprise', icpFitment: 74, potential: 70, geography: 'Ohio', region: 'Central', vertical: 'Financial Services', sizeBand: 'Enterprise' },
  // Hospitality Cloud — Geography → Product & Venue Type → Meeting Space
  { id: 'cedar', name: 'Cedar Grove Resorts', bu: 'Hospitality Cloud', icpFitment: 64, potential: 52, geography: 'Florida', region: 'East', venueType: 'Independent', sizeBand: 'Mid-Market' },
  { id: 'harbor', name: 'Harbor Events', bu: 'Hospitality Cloud', icpFitment: 69, potential: 74, geography: 'Colorado', region: 'West', venueType: 'Branded / Enterprise', sizeBand: 'Enterprise', moved: true },
  { id: 'marigold', name: 'Marigold Resorts', bu: 'Hospitality Cloud', icpFitment: 55, potential: 49, geography: 'Nevada', region: 'West', venueType: 'CVB', sizeBand: 'SMB' },
  { id: 'summit', name: 'Summit Convention', bu: 'Hospitality Cloud', icpFitment: 67, potential: 72, geography: 'Illinois', region: 'Central', venueType: 'Convention Center', sizeBand: 'Enterprise' },
]

// ---- Segmentation cut encoding for the territory map --------------------

/** The account attribute a given segmentation cut maps to. */
export type CutAttribute =
  | 'region'
  | 'vertical'
  | 'sizeBand'
  | 'venueType'
  | 'meetingSpace'

export interface CutCategory {
  value: string
  color: string
}

/** Category palette per cut attribute (Cvent 2026 brand tokens as literals). */
export const CUT_CATEGORIES: Record<CutAttribute, CutCategory[]> = {
  region: [
    { value: 'West', color: '#7FD8DE' },
    { value: 'Central', color: '#34C3CC' },
    { value: 'East', color: '#00B8C5' },
    { value: 'Canada', color: '#C9D6D2' },
  ],
  vertical: [
    { value: 'Technology', color: '#00B8C5' },
    { value: 'Healthcare', color: '#01EF6C' },
    { value: 'Financial Services', color: '#34C3CC' },
    { value: 'Retail', color: '#C7F522' },
    { value: 'Manufacturing', color: '#8EA79F' },
  ],
  sizeBand: [
    { value: 'SMB', color: '#7FD8DE' },
    { value: 'Mid-Market', color: '#34C3CC' },
    { value: 'Enterprise', color: '#00B8C5' },
  ],
  venueType: [
    { value: 'Branded / Enterprise', color: '#00B8C5' },
    { value: 'Independent', color: '#34C3CC' },
    { value: 'CVB', color: '#C7F522' },
    { value: 'Convention Center', color: '#8EA79F' },
  ],
  meetingSpace: [
    { value: '< 10k sqft', color: '#7FD8DE' },
    { value: '10-50k sqft', color: '#34C3CC' },
    { value: '50k+ sqft', color: '#00B8C5' },
  ],
}

/** Ordered size bands (small → large) for bubble-radius encoding. */
export const SIZE_BAND_ORDER = ['SMB', 'Mid-Market', 'Enterprise']
export const MEETING_SPACE_ORDER = ['< 10k sqft', '10-50k sqft', '50k+ sqft']

/** Maps a BU cut label (from BU_SEGMENTATION) to an account attribute. */
export function cutAttribute(label: string): CutAttribute {
  const l = label.toLowerCase()
  if (l.includes('geograph')) return 'region'
  if (l.includes('venue') || l.includes('product')) return 'venueType'
  if (l.includes('meeting space')) return 'meetingSpace'
  if (l.includes('size')) return 'sizeBand'
  return 'vertical'
}

/** Reads the category value of an account for a given cut attribute. */
export function accountCutValue(a: SampleAccount, attr: CutAttribute): string {
  if (attr === 'region') return a.region
  return a[attr] ?? 'Unspecified'
}

// ---- Dense map fixtures: several accounts per state ---------------------
// A dedicated dataset (kept separate from the score-builder's SAMPLE_ACCOUNTS)
// so the territory map shows multiple markers per state and each cut reads as
// an obvious, well-clustered segmentation. Generated deterministically so
// server and client renders stay identical.

const NAME_BASES = [
  'Aster', 'Beacon', 'Cedar', 'Delta', 'Ember', 'Fjord', 'Gale', 'Harbor',
  'Ironwood', 'Juniper', 'Kestrel', 'Lumen', 'Marigold', 'Nimbus', 'Orchard',
  'Pinnacle', 'Quarry', 'Riverstone', 'Slate', 'Summit', 'Trellis', 'Umbra',
  'Vertex', 'Willow', 'Yarrow', 'Zephyr',
]
const NAME_SUFFIX = [
  'Labs', 'Group', 'Partners', 'Systems', 'Co.', 'Holdings', 'Works',
  'Digital', 'Ventures', 'Collective',
]
const SIZE_BANDS = ['SMB', 'Mid-Market', 'Enterprise']

/**
 * DMAs (designated market areas / metros) per state — Level 3 of the
 * Country → Region → State → DMA geographic backbone. Accounts are distributed
 * across a state's DMAs so drilling into a state reveals its metro clusters.
 */
export const DMA_BY_STATE: Record<string, string[]> = {
  California: ['Los Angeles', 'San Francisco Bay Area', 'San Diego'],
  Washington: ['Seattle–Tacoma', 'Spokane'],
  Texas: ['Dallas–Ft. Worth', 'Houston', 'Austin'],
  Illinois: ['Chicago', 'Springfield'],
  'New York': ['New York City', 'Buffalo'],
  Georgia: ['Atlanta', 'Savannah'],
  Massachusetts: ['Boston', 'Western Mass'],
  Ohio: ['Cleveland–Akron', 'Columbus'],
  Florida: ['Miami–Ft. Lauderdale', 'Orlando', 'Tampa Bay'],
  Nevada: ['Las Vegas', 'Reno'],
  Colorado: ['Denver', 'Colorado Springs'],
  Arizona: ['Phoenix', 'Tucson'],
}

/**
 * Representative 3-digit ZIP prefix (ZIP3) per DMA — Level 5 (leaf) of the
 * geographic backbone. Real ZIP3/SCF polygons aren't available, so each metro
 * is given its dominant ZIP3 and accounts inherit it from their DMA.
 */
export const ZIP3_BY_DMA: Record<string, string> = {
  'Los Angeles': '900',
  'San Francisco Bay Area': '941',
  'San Diego': '920',
  'Seattle–Tacoma': '981',
  Spokane: '992',
  'Dallas–Ft. Worth': '752',
  Houston: '770',
  Austin: '787',
  Chicago: '606',
  Springfield: '627',
  'New York City': '100',
  Buffalo: '142',
  Atlanta: '303',
  Savannah: '314',
  Boston: '021',
  'Western Mass': '010',
  'Cleveland–Akron': '441',
  Columbus: '432',
  'Miami–Ft. Lauderdale': '331',
  Orlando: '328',
  'Tampa Bay': '335',
  'Las Vegas': '891',
  Reno: '895',
  Denver: '802',
  'Colorado Springs': '809',
  Phoenix: '850',
  Tucson: '857',
}

/** Meeting-space footprint that typically maps to each venue type. */
const MEETING_SPACE_BY_VENUE: Record<string, string> = {
  'Branded / Enterprise': '50k+ sqft',
  'Convention Center': '50k+ sqft',
  CVB: '10-50k sqft',
  Independent: '< 10k sqft',
}

interface StateSeed {
  state: string
  region: MapRegion
  /** Dominant category value for accounts in this state. */
  lean: string
}

function buildMapAccounts(
  bu: string,
  attr: 'vertical' | 'venueType',
  seeds: StateSeed[],
  /** Accounts generated per DMA / ZIP3 — the density of each geo leaf. */
  perDma: number,
): SampleAccount[] {
  const out: SampleAccount[] = []
  let g = 0
  const cats = CUT_CATEGORIES[attr].map((c) => c.value)
  seeds.forEach((seed, si) => {
    const dmas = DMA_BY_STATE[seed.state] ?? [seed.state]
    const others = cats.filter((v) => v !== seed.lean)
    // Generate a full book of accounts inside every DMA (ZIP3), so drilling to
    // a single ZIP still reveals a rich, multi-industry, multi-size portfolio.
    dmas.forEach((dma, di) => {
      for (let i = 0; i < perDma; i++) {
        const seedNum = si * 101 + di * 31 + i * 7
        // Bias toward the state's dominant category, but guarantee that every
        // ZIP3 also contains a spread of other industries / verticals so the
        // Industry cut reads as a real mix after zooming in.
        const cat = i % 3 === 0 ? seed.lean : others[(di + i) % others.length]
        // Cycle through every size band so each ZIP3 spans SMB → Enterprise and
        // the downstream Company Size cut always has something to filter.
        const sizeBand = SIZE_BANDS[(di * 2 + i) % SIZE_BANDS.length]
        const account: SampleAccount = {
          id: `${bu[0].toLowerCase()}${si}-${di}-${i}`,
          name: `${NAME_BASES[g % NAME_BASES.length]} ${
            NAME_SUFFIX[Math.floor(g / NAME_BASES.length) % NAME_SUFFIX.length]
          }`,
          bu,
          icpFitment: 52 + ((seedNum * 17 + 11) % 44),
          potential: 46 + ((seedNum * 23 + 7) % 50),
          geography: seed.state,
          // Level 3 of the geo backbone — the DMA / metro.
          dma,
          region: seed.region,
          // Full five-level geographic backbone.
          globalRegion: 'Americas',
          country: 'United States',
          stateRegion: seed.region,
          state: seed.state,
          zip3: ZIP3_BY_DMA[dma] ?? '000',
          sizeBand,
          moved: g % 11 === 4,
        }
        if (attr === 'vertical') {
          account.vertical = cat
        } else {
          account.venueType = cat
          // Meeting space correlates with venue type, with realistic variation.
          account.meetingSpace = MEETING_SPACE_BY_VENUE[cat] ?? '10-50k sqft'
        }
        out.push(account)
        g++
      }
    })
  })
  return out
}

export const MAP_ACCOUNTS: SampleAccount[] = [
  ...buildMapAccounts(
    'Commercial',
    'vertical',
    [
      { state: 'California', region: 'West', lean: 'Technology' },
      { state: 'Washington', region: 'West', lean: 'Technology' },
      { state: 'Texas', region: 'Central', lean: 'Retail' },
      { state: 'Illinois', region: 'Central', lean: 'Healthcare' },
      { state: 'New York', region: 'East', lean: 'Financial Services' },
      { state: 'Georgia', region: 'East', lean: 'Manufacturing' },
    ],
    8,
  ),
  ...buildMapAccounts(
    'Enterprise',
    'vertical',
    [
      { state: 'New York', region: 'East', lean: 'Financial Services' },
      { state: 'Massachusetts', region: 'East', lean: 'Financial Services' },
      { state: 'Ohio', region: 'Central', lean: 'Manufacturing' },
      { state: 'Illinois', region: 'Central', lean: 'Manufacturing' },
      { state: 'California', region: 'West', lean: 'Technology' },
      { state: 'Washington', region: 'West', lean: 'Technology' },
      { state: 'Georgia', region: 'East', lean: 'Healthcare' },
    ],
    8,
  ),
  ...buildMapAccounts(
    'Hospitality Cloud',
    'venueType',
    [
      { state: 'Florida', region: 'East', lean: 'Independent' },
      { state: 'Nevada', region: 'West', lean: 'CVB' },
      { state: 'Colorado', region: 'West', lean: 'Branded / Enterprise' },
      { state: 'Illinois', region: 'Central', lean: 'Convention Center' },
      { state: 'California', region: 'West', lean: 'Independent' },
      { state: 'Texas', region: 'Central', lean: 'Branded / Enterprise' },
    ],
    8,
  ),
]

// ---- Coverage: Workload Index & Rep Skill Score (6.2.3) -----------------

export interface WeightedComponent {
  weight: number
  label: string
  detail: string
}

export const WORKLOAD_COMPONENTS: WeightedComponent[] = [
  {
    weight: 0.4,
    label: 'Tier-weighted account load',
    detail: 'Counts accounts by A/B/C using touch cadence, so tier mix matters.',
  },
  { weight: 0.3, label: 'ARR / Scale', detail: 'Revenue weight of the book.' },
  { weight: 0.2, label: 'Open opportunity count', detail: 'Active selling effort.' },
  {
    weight: 0.1,
    label: 'Renewal complexity factor',
    detail: 'Products/contracts up for renewal ÷ total active products.',
  },
]

export const REP_SKILL_COMPONENTS: WeightedComponent[] = [
  {
    weight: 0.3,
    label: 'Win / Close rate',
    detail: 'Historical win rate on qualified opportunities.',
  },
  {
    weight: 0.3,
    label: 'Quota attainment consistency',
    detail: 'Consecutive quarters at/above quota.',
  },
  {
    weight: 0.2,
    label: 'Average deal size',
    detail: 'Avg ACV of closed-won, normalized to segment.',
  },
  {
    weight: 0.2,
    label: 'Cross-sell / Upsell depth',
    detail: 'Expansion revenue as % of book.',
  },
]

// ---- Filter-then-Rank walkthrough (6.2.3) -------------------------------

export interface RepCandidate {
  id: string
  name: string
  workloadIndex: number // current, relative to segment avg = 100
  skillScore: number // 0–100
}

export const SEGMENT_AVG_INDEX = 100
export const CAPACITY_CEILING = 110 // 110% of segment average

/** A sample Tier-A account being assigned, and its workload contribution. */
export const SAMPLE_ASSIGNMENT = {
  account: 'Aster Labs (Tier A)',
  contribution: 14, // adds this much to a rep's workload index
}

export const REP_CANDIDATES: RepCandidate[] = [
  { id: 'r1', name: 'J. Okafor', workloadIndex: 88, skillScore: 91 },
  { id: 'r2', name: 'M. Alvarez', workloadIndex: 92, skillScore: 84 },
  { id: 'r3', name: 'S. Chen', workloadIndex: 99, skillScore: 78 },
  { id: 'r4', name: 'D. Novak', workloadIndex: 104, skillScore: 88 },
]

// ---- TBH / vacant container logic (6.2.3) -------------------------------

export interface ContainerRule {
  trigger: string
  logic: string
  permanent: boolean
}

export const CONTAINER_RULES: ContainerRule[] = [
  {
    trigger: 'Fiscal-year headcount planning',
    logic:
      'Stand up the full Ideal Territory Count as pre-built TBH containers, sized off the Workload Index, before reps are hired.',
    permanent: false,
  },
  {
    trigger: 'Rep attrition mid-year',
    logic:
      'Territory becomes vacant; default interim owner is the manager. Apply a guesting rule only where the manager cannot absorb the volume. The container is never dissolved or redistributed.',
    permanent: true,
  },
  {
    trigger: 'New-hire onboarding',
    logic:
      'Slot the hire into the next open TBH container from the pre-built plan, not carved from an existing rep’s book, which minimizes quota/account movement.',
    permanent: false,
  },
  {
    trigger: 'Net-new GTM motion / segment',
    logic:
      'Carve a net-new territory from existing territories using the defined rules. This and attrition are the only two events that trigger a permanent boundary change.',
    permanent: true,
  },
  {
    trigger: 'M&A / bankruptcy',
    logic:
      'Documented exception: quota adjustment allowed outside the materiality threshold.',
    permanent: false,
  },
]

export const QUOTA_GUARDRAILS: Guardrail[] = [
  {
    title: 'Materiality threshold = 10% of quota',
    body: 'Below this, no adjustment is triggered.',
  },
  {
    title: 'No retroactive quota changes',
    body: 'Effective the first day of the next period, never backdated.',
  },
  {
    title: 'Two triggers only',
    body: 'Rep attrition/churn or a net-new GTM motion needing an account carve-out. Everything else routes to the fiscal refinement cadence.',
  },
]

// ---- Coverage model: four-step flow (6.2.3) -----------------------------

export interface CoverageStep {
  step: number
  title: string
  formula: string
  outcome: string
}

export const COVERAGE_MODEL: CoverageStep[] = [
  {
    step: 1,
    title: 'Score the account',
    formula: 'Account Score = 0.50 × ICP Fitment + 0.50 × Potential',
    outcome: 'Produces the A/B/C tier every downstream step reads.',
  },
  {
    step: 2,
    title: 'Size the territory',
    formula:
      'Workload Index = 0.40 × Tier Load + 0.30 × ARR/Scale + 0.20 × Open Opps + 0.10 × Renewal',
    outcome: 'Balances books on effort, revenue, and renewal load, not headcount.',
  },
  {
    step: 3,
    title: 'Match the rep',
    formula:
      'Rep Skill Score = 0.30 × Win/Close + 0.30 × Quota Consistency + 0.20 × Deal Size + 0.20 × Cross-sell',
    outcome: 'Workload Index filters to reps with room; Rep Skill Score ranks among them.',
  },
  {
    step: 4,
    title: 'Guard the model',
    formula: '±10% materiality band · TBH containers · quota governance',
    outcome: 'Caps drift, protects continuity, keeps changes predictable.',
  },
]
