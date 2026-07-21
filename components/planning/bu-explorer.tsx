'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RotateCcw,
  ShieldAlert,
  X,
} from 'lucide-react'
import {
  BU_ORDER,
  BU_SEGMENTATION,
  CUT_CATEGORIES,
  MAP_ACCOUNTS,
  MEETING_SPACE_ORDER,
  SIZE_BAND_ORDER,
  accountCutValue,
  cutAttribute,
  segmentationFindings,
  tierForScore,
  type CutAttribute,
  type SampleAccount,
} from '@/lib/planning'
import { useWorkspace } from '@/components/workspace/workspace-provider'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { InsightPanel } from '@/components/primitives/insight-panel'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import TerritoryMap from '@/components/territory-map'
import { SegmentedControl } from './segmented-control'
import { GeoCut } from './geo-cut'
import { cn } from '@/lib/utils'

const TIER_DOT: Record<string, string> = {
  A: 'bg-brand-green',
  B: 'bg-brand-teal',
  C: 'bg-sage-2',
}

type ExplorerMode = 'recommended' | 'scenario'

interface DimensionState {
  label: string
  note: string
  enabled: boolean
}

export function BuExplorer() {
  const { businessUnit, setBusinessUnit } = useWorkspace()
  const [mode, setMode] = useState<ExplorerMode>('recommended')

  const recommended = BU_SEGMENTATION[businessUnit]

  const buildDefault = useMemo<DimensionState[]>(
    () =>
      recommended.cuts.map((c) => ({
        label: c.label,
        note: c.note,
        enabled: true,
      })),
    [recommended],
  )

  const [dimensions, setDimensions] = useState<DimensionState[]>(buildDefault)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  // The state the user drills into on the Geography cut — carried across every
  // subsequent cut so the funnel stays scoped to it.
  const [selectedStateName, setSelectedStateName] = useState<string | null>(null)
  const [filterValue, setFilterValue] = useState<string>('All')

  // Reset everything whenever the BU changes.
  useEffect(() => {
    setDimensions(buildDefault)
    setMode('recommended')
    setSelectedAccountId(null)
    setStepIndex(0)
    setSelectedStateName(null)
    setFilterValue('All')
  }, [buildDefault])

  // This BU's accounts.
  const buAccounts = useMemo(
    () => MAP_ACCOUNTS.filter((a) => a.bu === recommended.name),
    [recommended],
  )
  const selectedAccount = buAccounts.find((a) => a.id === selectedAccountId)

  // Ordered, enabled cuts drive the progressive stepper.
  const enabledCuts = dimensions.filter((d) => d.enabled).map((d) => d.label)
  const enabledKey = enabledCuts.join('|')

  // Keep the step index in range as the sequence changes.
  useEffect(() => {
    setStepIndex((i) => Math.min(i, Math.max(enabledCuts.length - 1, 0)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledKey])

  // The BU's categorical cut (industry / venue) — used for color + filter on
  // the zoom step, where bubble size already encodes the refinement dimension.
  const categorical = useMemo(() => {
    const dim = dimensions.find((d) => {
      const a = cutAttribute(d.label)
      return a === 'vertical' || a === 'venueType'
    })
    return {
      attr: (dim ? cutAttribute(dim.label) : 'vertical') as CutAttribute,
      label: dim?.label ?? 'Industry / Vertical',
    }
  }, [dimensions])
  const categoricalAttr = categorical.attr

  // Densest state for this BU — the default focus if the user hasn't clicked
  // one yet (keeps later cuts populated even when jumped to via the stepper).
  const densestState = useMemo(() => {
    const m = new Map<string, number>()
    buAccounts.forEach((a) => m.set(a.geography, (m.get(a.geography) ?? 0) + 1))
    let best: string | null = null
    m.forEach((count, state) => {
      if (!best || count > (m.get(best) ?? 0)) best = state
    })
    return best
  }, [buAccounts])

  // States this BU actually operates in — options for the carried-state switcher.
  const stateOptions = useMemo(
    () => Array.from(new Set(buAccounts.map((a) => a.geography))).sort(),
    [buAccounts],
  )

  // Resolve the current step into a concrete map view model.
  const currentCut = enabledCuts[stepIndex] ?? enabledCuts[0] ?? 'Geography'
  const stepAttr = cutAttribute(currentCut)
  const isGeoStep = stepAttr === 'region'
  // The refinement cut (company size / meeting space) — the deepest drill.
  const isRefineStep = stepAttr === 'sizeBand' || stepAttr === 'meetingSpace'

  // Reset the drill-down filter each time the active cut changes.
  useEffect(() => {
    setFilterValue('All')
  }, [currentCut])

  // The state every non-geo cut stays scoped to.
  const focusState = isGeoStep ? selectedStateName : selectedStateName ?? densestState

  // Geography colors states by region; every other cut colors accounts by the
  // BU's categorical dimension (industry / product & venue type).
  const colorAttr: CutAttribute = isGeoStep ? 'region' : categoricalAttr
  // Refinement cut sizes bubbles by its own dimension; others by company size.
  const sizeAttr: CutAttribute = isRefineStep ? stepAttr : 'sizeBand'
  const sizeBands =
    sizeAttr === 'meetingSpace' ? MEETING_SPACE_ORDER : SIZE_BAND_ORDER
  const sizeLabel = sizeAttr === 'meetingSpace' ? 'Meeting space' : 'Company size'

  const presentValues = new Set(
    buAccounts.map((a) => accountCutValue(a, colorAttr)),
  )
  const colorBy = {
    label: isGeoStep ? 'Geography' : categorical.label,
    attribute: colorAttr,
    categories: CUT_CATEGORIES[colorAttr].filter((c) =>
      presentValues.has(c.value),
    ),
  }

  // One mapping shared by the guided Geography cut and the other cuts' map.
  const mapAccounts = buAccounts.map((a) => ({
    id: a.id,
    name: a.name,
    geography: a.geography,
    dma: a.dma,
    zip3: a.zip3,
    region: a.region,
    moved: a.moved,
    category: accountCutValue(a, colorAttr),
    sizeBand: accountCutValue(a, sizeAttr),
  }))

  const stageDescription = isGeoStep
    ? 'The five-level geographic backbone: Global Region → Country → State Region → State → ZIP3. Drill down through each level; the state you land on carries into the next cut.'
    : isRefineStep
      ? `${focusState ?? 'Selected state'} · bubble size shows ${sizeLabel.toLowerCase()}. Filter by a ${sizeLabel.toLowerCase()} band to drill down once more.`
      : `${focusState ?? 'Selected state'} · each account colored by ${categorical.label.toLowerCase()}.`

  const isScenario = mode === 'scenario'

  function move(index: number, dir: -1 | 1) {
    setDimensions((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function toggle(index: number) {
    setDimensions((prev) =>
      prev.map((d, i) => (i === index ? { ...d, enabled: !d.enabled } : d)),
    )
  }

  function reset() {
    setDimensions(buildDefault)
  }

  const findings = useMemo(() => {
    const enabled: Record<string, boolean> = {}
    dimensions.forEach((d) => {
      enabled[d.label] = d.enabled
    })
    const order = dimensions.filter((d) => d.enabled).map((d) => d.label)
    return segmentationFindings(enabled, order)
  }, [dimensions])

  const buOptions = BU_ORDER.map((id) => ({
    value: id,
    label: BU_SEGMENTATION[id].name,
  }))

  return (
    <div className="flex flex-col gap-5">
      {/* BU segmented control */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <Eyebrow tone="teal">Business unit explorer</Eyebrow>
          <p className="text-sm text-sage-2">
            Same top-level backbone; the cuts below diverge by business need.
          </p>
        </div>
        <SegmentedControl
          ariaLabel="Select a business unit"
          options={buOptions}
          value={businessUnit}
          onChange={setBusinessUnit}
        />
      </div>

      {/* Thesis */}
      <div className="rounded-xl border border-border/70 bg-surface p-4">
        <Eyebrow tone="sage">{recommended.name} thesis</Eyebrow>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          {recommended.thesis}
        </p>
      </div>

      {/* Recommended vs Scenario */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          ariaLabel="Segmentation mode"
          size="sm"
          options={[
            { value: 'recommended', label: 'Recommended' },
            { value: 'scenario', label: 'Scenario' },
          ]}
          value={mode}
          onChange={(m) => setMode(m as ExplorerMode)}
        />
        {isScenario && (
          <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="size-3.5" aria-hidden />
            Reset to recommendation
          </Button>
        )}
      </div>

      {/* Ordered cuts */}
      <ol className="flex flex-col gap-2.5">
        {dimensions.map((dim, i) => {
          const activeIndex = dimensions
            .slice(0, i + 1)
            .filter((d) => d.enabled).length
          return (
            <li
              key={dim.label}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-3.5 transition-colors',
                dim.enabled
                  ? 'border-border/70 bg-surface'
                  : 'border-dashed border-border/60 bg-muted/40 opacity-70',
              )}
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                  dim.enabled
                    ? 'bg-ink text-brand-green'
                    : 'bg-muted text-sage-2',
                )}
              >
                {dim.enabled ? activeIndex : 'off'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">{dim.label}</p>
                <p className="text-xs leading-relaxed text-sage-2">{dim.note}</p>
              </div>

              {isScenario && (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${dim.label} earlier`}
                      className="rounded p-0.5 text-sage-2 hover:text-ink disabled:opacity-30"
                    >
                      <ArrowUp className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === dimensions.length - 1}
                      aria-label={`Move ${dim.label} later`}
                      className="rounded p-0.5 text-sage-2 hover:text-ink disabled:opacity-30"
                    >
                      <ArrowDown className="size-4" aria-hidden />
                    </button>
                  </div>
                  <Switch
                    checked={dim.enabled}
                    onCheckedChange={() => toggle(i)}
                    aria-label={`Enable ${dim.label} dimension`}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {/* Impact preview (scenario only) */}
      {isScenario && (
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Eyebrow tone="teal">Impact preview</Eyebrow>
          </div>
          <ul className="flex flex-col gap-2">
            {findings.map((f) => (
              <li
                key={f.text}
                className={cn(
                  'flex items-start gap-2 text-sm leading-relaxed',
                  f.tone === 'warn' ? 'text-warn' : 'text-ink-2',
                )}
              >
                {f.tone === 'warn' ? (
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                ) : (
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-teal" aria-hidden />
                )}
                {f.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progressive segmentation walkthrough */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Eyebrow tone="teal">Segmentation walkthrough</Eyebrow>
          <p className="text-sm text-sage-2">
            Step through {recommended.name}&apos;s cuts in order. Pick a state on
            the Geography cut and the funnel stays scoped to it — each following
            cut refines that same state until you drill into a single segment.
          </p>
        </div>

        {/* Step controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            aria-label="Previous cut"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-surface text-sage-2 hover:text-ink disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <ol className="flex flex-1 flex-wrap items-center gap-2">
            {enabledCuts.map((c, i) => (
              <li key={c} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStepIndex(i)}
                  aria-current={i === stepIndex}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                    i === stepIndex
                      ? 'border-transparent bg-ink text-brand-green'
                      : 'border-border/70 bg-surface text-sage-2 hover:text-ink',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full text-[11px]',
                      i === stepIndex
                        ? 'bg-brand-green text-ink'
                        : 'bg-muted text-sage-2',
                    )}
                  >
                    {i + 1}
                  </span>
                  {c}
                </button>
                {i < enabledCuts.length - 1 && (
                  <ChevronRight
                    className="size-3.5 text-sage-2/60"
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() =>
              setStepIndex((i) => Math.min(enabledCuts.length - 1, i + 1))
            }
            disabled={
              stepIndex === enabledCuts.length - 1 ||
              (isGeoStep && !selectedStateName)
            }
            aria-label="Next cut"
            title={
              isGeoStep && !selectedStateName
                ? 'Select a state on the map to continue'
                : undefined
            }
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-surface text-sage-2 hover:text-ink disabled:opacity-30"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-ink-2">{stageDescription}</p>

        {/* Geo step: prompt to drill the hierarchy down to a state */}
        {isGeoStep && !selectedStateName && (
          <p className="rounded-xl border border-dashed border-border/70 bg-surface px-3 py-2 text-xs font-medium text-sage-2">
            Drill down the geography hierarchy to a single state, then continue
            to refine that state in the next cut.
          </p>
        )}

        {/* Non-geo steps: the carried state + (deepest cut) a drill-down filter */}
        {!isGeoStep && (
          <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border/70 bg-surface p-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-sage-2">
                State
              </span>
              <select
                className="rounded-md border border-border/70 bg-card px-2.5 py-1.5 text-sm font-medium text-ink"
                value={focusState ?? ''}
                onChange={(e) => setSelectedStateName(e.target.value)}
              >
                {stateOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            {isRefineStep && (
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-sage-2">
                  Filter by {sizeLabel}
                </span>
                <select
                  className="rounded-md border border-border/70 bg-card px-2.5 py-1.5 text-sm font-medium text-ink"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="All">All</option>
                  {sizeBands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        {isGeoStep ? (
          <GeoCut
            accounts={mapAccounts}
            colorBy={colorBy}
            sizeLegend={{ label: sizeLabel, bands: sizeBands }}
            selectedStateName={selectedStateName}
            onSelectStateName={setSelectedStateName}
            onSelectAccount={setSelectedAccountId}
          />
        ) : (
          <TerritoryMap
            accounts={mapAccounts}
            colorBy={colorBy}
            selectedStateName={focusState}
            onSelectStateName={setSelectedStateName}
            sizeLegend={{ label: sizeLabel, bands: sizeBands }}
            filter={
              isRefineStep
                ? { label: sizeLabel, value: filterValue, field: 'size' }
                : null
            }
            onSelectAccount={setSelectedAccountId}
          />
        )}
        {selectedAccount && (
          <DecisionRecord
            account={selectedAccount}
            onClose={() => setSelectedAccountId(null)}
          />
        )}
      </div>

      {/* Guardrail */}
      <InsightPanel title={`${recommended.name} guardrail`} icon={ShieldAlert} tone="amber">
        {recommended.guardrail}
      </InsightPanel>
    </div>
  )
}

/** Lightweight account decision record shown when a map marker is selected. */
function DecisionRecord({
  account,
  onClose,
}: {
  account: SampleAccount
  onClose: () => void
}) {
  const score = Math.round(0.5 * account.icpFitment + 0.5 * account.potential)
  const tier = tierForScore(score)
  const rows: { label: string; value: string }[] = [
    { label: 'Business unit', value: account.bu },
    { label: 'Geography', value: `${account.geography} · ${account.region}` },
    { label: 'ICP fitment', value: String(account.icpFitment) },
    { label: 'Potential', value: String(account.potential) },
  ]

  return (
    <div className="rounded-xl border border-border/70 bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ink text-brand-green">
            <MapPin className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">{account.name}</p>
            <p className="text-xs text-sage-2">Account decision record</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {account.moved && (
            <span className="rounded-full bg-brand-lime/20 px-2.5 py-1 text-xs font-semibold text-ink-2">
              Moved in scenario
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account decision record"
            className="rounded-md p-1 text-sage-2 hover:bg-muted hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-sage-2">{r.label}</dt>
            <dd className="text-sm font-semibold text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5">
        <span className="text-xs text-sage-2">Account Score</span>
        <span className="text-lg font-bold tabular-nums text-ink">{score}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
          <span
            className={cn('size-2.5 rounded-full', TIER_DOT[tier.tier])}
            aria-hidden
          />
          Tier {tier.tier} · {tier.cadence}
        </span>
      </div>
    </div>
  )
}
