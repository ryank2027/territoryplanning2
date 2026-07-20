// Central information architecture + recommendation metadata for the
// Cvent Territory Design Workspace. Consumed by the sidebar, the top-bar
// present-mode pager, and the Overview framework diagram.

export type FocusAreaId = 'prerequisites' | 'planning' | 'monitoring'

export interface Recommendation {
  /** stable id */
  id: string
  /** route path */
  href: string
  /** short label used in nav + diagram */
  label: string
  /** one-line explanation shown on hover in the diagram */
  blurb: string
  /** optional ordinal shown in Planning / Monitoring columns (01, 02, 03) */
  ordinal?: string
  /** capability function mapping codes, where the PRD provides them */
  capability?: string[]
  focusArea: FocusAreaId
}

export interface FocusArea {
  id: FocusAreaId
  /** sidebar eyebrow label */
  eyebrow: string
  /** overview column title */
  title: string
  /** overview column subtitle */
  subtitle: string
  recommendations: Recommendation[]
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: 'prerequisites',
    eyebrow: 'Prerequisites',
    title: 'Prerequisites',
    subtitle: 'What we need from the business',
    recommendations: [
      {
        id: 'icp',
        href: '/prerequisites/icp',
        label: 'Ideal Customer Profile (ICP)',
        blurb: 'A written, per-BU definition of a good target account.',
        capability: ['L2.1.1', 'L2.1.2', 'L2.6.1'],
        focusArea: 'prerequisites',
      },
      {
        id: 'business-goals',
        href: '/prerequisites/business-goals',
        label: 'Business Goals & Route to Market',
        blurb: 'Targets, quotas, and GTM that drive how territories are sized.',
        capability: ['L2.1.1', 'L2.1.2', 'L2.1.4', 'L2.4.1'],
        focusArea: 'prerequisites',
      },
      {
        id: 'roles',
        href: '/prerequisites/roles',
        label: 'Roles, Responsibilities & Org Structure',
        blurb: 'Who sells, who overlays, and where quota credit lands.',
        capability: ['L2.1.1', 'L2.4.1', 'L2.4.3', 'L2.4.4', 'L2.5.5'],
        focusArea: 'prerequisites',
      },
      {
        id: 'data',
        href: '/prerequisites/data',
        label: 'Clean, Validated Data',
        blurb: 'Governed, enriched account data that assignment rules can trust.',
        capability: ['L2.3.1', 'L2.3.2', 'L2.3.3', 'L2.6.1', 'L2.8.4'],
        focusArea: 'prerequisites',
      },
    ],
  },
  {
    id: 'planning',
    eyebrow: 'Territory Planning',
    title: 'Territory Planning',
    subtitle: 'Three sequential design decisions',
    recommendations: [
      {
        id: 'segmentation',
        href: '/planning/segmentation',
        label: 'Segmentation Strategy',
        blurb: 'Hybrid segmentation: geography at the core, BU dimensions on top.',
        ordinal: '01',
        focusArea: 'planning',
      },
      {
        id: 'scoring',
        href: '/planning/scoring',
        label: 'Account Scoring & Mapping',
        blurb: 'One weighted 0–100 score per account drives A/B/C tiering.',
        ordinal: '02',
        focusArea: 'planning',
      },
      {
        id: 'coverage',
        href: '/planning/coverage',
        label: 'Coverage, Capacity & Rep Alignment',
        blurb: 'Workload, scale, and rep skill balance books on effort.',
        ordinal: '03',
        focusArea: 'planning',
      },
    ],
  },
  {
    id: 'monitoring',
    eyebrow: 'Territory Monitoring',
    title: 'Territory Monitoring',
    subtitle: 'Keeping the model accurate over time',
    recommendations: [
      {
        id: 'kpis',
        href: '/monitoring/kpis',
        label: 'KPIs & Dashboards',
        blurb: 'Live Salesforce dashboards across revenue, coverage, productivity.',
        ordinal: '01',
        focusArea: 'monitoring',
      },
      {
        id: 'refinement',
        href: '/monitoring/refinement',
        label: 'Territory Strategy Refinement',
        blurb: 'A governed Weekly→Annual cadence with change control.',
        ordinal: '02',
        focusArea: 'monitoring',
      },
    ],
  },
]

export const ALL_RECOMMENDATIONS: Recommendation[] = FOCUS_AREAS.flatMap(
  (fa) => fa.recommendations,
)

// ---- Sidebar navigation model -------------------------------------------

import {
  ArrowLeftRight,
  BarChart3,
  BookOpenCheck,
  Database,
  Flag,
  Gauge,
  LayoutDashboard,
  Map as MapIcon,
  RefreshCw,
  ShieldCheck,
  Split,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export interface NavGroup {
  /** null = ungrouped top-level items (e.g. Overview) */
  eyebrow: string | null
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    eyebrow: null,
    items: [{ href: '/', label: 'Overview', icon: LayoutDashboard }],
  },
  {
    eyebrow: 'Prerequisites',
    items: [
      { href: '/prerequisites/icp', label: 'Ideal Customer Profile (ICP)', icon: Target },
      { href: '/prerequisites/business-goals', label: 'Business Goals & Route to Market', icon: Flag },
      { href: '/prerequisites/roles', label: 'Roles, Responsibilities & Org Structure', icon: Users },
      { href: '/prerequisites/data', label: 'Clean, Validated Data', icon: Database },
      { href: '/prerequisites/inputs-outputs', label: 'Inputs / Outputs & Salesforce Translation', icon: ArrowLeftRight },
      { href: '/prerequisites/readiness-gate', label: 'Readiness Gate', icon: ShieldCheck },
    ],
  },
  {
    eyebrow: 'Territory Planning',
    items: [
      { href: '/planning/segmentation', label: 'Segmentation Strategy', icon: Split },
      { href: '/planning/scoring', label: 'Account Scoring & Mapping', icon: Gauge },
      { href: '/planning/coverage', label: 'Coverage, Capacity & Rep Alignment', icon: MapIcon },
    ],
  },
  {
    eyebrow: 'Territory Monitoring',
    items: [
      { href: '/monitoring/kpis', label: 'KPIs & Dashboards', icon: BarChart3 },
      { href: '/monitoring/refinement', label: 'Territory Strategy Refinement', icon: RefreshCw },
    ],
  },
  {
    eyebrow: null,
    items: [{ href: '/principles', label: 'Guiding Principles & Recommendations', icon: BookOpenCheck }],
  },
]

/** Flat, ordered list of routes for the Present-mode pager (reading order). */
export const PAGER_ORDER: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)
