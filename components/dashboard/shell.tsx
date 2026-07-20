import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Lightbulb,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tone } from '@/lib/territory-data'

// RAG tones mapped onto the project's existing token palette.
export const TONE_RAIL: Record<Tone | 'default', string> = {
  default: 'bg-ink',
  success: 'bg-brand-teal',
  warning: 'bg-brand-lime',
  critical: 'bg-destructive',
}
export const TONE_CHIP: Record<Tone | 'default', string> = {
  default: 'bg-ink/5 text-ink',
  success: 'bg-brand-teal/10 text-brand-teal',
  warning: 'bg-brand-lime/20 text-ink',
  critical: 'bg-destructive/10 text-destructive',
}
export const TONE_TEXT: Record<Tone | 'default', string> = {
  default: 'text-ink',
  success: 'text-brand-teal',
  warning: 'text-ink',
  critical: 'text-destructive',
}
export const TONE_DOT: Record<Tone | 'default', string> = {
  default: 'bg-sage-2',
  success: 'bg-brand-teal',
  warning: 'bg-brand-lime',
  critical: 'bg-destructive',
}

export type DeltaTrend = 'up' | 'down' | 'flat'

/** KPI stat card with a colored left rail, icon chip, and optional delta. */
export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  tone = 'default',
  delta,
  trend = 'flat',
  deltaFavorable,
  sub,
}: {
  label: string
  value: string
  unit?: string
  icon?: LucideIcon
  tone?: Tone | 'default'
  delta?: string
  trend?: DeltaTrend
  /** Override whether the delta reads as good (teal) or bad (red). */
  deltaFavorable?: boolean
  sub?: string
}) {
  const DeltaIcon =
    trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : ArrowRight
  const favorable = deltaFavorable ?? trend === 'up'
  return (
    <div className="relative flex min-h-36 flex-col gap-3 overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(20,32,26,0.04),0_10px_24px_rgba(20,32,26,0.04)] transition-transform duration-200 hover:-translate-y-0.5">
      <span
        className={cn('absolute inset-y-0 left-0 w-1', TONE_RAIL[tone])}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2 pl-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-sage-2">
          {label}
        </span>
        {Icon && (
          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-md',
              TONE_CHIP[tone],
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1 pl-1.5">
        <span className="text-2xl font-bold tracking-tight text-ink">{value}</span>
        {unit && <span className="text-sm font-medium text-sage-2">{unit}</span>}
      </div>
      {(delta || sub) && (
        <div className="flex items-center gap-2 pl-1.5 text-xs">
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold',
                trend === 'flat'
                  ? 'text-sage-2'
                  : favorable
                    ? 'text-brand-teal'
                    : 'text-destructive',
              )}
            >
              <DeltaIcon className="size-3.5" aria-hidden />
              {delta}
            </span>
          )}
          {sub && <span className="text-sage-2">{sub}</span>}
        </div>
      )}
    </div>
  )
}

export type Severity = 'info' | 'positive' | 'warning' | 'critical'

const SEVERITY_DOT: Record<Severity, string> = {
  info: 'bg-brand-teal',
  positive: 'bg-brand-teal',
  warning: 'bg-brand-lime',
  critical: 'bg-destructive',
}

export interface Insight {
  severity: Severity
  title?: string
  detail?: string
}

/** Executive insights panel — a divided list of data-derived observations. */
export function InsightList({ insights }: { insights: Insight[] }) {
  const items = insights.filter((ins) => ins.title)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(20,32,26,0.04),0_14px_32px_rgba(20,32,26,0.04)]">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Sparkles className="size-4 text-brand-teal" aria-hidden />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-ink">Executive insights</span>
          <span className="text-[11px] text-sage-2">
            Generated from the current view
          </span>
        </div>
      </div>
      <ul className="divide-y divide-border/50">
        {items.map((ins, i) => (
          <li key={i} className="flex items-start gap-3 px-4 py-3">
            <span
              className={cn(
                'mt-1.5 size-2 shrink-0 rounded-full',
                SEVERITY_DOT[ins.severity],
              )}
              aria-hidden
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">{ins.title}</span>
              <span className="text-xs leading-relaxed text-sage-2">
                {ins.detail}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export type Priority = 'High' | 'Medium' | 'Low'

const PRIORITY_STYLE: Record<Priority, string> = {
  High: 'bg-destructive/10 text-destructive',
  Medium: 'bg-brand-lime/20 text-ink',
  Low: 'bg-brand-teal/10 text-brand-teal',
}
const PRIORITY_RAIL: Record<Priority, string> = {
  High: 'bg-destructive',
  Medium: 'bg-brand-lime',
  Low: 'bg-brand-teal',
}

export interface NextAction {
  priority: Priority
  owner: string
  action: string
  rationale: string
  impact: string
}

/** Recommended next-best-actions grid. */
export function NextBestActions({ actions }: { actions: NextAction[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(20,32,26,0.04),0_14px_32px_rgba(20,32,26,0.04)]">
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Lightbulb className="size-4 text-brand-lime" aria-hidden />
        <span className="text-sm font-bold text-ink">
          Recommended next best actions
        </span>
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((a, i) => (
          <div
            key={i}
            className="relative flex flex-col gap-2 overflow-hidden rounded-lg border border-border/60 bg-surface p-4"
          >
            <span
              className={cn(
                'absolute inset-y-0 left-0 w-1',
                PRIORITY_RAIL[a.priority],
              )}
              aria-hidden
            />
            <div className="flex items-center justify-between gap-2 pl-1.5">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                  PRIORITY_STYLE[a.priority],
                )}
              >
                {a.priority}
              </span>
              <span className="text-[11px] text-sage-2">{a.owner}</span>
            </div>
            <p className="pl-1.5 text-sm font-bold leading-snug text-ink">
              {a.action}
            </p>
            <p className="pl-1.5 text-xs leading-relaxed text-sage-2">
              {a.rationale}
            </p>
            <p className="flex items-start gap-1 pl-1.5 text-xs font-medium text-ink-2">
              <ArrowRight
                className="mt-0.5 size-3 shrink-0 text-brand-teal"
                aria-hidden
              />
              {a.impact}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Small status pill. */
export function Pill({
  children,
  tone = 'default',
}: {
  children: React.ReactNode
  tone?: Tone | 'default'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        TONE_CHIP[tone],
      )}
    >
      {children}
    </span>
  )
}

/** Health badge with a leading dot. */
export function HealthBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <Pill tone={tone}>
      <span className={cn('size-1.5 rounded-full', TONE_DOT[tone])} aria-hidden />
      {label}
    </Pill>
  )
}

/** Scrollable data table with a sticky header, matching the design system. */
export function DataTable({
  columns,
  rows,
  maxHeight = 380,
}: {
  columns: { key: string; label: string; align?: 'left' | 'right' }[]
  rows: Record<string, React.ReactNode>[]
  maxHeight?: number
}) {
  return (
    <div
      className="overflow-auto rounded-lg border border-border/60"
      style={{ maxHeight }}
    >
      <table className="w-full min-w-max border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  'whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-sage-2',
                  c.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row, i) => (
            <tr key={i} className="transition-colors hover:bg-muted/40">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    'whitespace-nowrap px-3 py-2 text-ink-2',
                    c.align === 'right' ? 'text-right tabular-nums' : 'text-left',
                  )}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
