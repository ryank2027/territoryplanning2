// Verbatim content for the four Prerequisites foundation pages plus the
// shared "System of Truth" Inputs/Outputs matrix and Salesforce Translation
// flow (PRD sections 6.1.1 - 6.1.5). Copy here is the client's real content
// and must not be paraphrased. Data is reused by the foundation pages'
// ThreeLenses blocks and the dedicated Inputs / Outputs page.

import {
  Ban,
  Building2,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Globe2,
  Handshake,
  Layers,
  Link2,
  ListChecks,
  MapPin,
  Package,
  Ruler,
  Signal,
  SlidersHorizontal,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { PrereqKey } from '@/components/workspace/workspace-provider'

export interface RequirementItem {
  icon: LucideIcon
  /** optional bold lead-in (used for the three numbered Data elements) */
  title?: string
  body: string
}

/** Define -> stored-in-Salesforce mapping for one prerequisite lane. */
export interface SalesforceLane {
  define: string
  object: string
  fields: string
}

export interface FoundationContent {
  key: PrereqKey
  slug: string
  /** short label used on the readiness gate + hub */
  short: string
  eyebrow: string
  title: string
  lede: string
  capability: string[]
  recommendation: string[]
  ownership: string[]
  requirements: RequirementItem[]
  /** concise "why now" summary for the ThreeLenses rationale lens */
  rationaleSummary: string
  inputs: string[]
  outputs: string[]
  salesforce: SalesforceLane
}

export const FOUNDATIONS: FoundationContent[] = [
  {
    key: 'icp',
    slug: 'icp',
    short: 'Ideal Customer Profile',
    eyebrow: 'Prerequisites: Ideal Customer Profile (ICP)',
    title: 'Ideal Customer Profile (ICP)',
    lede: 'Each BU produces a written ICP that defines what a good target account looks like. It is a shared reference across Sales, RevOps, and territory planning.',
    capability: ['L2.1.1', 'L2.1.2', 'L2.6.1'],
    recommendation: [
      'Each BU produces a written ICP defining what a good target account looks like, owned by BU leadership and used as a shared reference across Sales, RevOps, and territory planning.',
      'Without a consistent, documented ICP per BU, territory segmentation and boundary decisions cannot be made objectively.',
      'ICP criteria must translate into specific Salesforce account fields (revenue band, employee count, industry, and so on). Criteria that cannot be matched to a reliably populated field cannot drive assignment rules at scale.',
    ],
    ownership: [
      'Owned and produced by BU leadership; validated by Sales Strategy against win rate, pipeline conversion, and average deal size.',
      'Set annually as part of AOP; reviewed and reconfirmed each quarter at AOP refresh.',
      'Changes affecting account classification or territory boundaries are flagged to RevOps ahead of time to avoid mid-quarter disruption.',
    ],
    requirements: [
      {
        icon: Target,
        body: 'Which industries, verticals, and account types the BU targets (may differ across Commercial, Enterprise, and HC).',
      },
      {
        icon: Ruler,
        body: 'What size of company it wins with and how that is measured (revenue, employee count, event volume).',
      },
      {
        icon: Ban,
        body: 'What account types to exclude. Exclusion criteria matter as much as inclusion.',
      },
      {
        icon: Signal,
        body: 'Good-fit signals such as buying triggers or typical deal-cycle length.',
      },
      {
        icon: Database,
        body: 'ICP criteria must map to Salesforce fields populated through trusted enrichment sources (D&B, ZoomInfo, or Clay) by segment and geography.',
      },
    ],
    rationaleSummary:
      'A documented, per-BU ICP is what lets segmentation and boundary decisions be made objectively rather than by assumption. Set it annually in AOP and reconfirm each quarter.',
    inputs: [
      'Historical win rate, pipeline conversion, and average deal size by BU',
      'Target industries, geographies, and company-size criteria',
      'Buying triggers and deal-cycle characteristics',
      'Exclusion criteria',
      'Enrichment data (D&B, ZoomInfo, Clay)',
    ],
    outputs: [
      'ICP definition per BU',
      'Buyer-journey archetypes and sales-motion alignment',
      'Standardized segmentation taxonomy (for example, Enterprise Healthcare, Strategic Financial Services)',
      'Accounts flagged for lighter coverage',
    ],
    salesforce: {
      define:
        'BU leadership defines the ICP: target industries, company size, exclusions, and buying triggers.',
      object: 'Account object',
      fields: 'ICP segment, strategic flag, coverage priority',
    },
  },
  {
    key: 'goals',
    slug: 'business-goals',
    short: 'Business Goals & Route to Market',
    eyebrow: 'Prerequisites: Business Goals & Route to Market',
    title: 'Business Goals & Route to Market',
    lede: 'Each BU documents revenue targets, quotas, product priorities, and how they reach their market. These are the direct inputs that determine how territories are sized, structured, and assigned.',
    capability: ['L2.1.1', 'L2.1.2', 'L2.1.4', 'L2.4.1'],
    recommendation: [
      'Each BU documents and aligns on business goals and GTM as part of annual planning: revenue targets, quotas, product priorities, and how they reach their market.',
      'Once confirmed, GTM and goals become the direct inputs that determine how territories are sized, structured, and assigned.',
      'GTM differs across Commercial, Enterprise, and HC and must be recorded, not assumed.',
    ],
    ownership: [
      'Owned by BU sales leadership, aligned with Sales Strategy and Finance.',
      'Set in the annual AOP process; reviewed quarterly alongside the ICP.',
      'Changes to selling motion, coverage ratios, or headcount targets are flagged before territory planning begins.',
    ],
    requirements: [
      {
        icon: Gauge,
        body: 'Revenue targets and quota split between new business and existing customers.',
      },
      {
        icon: Package,
        body: 'Which products and segments are prioritized for the period.',
      },
      {
        icon: Users,
        body: 'Headcount, rep-ramp assumptions, and coverage ratios (including accounts per rep).',
      },
      {
        icon: Globe2,
        body: 'Which geographic markets are being invested in versus maintained, plus expansion priorities.',
      },
      {
        icon: Workflow,
        body: 'Selling motion (hunting new logos, expanding existing, or managing renewals) to determine territory structure.',
      },
    ],
    rationaleSummary:
      'Goals and GTM are the direct inputs to how territories are sized, structured, and assigned. Because GTM differs by BU, it has to be recorded rather than assumed.',
    inputs: [
      'Revenue, quota, and margin targets by BU',
      'Route-to-market model per BU',
      'Target coverage ratios and accounts per rep',
      'Selling motion per BU',
      'Geographic priorities and product prioritization',
    ],
    outputs: [
      'Targets by segment, geography, product, route-to-market, and seller role',
      'BU-specific targets and quotas',
      'Feasible coverage model and capacity assumptions',
      'Annual budget, headcount, hiring plan, rep ramp, and geographic constraints',
      'Priority products and cross-sell motions',
    ],
    salesforce: {
      define:
        'Sales leadership documents GTM: revenue targets, quotas, coverage ratios, and selling motion.',
      object: 'Territory objects',
      fields: 'coverage ratio, quota target',
    },
  },
  {
    key: 'roles',
    slug: 'roles',
    short: 'Roles, Responsibilities & Org Structure',
    eyebrow: 'Prerequisites: Roles, Responsibilities & Org Structure',
    title: 'Roles, Responsibilities & Org Structure',
    lede: 'Before territory design begins, each BU confirms who its sellers and overlays are, what each is accountable for, and how credit and quota are allocated when multiple roles touch one account.',
    capability: ['L2.1.1', 'L2.4.1', 'L2.4.3', 'L2.4.4', 'L2.5.5'],
    recommendation: [
      'Before territory design begins, each BU confirms who its sellers and overlay roles are, what each is accountable for, and how credit and quota are allocated when multiple roles touch one account.',
      'Each BU produces a documented R&R framework specific enough to translate into Salesforce requirements.',
      'Without documented roles and hierarchy, any territory structure reflects assumptions rather than how the business intends to operate.',
    ],
    ownership: [
      'Owned by BU sales leadership with Finance and RevOps input on quota and credit.',
      'Confirmed in annual planning.',
      'Changes to role structure or overlay pairings are flagged to RevOps before the next planning cycle so Salesforce assignments update in a controlled way.',
    ],
    requirements: [
      {
        icon: Users,
        body: 'Which roles are primary sellers versus overlay or support, and what each is accountable for.',
      },
      {
        icon: Link2,
        body: 'How overlay roles are paired to accounts and territories (for example, a strategic account rep at chain versus property level, and what triggers assignment).',
      },
      {
        icon: Handshake,
        body: 'Where quota credit lands when multiple roles are involved. Make it explicit and consistent to avoid commission disputes and double-counting.',
      },
      {
        icon: Layers,
        body: 'Whether AMs have fixed territory assignments or a book-of-business model, a structural decision affecting Salesforce config.',
      },
      {
        icon: GitBranch,
        body: 'How the role hierarchy maps to the territory hierarchy, aligned for forecasting, sharing, and visibility.',
      },
    ],
    rationaleSummary:
      'Documented roles and hierarchy are what keep a territory structure grounded in how the business intends to operate. The R&R framework must be specific enough to translate into Salesforce.',
    inputs: [
      'Seller role definitions (DS, AM, and so on)',
      'Handoff rules between roles',
      'Capacity by role',
      'Org chart and coverage model by BU',
      'Overlay and specialist role definitions',
    ],
    outputs: [
      'RACI for territory management',
      'Clear definition of which role covers which account types and activities',
      'Rules of engagement between teams',
      'User role hierarchy aligned to the Salesforce territory tree',
    ],
    salesforce: {
      define:
        'BU and Finance confirm roles: seller versus overlay, credit split, and book versus territory.',
      object: 'Link / intersection object',
      fields: 'role, access level (links each rep to a territory)',
    },
  },
  {
    key: 'data',
    slug: 'data',
    short: 'Clean, Validated Data',
    eyebrow: 'Prerequisites: Clean, Validated Data',
    title: 'Clean, Validated Data',
    lede: 'Establish a clean, validated account-data foundation before assignment rules can be trusted. Use governed, system-maintained sources rather than manual data prep.',
    capability: ['L2.3.1', 'L2.3.2', 'L2.3.3', 'L2.6.1', 'L2.8.4'],
    recommendation: [
      'Establish a clean, validated account-data foundation as a prerequisite to trusted assignment-rule execution.',
      'Shift assignment inputs away from manually populated upstream fields toward governed, system-maintained sources.',
      'Move to rules that leverage continuously enriched data, eliminating manual data prep before rules run.',
      'Treat this as an enterprise enabler supporting not just territory planning but lead routing, forecasting, account hierarchy, and scoring.',
    ],
    ownership: [
      'Enrichment-vendor selection and MDM architecture owned by IT and Data Architecture with RevOps and Sales Strategy.',
      'Enrichment fields maintained on a defined cadence: monthly minimum, more frequent for high-velocity segments.',
      'Ongoing data-quality monitoring with a named owner for stale or missing data.',
    ],
    requirements: [
      {
        icon: Database,
        title: 'A defined enrichment source feeding key account fields into Salesforce',
        body: 'Territory rule fields (industry, revenue, employee count, geography, company size) reliably enriched and refreshed in Salesforce, not manually researched. Select sources by segment and geography: D&B for U.S. enterprise firmographics and hierarchy; ZoomInfo for commercial and contact enrichment; Clay piloted to fill coverage gaps. A multi-vendor model is likely, and enrichment plus Salesforce writeback must be in place before rules can be trusted.',
      },
      {
        icon: FileText,
        title: 'One governed account-data record',
        body: 'Account data currently spans Salesforce, Snowflake, spreadsheets, and a manually maintained junction table of more than 42,000 rows. Establish an MDM layer that maintains the governed record for each account and feeds downstream systems. Salesforce remains the operational system of record, synchronized with the broader data estate.',
      },
      {
        icon: GitBranch,
        title: 'Deduplication and hierarchy cleanup',
        body: 'Resolve duplicates before rules run, since duplicates cause split assignments, broken roll-ups, and rep distrust. Run a one-time cleanup plus ongoing governance to prevent recurrence.',
      },
    ],
    rationaleSummary:
      'Clean, governed, continuously enriched data is the prerequisite that lets assignment rules run without manual prep. It is an enterprise enabler beyond territory planning, feeding lead routing, forecasting, hierarchy, and scoring.',
    inputs: [
      'Account data from Salesforce (industry, employee count, revenue, geography)',
      'Order history, leads, and sales-org data',
      'Account-hierarchy data',
      'Open and historical opportunity data',
      'Rep activity (calls, meetings, emails)',
      'Matching and de-duplication logic',
    ],
    outputs: [
      'Validated, accurate Salesforce records',
      'Enriched firmographic data per account',
      'Account engagement history and inactive / high-potential list',
      'Data-quality scorecard, exception report, and remediation backlog',
    ],
    salesforce: {
      define:
        'IT and RevOps establish clean data: enrichment vendor, dedupe rules, and golden record.',
      object: 'Account & Contact objects',
      fields: 'industry, employees, revenue, external Id',
    },
  },
]

export const FOUNDATION_BY_SLUG: Record<string, FoundationContent> =
  Object.fromEntries(FOUNDATIONS.map((f) => [f.slug, f]))

export const FOUNDATION_BY_KEY: Record<PrereqKey, FoundationContent> =
  Object.fromEntries(FOUNDATIONS.map((f) => [f.key, f])) as Record<
    PrereqKey,
    FoundationContent
  >

// Icons for the Salesforce Translation lanes / decision flow.
export const PREREQ_ICONS = {
  matrix: SlidersHorizontal,
  requirements: ListChecks,
  location: MapPin,
  company: Building2,
} as const
