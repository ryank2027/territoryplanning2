'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, CornerLeftUp, Globe2, LayoutGrid } from 'lucide-react'
import TerritoryMap, {
  type ColorBy,
  type MapAccount,
  type Region,
} from '@/components/territory-map'
import { Eyebrow } from '@/components/primitives/eyebrow'
import { cn } from '@/lib/utils'

/** The five ordered levels of the geographic backbone. */
type GeoLevel = 1 | 2 | 3 | 4 | 5

interface GeoCutProps {
  /** This BU's accounts, already mapped for the Geography cut (includes zip3). */
  accounts: MapAccount[]
  /** Geography colorBy (states by region, markers ink). */
  colorBy: ColorBy
  sizeLegend: { label: string; bands: string[] }
  /** Lifted state selection — carried into every subsequent cut. */
  selectedStateName: string | null
  onSelectStateName: (name: string | null) => void
  /** Lifted ZIP3 selection — the leaf; carried into every subsequent cut. */
  selectedZip3: string | null
  onSelectZip3: (zip3: string | null) => void
  onSelectAccount: (id: string) => void
}

/** Global regions. Only the Americas carries synthetic data in this demo. */
const GLOBAL_REGIONS: { id: string; label: string; available: boolean }[] = [
  { id: 'Americas', label: 'Americas', available: true },
  { id: 'EMEA', label: 'EMEA', available: false },
  { id: 'APAC', label: 'APAC', available: false },
]

