// Central information architecture + recommendation metadata for the
// Cvent Territory Design Workspace. Consumed by the sidebar, the top-bar
// present-mode pager, and the Overview framework diagram.

export type FocusAreaId = 'planning' | 'monitoring'

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
    ],
  },
]

export const ALL_RECOMMENDATIONS: Recommendation[] = FOCUS_AREAS.flatMap(
  (fa) => fa.recommendations,
)

// ---- Sidebar navigation model -------------------------------------------

import {
  BarChart3,
  BookOpenCheck,
  Gauge,
  LayoutDashboard,
  Map as MapIcon,
  Split,
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
    ],
  },
  {
    eyebrow: null,
    items: [{ href: '/principles', label: 'Guiding Principles & Recommendations', icon: BookOpenCheck }],
  },
]

/** Flat, ordered list of routes for the Present-mode pager (reading order). */
export const PAGER_ORDER: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)