export function GeoCut({
  accounts,
  colorBy,
  sizeLegend,
  selectedStateName,
  onSelectStateName,
  selectedZip3,
  onSelectZip3,
  onSelectAccount,
}: GeoCutProps) {
  const regionOf = (name: string | null): Region | null =>
    (accounts.find((a) => a.geography === name)?.region as Region) ?? null

  // Seed from any state already carried in (e.g. returning to the Geo cut).
  const [level, setLevel] = useState<GeoLevel>(selectedStateName ? 5 : 1)
  const [globalRegion, setGlobalRegion] = useState<string | null>(
    selectedStateName ? 'Americas' : null,
  )
  const [country, setCountry] = useState<string | null>(
    selectedStateName ? 'United States' : null,
  )
  const [stateRegion, setStateRegion] = useState<Region | null>(
    selectedStateName ? regionOf(selectedStateName) : null,
  )

  // If the carried state is cleared elsewhere, don't get stuck on the leaf.
  useEffect(() => {
    if (!selectedStateName && level === 5) setLevel(4)
  }, [selectedStateName, level])

  /** Navigate to a level, clearing every selection deeper than it. */
  function goToLevel(target: GeoLevel) {
    setLevel(target)
    if (target < 5) onSelectZip3(null)
    if (target < 4) onSelectStateName(null)
    if (target < 3) setStateRegion(null)
    if (target < 2) setCountry(null)
    if (target < 1) setGlobalRegion(null)
  }

  function reset() {
    setLevel(1)
    onSelectZip3(null)
    onSelectStateName(null)
    setStateRegion(null)
    setCountry(null)
    setGlobalRegion(null)
  }

  const rungs: { name: string; value: string | null }[] = [
    { name: 'Global Region', value: globalRegion },
    { name: 'Country', value: country },
    { name: 'State Region', value: stateRegion },
    { name: 'State', value: selectedStateName },
    {
      name: 'ZIP3',
      value: selectedZip3 ? `${selectedZip3}xx` : level >= 5 ? 'Pick a ZIP3' : null,
    },
  ]

  const captions: Record<GeoLevel, string> = {
    1: 'Pick a global region to begin the geographic drill-down.',
    2: 'Select a country within the Americas to zoom into its states.',
    3: 'Pick a state region to zoom into its states.',
    4: `Pick a state in the ${stateRegion ?? 'selected'} region to reveal its ZIP3 clusters.`,
    5: selectedZip3
      ? `ZIP3 ${selectedZip3}xx selected — this leaf carries into the next cut. Pick another ZIP3 to change it.`
      : `${selectedStateName ?? 'Selected state'} · click a ZIP3 bubble to zoom into it and carry it into the next cut.`,
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Always-visible hierarchy ladder */}
      <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-surface p-3">
        <div className="flex items-center justify-between gap-2">
          <Eyebrow tone="teal">Geography hierarchy</Eyebrow>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToLevel(Math.max(1, level - 1) as GeoLevel)}
              disabled={level === 1}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-sage-2 hover:bg-muted hover:text-ink disabled:opacity-30"
            >
              <CornerLeftUp className="size-3.5" aria-hidden />
              Up one level
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={level === 1 && !globalRegion}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-sage-2 hover:bg-muted hover:text-ink disabled:opacity-30"
            >
              <LayoutGrid className="size-3.5" aria-hidden />
              Overview
            </button>
          </div>
        </div>

        <ol className="flex flex-wrap items-center gap-1.5">
          {rungs.map((rung, i) => {
            const idx = (i + 1) as GeoLevel
            const isCurrent = level === idx
            const isComplete = Boolean(rung.value)
            const isReached = idx <= level
            const clickable = isReached && !isCurrent
            return (
              <li key={rung.name} className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && goToLevel(idx)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'flex min-w-[7.5rem] flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors',
                    isCurrent
                      ? 'border-brand-green bg-brand-green/10'
                      : isReached
                        ? 'border-border/70 bg-card hover:border-brand-green/50'
                        : 'border-dashed border-border/60 bg-muted/40',
                    clickable ? 'cursor-pointer' : 'cursor-default',
                  )}
                >
                  <span
                    className={cn(
                      'flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide',
                      isCurrent ? 'text-brand-green' : 'text-sage-2',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-3.5 items-center justify-center rounded-full text-[9px]',
                        isCurrent
                          ? 'bg-brand-green text-ink'
                          : isComplete
                            ? 'bg-ink text-brand-green'
                            : 'bg-muted text-sage-2',
                      )}
                    >
                      {idx}
                    </span>
                    {rung.name}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      isComplete ? 'text-ink' : 'text-sage-2/70',
                    )}
                  >
                    {rung.value ?? 'Select…'}
                  </span>
                </button>
                {idx < 5 && (
                  <ChevronRight className="size-4 shrink-0 text-sage-2/50" aria-hidden />
                )}
              </li>
            )
          })}
        </ol>

        <p className="text-sm leading-relaxed text-ink-2">{captions[level]}</p>
      </div>

      {/* Level 1: global region tiles */}
      {level === 1 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {GLOBAL_REGIONS.map((gr) => {
            const active = globalRegion === gr.id
            return (
              <button
                key={gr.id}
                type="button"
                disabled={!gr.available}
                onClick={() => {
                  if (!gr.available) return
                  setGlobalRegion(gr.id)
                  setLevel(2)
                }}
                className={cn(
                  'flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors',
                  gr.available
                    ? active
                      ? 'border-brand-green bg-brand-green/10'
                      : 'border-border/70 bg-surface hover:border-brand-green/50'
                    : 'cursor-not-allowed border-dashed border-border/60 bg-muted/40',
                )}
              >
                <span className="flex items-center gap-2">
                  <Globe2
                    className={cn(
                      'size-4',
                      gr.available ? 'text-brand-teal' : 'text-sage-2/60',
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      'text-base font-bold',
                      gr.available ? 'text-ink' : 'text-sage-2',
                    )}
                  >
                    {gr.label}
                  </span>
                </span>
                <span className="text-xs leading-relaxed text-sage-2">
                  {gr.available
                    ? 'Active — full synthetic hierarchy. Click to drill in.'
                    : 'No synthetic data — shown to complete the hierarchy.'}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Levels 2–5: the guided map */}
      {level === 2 && (
        <TerritoryMap
          accounts={accounts}
          colorBy={colorBy}
          sizeLegend={sizeLegend}
          selectedStateName={null}
          geoLevel="country"
          onSelectCountry={() => {
            setCountry('United States')
            setLevel(3)
          }}
        />
      )}

      {level === 3 && (
        <TerritoryMap
          accounts={accounts}
          colorBy={colorBy}
          sizeLegend={sizeLegend}
          selectedStateName={null}
          geoLevel="stateRegion"
          onSelectStateRegion={(r) => {
            setStateRegion(r)
            setLevel(4)
          }}
        />
      )}

      {level === 4 && (
        <TerritoryMap
          accounts={accounts}
          colorBy={colorBy}
          sizeLegend={sizeLegend}
          selectedStateName={null}
          focusRegion={stateRegion}
          geoLevel="state"
          onSelectStateName={(name) => {
            onSelectStateName(name)
            setLevel(5)
          }}
        />
      )}

      {level === 5 && (
        <TerritoryMap
          accounts={accounts}
          colorBy={colorBy}
          sizeLegend={sizeLegend}
          selectedStateName={selectedStateName}
          geoLevel="zip3"
          selectedZip3={selectedZip3}
          onSelectZip3={onSelectZip3}
          onSelectAccount={onSelectAccount}
        />
      )}
    </div>
  )
}
