"use client";

/**
 * TerritoryMap — accurate North America → US-state drill-down map.
 *
 * Ported from the Project STAR prototype's map (d3-geo + real us-atlas /
 * world-atlas TopoJSON boundaries) and re-skinned to the Cvent 2026 New Brand.
 * Behavior preserved: overview of US + Canada + Mexico with region-colored
 * states, click a state to zoom in, synthetic account markers placed inside
 * the selected state, breadcrumb + state picker + back control, and a legend.
 *
 * Runtime dependencies (install in your project):
 *   npm i d3-geo topojson-client us-atlas world-atlas
 * (types are handled locally below, so no @types packages are required.)
 *
 * tsconfig must allow JSON imports: "resolveJsonModule": true (Next enables
 * this by default).
 *
 * Colors below are the New Brand tokens as literals so the component is
 * drop-in regardless of your Tailwind theme setup. Swap them for your CSS
 * variables (e.g. "var(--brand-teal)") once your tokens are wired up.
 */

import { useEffect, useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature, merge } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import stateData from "us-atlas/states-10m.json";

/* ----------------------------- brand tokens ----------------------------- */
const REGION_FILL: Record<Region, string> = {
  West: "#7FD8DE", // light teal
  Central: "#34C3CC", // mid teal
  East: "#00B8C5", // brand teal
  Canada: "#C9D6D2", // sage tint
};
const COUNTRY_FILL = "#E3ECEC"; // Mexico / neutral countries
const SELECTED_FILL = "#01EF6C"; // brand green — the drilled-in state pops
const MARKER_FILL = "#17201C"; // ink
const MARKER_MOVED_FILL = "#C7F522"; // lime — flags a moved account
const STROKE = "#FFFFFF";
const SELECTED_STROKE = "#17201C";

/* ------------------------------- types ---------------------------------- */
export type Region = "West" | "Central" | "East" | "Canada";

/** Minimal shape the map needs from your synthetic account fixtures. */
export interface MapAccount {
  id: string;
  name: string;
  /** US state or province name, matching us-atlas naming (e.g. "California"). */
  geography: string;
  /** DMA / metro market within the state (Level 3 of the geo hierarchy). */
  dma?: string;
  /** ZIP3 — first 3 digits of the ZIP (Level 5, leaf of the geo hierarchy). */
  zip3?: string;
  region: Region;
  /** Optional: render this account as "moved" in the current scenario. */
  moved?: boolean;
  /** Category value for the currently-visualized segmentation cut. */
  category?: string;
  /** Value of the attribute driving bubble radius (company size or sqft band). */
  sizeBand?: string;
}

/** Radius for a size band given the ordered scale (small → large). */
function radiusFor(band: string | undefined, scale: string[]): number {
  const idx = scale.indexOf(band ?? "");
  const i = idx < 0 ? 1 : idx;
  return 5 + i * 3.5;
}

/** Describes the active segmentation cut the map should encode. */
export interface ColorBy {
  /** Human label of the cut, e.g. "Industry / Vertical". */
  label: string;
  /** "region" colors the states (spatial backbone); anything else colors markers. */
  attribute: string;
  /** Categories present for this cut, with brand colors. */
  categories: { value: string; color: string }[];
}

type NamedFeature = {
  type: "Feature";
  properties: { name: string };
  geometry: unknown;
};
type NamedCollection = { type: "FeatureCollection"; features: NamedFeature[] };

/* --------------------------- geography (inline) -------------------------- */
const worldTopo = worldData as unknown as Parameters<typeof feature>[0];
const stateTopo = stateData as unknown as Parameters<typeof feature>[0];

const allCountries = feature(
  worldTopo,
  (worldData as any).objects.countries
) as unknown as NamedCollection;
const allStates = feature(
  stateTopo,
  (stateData as any).objects.states
) as unknown as NamedCollection;

const northAmericaCountries = allCountries.features.filter((f) =>
  ["Canada", "United States of America", "Mexico"].includes(f.properties.name)
);
const unitedStates = allStates.features.filter(
  (f) => f.properties.name !== "Puerto Rico"
);

const WEST = new Set([
  "Alaska", "Arizona", "California", "Colorado", "Hawaii", "Idaho", "Montana",
  "Nevada", "New Mexico", "Oregon", "Utah", "Washington", "Wyoming",
]);
const CENTRAL = new Set([
  "Arkansas", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Nebraska",
  "North Dakota", "Ohio", "Oklahoma", "South Dakota", "Tennessee", "Texas",
  "Wisconsin",
]);

function stateRegion(name: string): Region {
  if (WEST.has(name)) return "West";
  if (CENTRAL.has(name)) return "Central";
  return "East";
}

/**
 * Feature collection to frame a region zoom. When account state names are
 * given, fit tightly to just those states (avoids Alaska/Hawaii blowing up the
 * West bounding box); otherwise fall back to every state in the region.
 */
function regionCollection(r: Region, stateNames?: Set<string>): NamedCollection {
  const inRegion = unitedStates.filter(
    (s) => stateRegion(s.properties.name) === r
  );
  const features =
    stateNames && stateNames.size > 0
      ? inRegion.filter((s) => stateNames.has(s.properties.name))
      : inRegion;
  return { type: "FeatureCollection", features };
}

// State geometry objects (used to merge state borders into region outlines).
const stateGeometries = (stateData as any).objects.states
  .geometries as { properties?: { name?: string } }[];

/**
 * Merged outline for a region — dissolves the internal state borders so the
 * region reads as a single enclosing boundary (Region contains States). Cached
 * so we only run the topojson merge once per region.
 */
const REGION_OUTLINE_CACHE = new Map<Region, unknown>();
function regionOutline(r: Region): unknown {
  if (REGION_OUTLINE_CACHE.has(r)) return REGION_OUTLINE_CACHE.get(r);
  const geoms = stateGeometries.filter(
    (g) => g.properties?.name && stateRegion(g.properties.name) === r
  );
  const geometry = merge(stateTopo as any, geoms as any);
  REGION_OUTLINE_CACHE.set(r, geometry);
  return geometry;
}

// Outlying states whose area/position skews a region's visual centroid.
const OUTLYING_STATES = new Set(["Alaska", "Hawaii"]);

/**
 * Anchor geometry for a region's label — excludes Alaska/Hawaii so the label
 * sits over the contiguous bulk of the region instead of being dragged toward
 * Alaska by its enormous area.
 */
const REGION_LABEL_CACHE = new Map<Region, unknown>();
function regionLabelGeometry(r: Region): unknown {
  if (REGION_LABEL_CACHE.has(r)) return REGION_LABEL_CACHE.get(r);
  const geoms = stateGeometries.filter(
    (g) =>
      g.properties?.name &&
      stateRegion(g.properties.name) === r &&
      !OUTLYING_STATES.has(g.properties.name)
  );
  const geometry = merge(stateTopo as any, geoms as any);
  REGION_LABEL_CACHE.set(r, geometry);
  return geometry;
}

const US_REGIONS: Region[] = ["West", "Central", "East"];

/**
 * Real metro coordinates [lng, lat] for each DMA so drill-in clusters land at
 * their true geographic location within the state (Level 3 of the hierarchy).
 */
const DMA_COORDS: Record<string, [number, number]> = {
  "Los Angeles": [-118.24, 34.05],
  "San Francisco Bay Area": [-122.27, 37.8],
  "San Diego": [-117.16, 32.72],
  "Seattle–Tacoma": [-122.33, 47.61],
  Spokane: [-117.43, 47.66],
  "Dallas–Ft. Worth": [-96.8, 32.78],
  Houston: [-95.37, 29.76],
  Austin: [-97.74, 30.27],
  Chicago: [-87.63, 41.88],
  Springfield: [-89.65, 39.8],
  "New York City": [-74.01, 40.71],
  Buffalo: [-78.88, 42.89],
  Atlanta: [-84.39, 33.75],
  Savannah: [-81.1, 32.08],
  Boston: [-71.06, 42.36],
  "Western Mass": [-72.59, 42.1],
  "Cleveland–Akron": [-81.69, 41.5],
  Columbus: [-82.99, 39.96],
  "Miami–Ft. Lauderdale": [-80.19, 25.76],
  Orlando: [-81.38, 28.54],
  "Tampa Bay": [-82.46, 27.95],
  "Las Vegas": [-115.14, 36.17],
  Reno: [-119.81, 39.53],
  Denver: [-104.99, 39.74],
  "Colorado Springs": [-104.82, 38.83],
  Phoenix: [-112.07, 33.45],
  Tucson: [-110.97, 32.22],
};

/* --------------------------- sample fallback data ------------------------ */
const SAMPLE_ACCOUNTS: MapAccount[] = [
  { id: "a1", name: "Aster Labs", geography: "California", region: "West" },
  { id: "a2", name: "Beacon Works", geography: "Washington", region: "West" },
  { id: "a3", name: "Cobalt Group", geography: "Texas", region: "Central", moved: true },
  { id: "a4", name: "Dovetail Health", geography: "Illinois", region: "Central" },
  { id: "a5", name: "Evergreen Systems", geography: "New York", region: "East" },
  { id: "a6", name: "Fathom Education", geography: "Florida", region: "East" },
  { id: "a7", name: "Grove Hotels", geography: "Colorado", region: "West" },
  { id: "a8", name: "Harbor Events", geography: "Virginia", region: "East", moved: true },
];

/* ------------------------------ component -------------------------------- */
export interface TerritoryMapProps {
  accounts?: MapAccount[];
  /** Called when a marker is clicked — e.g. open your account drawer. */
  onSelectAccount?: (accountId: string) => void;
  /** Active segmentation cut to visualize. Defaults to the Geography cut. */
  colorBy?: ColorBy;
  /** Zoom the map to a single region (progressive "zoom-in" cut). */
  focusRegion?: Region | null;
  /** Controlled drilled-in state (lifted up so it carries across cuts). */
  selectedStateName?: string | null;
  /** Called when the drilled-in state changes (controlled mode). */
  onSelectStateName?: (name: string | null) => void;
  /** Ordered size scale + label driving bubble radius and the size legend. */
  sizeLegend?: { label: string; bands: string[] };
  /**
   * Dim accounts that don't match the filter value. `field` chooses whether to
   * match the color category ("category", default) or the size band ("size").
   */
  filter?: { label: string; value: string; field?: "category" | "size" } | null;
  /** Geography cut: show region containment outlines + cluster markers by DMA. */
  groupByDma?: boolean;
  /**
   * Guided geography drill level. When set, the map is driven by the external
   * hierarchy ladder instead of its own breadcrumb:
   *  - "country": North America, US emphasized; click US to advance.
   *  - "stateRegion": US states colored by region; click selects the region.
   *  - "state": zoomed to `focusRegion`; click selects a single state.
   *  - "zip3": zoomed to the selected state; accounts clustered by ZIP3.
   */
  geoLevel?: "country" | "stateRegion" | "state" | "zip3";
  /** Called at the "country" level when the user picks the United States. */
  onSelectCountry?: () => void;
  /** Called at the "stateRegion" level when the user picks a state region. */
  onSelectStateRegion?: (region: Region) => void;
  className?: string;
}

const NEUTRAL_STATE_FILL = "#E6EEEC"; // light backdrop when a non-geo cut is active
const US_EMPHASIS_FILL = "#9BE7C0"; // soft brand-green — emphasizes the US at the country level
const DEFAULT_SIZE_BANDS = ["SMB", "Mid-Market", "Enterprise"];

export default function TerritoryMap({
  accounts = SAMPLE_ACCOUNTS,
  onSelectAccount,
  colorBy,
  focusRegion = null,
  selectedStateName,
  onSelectStateName,
  sizeLegend,
  filter = null,
  groupByDma = false,
  geoLevel,
  onSelectCountry,
  onSelectStateRegion,
  className = "",
}: TerritoryMapProps) {
  const guided = geoLevel !== undefined;
  const zip3Mode = geoLevel === "zip3";
  const [internalName, setInternalName] = useState<string>("All");

  // Selection is controlled when `selectedStateName` is provided; otherwise the
  // map manages its own drill-down (standalone use).
  const isControlled = selectedStateName !== undefined;
  const selectedName = isControlled ? selectedStateName ?? "All" : internalName;
  const setSelectedName = (name: string) => {
    if (onSelectStateName) onSelectStateName(name === "All" ? null : name);
    if (!isControlled) setInternalName(name);
  };

  // Reset any uncontrolled drill-down when the focused region changes.
  useEffect(() => {
    if (!isControlled) setInternalName("All");
  }, [focusRegion, isControlled]);

  // Geography cut colors the states; any other cut colors the markers.
  const isGeoCut = !colorBy || colorBy.attribute === "region";
  const categoryColor = (v?: string) =>
    colorBy?.categories.find((c) => c.value === v)?.color ?? MARKER_FILL;
  const sizeBands = sizeLegend?.bands ?? DEFAULT_SIZE_BANDS;
  const isDimmed = (a: MapAccount) => {
    if (!filter || filter.value === "All") return false;
    const target = filter.field === "size" ? a.sizeBand : a.category;
    return target !== filter.value;
  };

  // Fast lookup of a state feature by name (for overview markers).
  const stateByName = useMemo(() => {
    const m = new Map<string, NamedFeature>();
    unitedStates.forEach((s) => m.set(s.properties.name, s));
    return m;
  }, []);

  // Only legend the categories that actually appear in this BU's accounts.
  const presentCategories = colorBy
    ? colorBy.categories.filter((c) =>
        accounts.some((a) => a.category === c.value)
      )
    : [];

  const selectedState = useMemo(
    () =>
      selectedName === "All"
        ? undefined
        : unitedStates.find((s) => s.properties.name === selectedName),
    [selectedName]
  );

  const region = selectedState
    ? stateRegion(selectedState.properties.name)
    : undefined;

  // Accounts exactly in the selected state; fall back to the region's accounts
  // so the drill-down always shows something in the compact synthetic set.
  const exact = selectedState
    ? accounts.filter((a) => a.geography === selectedState.properties.name)
    : accounts;
  const usesRegionalSample = Boolean(selectedState && exact.length === 0);
  const markerAccounts = usesRegionalSample
    ? accounts.filter((a) => a.region === region)
    : exact;

  // Projection framing: single state > focused region > full overview.
  const projection = selectedState
    ? geoMercator().fitExtent(
        [
          [85, 55],
          [715, 405],
        ],
        selectedState as any
      )
    : focusRegion
    ? geoMercator().fitExtent(
        [
          [60, 45],
          [740, 415],
        ],
        regionCollection(
          focusRegion,
          new Set(
            accounts
              .filter((a) => a.region === focusRegion)
              .map((a) => a.geography)
          )
        ) as any
      )
    : geoMercator().center([-101, 46]).scale(350).translate([400, 220]);
  const path = geoPath(projection as any);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[#DCE3E1] bg-white ${className}`}
    >
      {/* Toolbar: breadcrumb + controls (hidden in guided mode — the external
          hierarchy ladder drives navigation instead). */}
      {!guided && (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3E1] px-4 py-3 text-sm font-semibold text-[#43536b]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#01EF6C]" />
          <button
            type="button"
            className="text-[#00B8C5] hover:underline"
            onClick={() => setSelectedName("All")}
          >
            North America
          </button>
          {(selectedState || focusRegion) && (
            <>
              <span className="text-[#9aa7b9]">›</span>
              <span className="whitespace-nowrap text-[#60708a]">
                United States
              </span>
            </>
          )}
          {focusRegion && !selectedState && (
            <>
              <span className="text-[#9aa7b9]">›</span>
              <b className="whitespace-nowrap text-[#17201C]">
                {focusRegion} region
              </b>
            </>
          )}
          {selectedState && (
            <>
              <span className="text-[#9aa7b9]">›</span>
              <b className="whitespace-nowrap text-[#17201C]">
                {selectedState.properties.name}
              </b>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-[#EDF5F6] px-2.5 py-1 text-[11px] font-semibold text-[#17201C] sm:inline">
            Cut: {colorBy?.label ?? "Geography"}
          </span>
          {selectedState && (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-bold text-[#00B8C5] hover:bg-[#EDF5F6]"
              onClick={() => setSelectedName("All")}
            >
              ← Overview
            </button>
          )}
          {!focusRegion && (
            <label>
              <span className="sr-only">Choose a state</span>
              <select
                className="rounded-md border border-[#DCE3E1] bg-white px-2.5 py-1.5 text-xs font-medium text-[#17201C]"
                value={selectedState?.properties.name ?? "All"}
                onChange={(e) => setSelectedName(e.target.value)}
              >
                <option value="All">All states</option>
                {unitedStates.map((s) => (
                  <option key={s.properties.name}>{s.properties.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
      )}

      {/* Map */}
      <svg
        viewBox="0 0 800 470"
        role="img"
        aria-labelledby="territory-map-title territory-map-desc"
        className="block h-[425px] w-full"
        style={{
          background:
            "radial-gradient(circle at center, #F9FEFE, #EDF5F6)",
          padding: 12,
        }}
      >
        <title id="territory-map-title">
          {selectedState
            ? `${selectedState.properties.name} territory detail`
            : "North America territory overview"}
        </title>
        <desc id="territory-map-desc">
          {selectedState
            ? `Selected state in the ${region} region. Synthetic account markers are placed within the state.`
            : "Accurate country and US state boundaries. Select a state to drill into its territory."}
        </desc>

        {/* Overview: countries + region-colored states */}
        {!selectedState &&
          !focusRegion &&
          northAmericaCountries.map((c) => (
            <path
              key={c.properties.name}
              d={path(c as any) ?? undefined}
              fill={COUNTRY_FILL}
              stroke={STROKE}
              strokeWidth={1.5}
            >
              <title>{c.properties.name}</title>
            </path>
          ))}

        {!selectedState &&
          unitedStates.map((s) => {
            const name = s.properties.name;
            const r = stateRegion(name);
            // At the "state" level only the active region's states are live;
            // everything else is muted so the region reads as the working set.
            const outOfRegion =
              geoLevel === "state" && focusRegion != null && r !== focusRegion;
            const interactive = !outOfRegion;
            // Fill: country level emphasizes the US in one green tint; region &
            // state levels color by region; non-geo cuts stay neutral.
            const fill = !isGeoCut
              ? NEUTRAL_STATE_FILL
              : outOfRegion
                ? NEUTRAL_STATE_FILL
                : geoLevel === "country"
                  ? US_EMPHASIS_FILL
                  : REGION_FILL[r];
            const handleSelect = () => {
              if (!interactive) return;
              if (geoLevel === "country") return onSelectCountry?.();
              if (geoLevel === "stateRegion") return onSelectStateRegion?.(r);
              setSelectedName(name);
            };
            const title =
              geoLevel === "country"
                ? "United States"
                : geoLevel === "stateRegion"
                  ? `${r} region`
                  : `${name} · ${r}`;
            return (
              <path
                key={name}
                d={path(s as any) ?? undefined}
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-label={
                  geoLevel === "country"
                    ? "Select the United States"
                    : geoLevel === "stateRegion"
                      ? `Select the ${r} state region`
                      : `Open ${name} territory`
                }
                fill={fill}
                stroke={STROKE}
                strokeWidth={0.85}
                strokeOpacity={outOfRegion ? 0.5 : 1}
                style={{
                  cursor: interactive ? "pointer" : "default",
                  transition: "filter .15s, opacity .15s",
                }}
                onClick={handleSelect}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handleSelect()
                }
                onMouseEnter={(e) =>
                  interactive &&
                  (e.currentTarget.style.filter = "brightness(1.12)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
              >
                <title>{title}</title>
              </path>
            );
          })}

        {/* Geography cut: dissolve state borders into enclosing region outlines
            so Region → State containment reads at a glance. */}
        {!selectedState &&
          !focusRegion &&
          isGeoCut &&
          (groupByDma || geoLevel === "stateRegion") &&
          US_REGIONS.map((r) => {
            const outline = regionOutline(r);
            const [lx, ly] = path.centroid(regionLabelGeometry(r) as any);
            return (
              <g key={`region-${r}`} style={{ pointerEvents: "none" }}>
                <path
                  d={path(outline as any) ?? undefined}
                  fill="none"
                  stroke={MARKER_FILL}
                  strokeWidth={2.25}
                  strokeLinejoin="round"
                  strokeOpacity={0.85}
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  className="select-none"
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    fill: MARKER_FILL,
                    paintOrder: "stroke",
                    stroke: "#FFFFFF",
                    strokeWidth: 3,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {r.toUpperCase()}
                </text>
              </g>
            );
          })}

        {/* Overview / region focus: markers placed at their state centroids.
            Hidden during the guided drill (levels 1–4 are about geography
            selection; accounts appear at the ZIP3 leaf). */}
        {!selectedState &&
          !guided &&
          (() => {
            const seen = new Map<string, number>();
            const visible = focusRegion
              ? accounts.filter((a) => a.region === focusRegion)
              : accounts;
            const zoomed = Boolean(focusRegion);
            return visible.map((a) => {
              const feat = stateByName.get(a.geography);
              if (!feat) return null;
              const [cx, cy] = path.centroid(feat as any);
              const n = seen.get(a.geography) ?? 0;
              seen.set(a.geography, n + 1);
              const rr = radiusFor(a.sizeBand, sizeBands) * (zoomed ? 1.5 : 1);
              // Fan out accounts that share a state on a spiral so a cluster of
              // varied-size bubbles stays readable instead of stacking.
              const base = zoomed ? 16 : 10;
              const gap = zoomed ? 8 : 5;
              const spread = n === 0 ? 0 : base + n * gap;
              const dx = Math.cos(n * 2.399) * spread;
              const dy = Math.sin(n * 2.399) * spread;
              // Round so SSR and client render byte-identical coordinates.
              const round = (v: number) => Math.round(v * 100) / 100;
              const dim = isDimmed(a);
              return (
                <circle
                  key={a.id}
                  cx={round(cx + dx)}
                  cy={round(cy + dy)}
                  r={rr}
                  fillOpacity={dim ? 0.15 : 0.9}
                  fill={isGeoCut ? MARKER_FILL : categoryColor(a.category)}
                  stroke={a.moved ? MARKER_MOVED_FILL : STROKE}
                  strokeWidth={a.moved ? 3 : 1.5}
                  strokeOpacity={dim ? 0.3 : 1}
                  style={{ cursor: onSelectAccount ? "pointer" : "default" }}
                  onClick={() => onSelectAccount?.(a.id)}
                >
                  <title>{`${a.name} · ${a.category ?? a.region} · ${a.sizeBand ?? ""}`}</title>
                </circle>
              );
            });
          })()}

        {/* Zoomed: selected state + account markers */}
        {selectedState && (
          <path
            d={path(selectedState as any) ?? undefined}
            fill={isGeoCut ? SELECTED_FILL : "#DCE8E4"}
            stroke={SELECTED_STROKE}
            strokeWidth={2}
            style={{ filter: "drop-shadow(0 9px 10px rgba(23,32,28,.18))" }}
          >
            <title>{selectedState.properties.name}</title>
          </path>
        )}

        {selectedState &&
          !groupByDma &&
          !zip3Mode &&
          markerAccounts.slice(0, 14).map((a, i) => {
            const [cx, cy] = path.centroid(selectedState as any);
            const rr = radiusFor(a.sizeBand, sizeBands) * 1.5;
            // Golden-angle spiral keeps a dense cluster evenly spread.
            const angle = i * 2.399;
            const spread = i === 0 ? 0 : 26 + i * 9;
            const rx = cx + Math.cos(angle) * spread;
            const ry = cy + Math.sin(angle) * spread;
            const dim = isDimmed(a);
            return (
              <circle
                key={a.id}
                cx={rx}
                cy={ry}
                r={rr}
                fillOpacity={dim ? 0.15 : 0.9}
                fill={isGeoCut ? MARKER_FILL : categoryColor(a.category)}
                stroke={a.moved ? MARKER_MOVED_FILL : STROKE}
                strokeWidth={a.moved ? 3.5 : 2}
                strokeOpacity={dim ? 0.3 : 1}
                style={{ cursor: onSelectAccount ? "pointer" : "default" }}
                onClick={() => onSelectAccount?.(a.id)}
              >
                <title>{`${a.name} · ${a.category ?? a.region} · ${a.sizeBand ?? ""}`}</title>
              </circle>
            );
          })}

        {/* Level 5 (leaf): cluster the state's accounts by ZIP3. Each ZIP3 is a
            labeled bubble sized by its account count. ZIP3 polygons aren't
            available, so clusters sit at their DMA's metro coordinate (or a
            ring around the state centroid) — illustrative, not cartographic. */}
        {selectedState &&
          zip3Mode &&
          (() => {
            const [cx, cy] = path.centroid(selectedState as any);
            const groups = new Map<string, MapAccount[]>();
            markerAccounts.forEach((a) => {
              const key = a.zip3 ?? "000";
              (groups.get(key) ?? groups.set(key, []).get(key)!).push(a);
            });
            const entries = Array.from(groups.entries());
            const G = entries.length;
            return entries.map(([zip3, accts], gi) => {
              const coord = accts[0]?.dma ? DMA_COORDS[accts[0].dma] : undefined;
              const projected = coord
                ? (projection([coord[0], coord[1]]) as [number, number] | null)
                : null;
              let gx: number;
              let gy: number;
              if (projected) {
                [gx, gy] = projected;
              } else {
                const gAngle = (gi / G) * Math.PI * 2 - Math.PI / 2;
                const gRadius = G === 1 ? 0 : 78;
                gx = cx + Math.cos(gAngle) * gRadius;
                gy = cy + Math.sin(gAngle) * gRadius;
              }
              // Bubble radius encodes the ZIP3 account count.
              const bubble = 15 + Math.min(accts.length, 8) * 3;
              const dimGroup = accts.every((a) => isDimmed(a));
              return (
                <g key={zip3}>
                  <circle
                    cx={gx}
                    cy={gy}
                    r={bubble}
                    fill={MARKER_FILL}
                    fillOpacity={dimGroup ? 0.08 : 0.14}
                    stroke={MARKER_FILL}
                    strokeOpacity={dimGroup ? 0.3 : 0.7}
                    strokeWidth={1.25}
                  />
                  {/* ZIP3 digits + account count */}
                  <text
                    x={gx}
                    y={gy - 1}
                    textAnchor="middle"
                    className="select-none"
                    style={{ fontSize: 13, fontWeight: 800, fill: MARKER_FILL }}
                  >
                    {zip3}
                  </text>
                  <text
                    x={gx}
                    y={gy + 12}
                    textAnchor="middle"
                    className="select-none"
                    style={{ fontSize: 9, fontWeight: 600, fill: MARKER_FILL, opacity: 0.7 }}
                  >
                    {`${zip3}xx · ${accts.length}`}
                  </text>
                  {/* clickable hit target for the cluster's lead account */}
                  <circle
                    cx={gx}
                    cy={gy}
                    r={bubble}
                    fill="transparent"
                    style={{ cursor: onSelectAccount ? "pointer" : "default" }}
                    onClick={() => accts[0] && onSelectAccount?.(accts[0].id)}
                  >
                    <title>{`ZIP3 ${zip3}xx · ${accts.length} accounts`}</title>
                  </circle>
                </g>
              );
            });
          })()}

        {/* Geography drill-in: cluster the state's accounts by DMA (Level 3),
            each metro labeled and haloed so the third hierarchy level shows. */}
        {selectedState &&
          groupByDma &&
          (() => {
            const [cx, cy] = path.centroid(selectedState as any);
            // Group this state's accounts by DMA.
            const groups = new Map<string, MapAccount[]>();
            markerAccounts.forEach((a) => {
              const key = a.dma ?? "Other";
              (groups.get(key) ?? groups.set(key, []).get(key)!).push(a);
            });
            const entries = Array.from(groups.entries());
            const G = entries.length;
            return entries.map(([dma, accts], gi) => {
              // Place each DMA cluster at its true metro coordinate; fall back
              // to a ring around the state centroid if we lack coordinates.
              const coord = DMA_COORDS[dma];
              const projected = coord
                ? (projection([coord[0], coord[1]]) as [number, number] | null)
                : null;
              let gx: number;
              let gy: number;
              if (projected) {
                [gx, gy] = projected;
              } else {
                const gAngle = (gi / G) * Math.PI * 2 - Math.PI / 2;
                const gRadius = G === 1 ? 0 : 78;
                gx = cx + Math.cos(gAngle) * gRadius;
                gy = cy + Math.sin(gAngle) * gRadius;
              }
              return (
                <g key={dma}>
                  {/* grouping halo */}
                  <circle
                    cx={gx}
                    cy={gy}
                    r={28}
                    fill={MARKER_FILL}
                    fillOpacity={0.05}
                    stroke={MARKER_FILL}
                    strokeOpacity={0.35}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  {/* precise metro pin */}
                  <circle cx={gx} cy={gy} r={1.6} fill={MARKER_FILL} />
                  {/* DMA label pill */}
                  <g transform={`translate(${gx}, ${gy - 44})`}>
                    <rect
                      x={-(dma.length * 3.4 + 10)}
                      y={-9}
                      width={dma.length * 6.8 + 20}
                      height={18}
                      rx={9}
                      fill={MARKER_FILL}
                    />
                    <text
                      textAnchor="middle"
                      y={4}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fill: "#FFFFFF",
                      }}
                    >
                      {dma}
                    </text>
                  </g>
                  {/* accounts within the DMA */}
                  {accts.slice(0, 6).map((a, i) => {
                    const rr = radiusFor(a.sizeBand, sizeBands);
                    const aAngle = i * 2.399;
                    const aSpread = i === 0 ? 0 : 8 + i * 3.5;
                    const ax = gx + Math.cos(aAngle) * aSpread;
                    const ay = gy + Math.sin(aAngle) * aSpread;
                    const dim = isDimmed(a);
                    return (
                      <circle
                        key={a.id}
                        cx={ax}
                        cy={ay}
                        r={rr}
                        fillOpacity={dim ? 0.15 : 0.9}
                        fill={MARKER_FILL}
                        stroke={a.moved ? MARKER_MOVED_FILL : STROKE}
                        strokeWidth={a.moved ? 3 : 1.75}
                        strokeOpacity={dim ? 0.3 : 1}
                        style={{
                          cursor: onSelectAccount ? "pointer" : "default",
                        }}
                        onClick={() => onSelectAccount?.(a.id)}
                      >
                        <title>{`${a.name} · ${dma} · ${a.sizeBand ?? ""}`}</title>
                      </circle>
                    );
                  })}
                </g>
              );
            });
          })()}
      </svg>

      {/* Legend — reflects the active segmentation cut */}
      <div className="flex flex-wrap items-center gap-4 border-t border-[#DCE3E1] px-4 py-3 text-xs text-[#60708a]">
        <span className="font-bold text-[#17201C]">
          {isGeoCut
            ? guided
              ? "Global Region → Country → State Region → State → ZIP3"
              : "Geography · Region → State → DMA"
            : colorBy?.label}
        </span>
        {isGeoCut ? (
          <>
            <LegendDot color={REGION_FILL.West} label="West" />
            <LegendDot color={REGION_FILL.Central} label="Central" />
            <LegendDot color={REGION_FILL.East} label="East" />
            <LegendDot color={REGION_FILL.Canada} label="Canada" />
            {groupByDma && <LegendDma label="DMA cluster" />}
            {zip3Mode && <LegendDma label="ZIP3 cluster" />}
            <LegendDot color={MARKER_FILL} label="Account" />
          </>
        ) : (
          presentCategories.map((c) => (
            <LegendDot key={c.value} color={c.color} label={c.value} />
          ))
        )}
        <span className="mx-1 h-4 w-px bg-[#DCE3E1]" aria-hidden />
        <span className="font-bold text-[#17201C]">
          {sizeLegend?.label ?? "Company size"}
        </span>
        {(sizeLegend?.bands ?? DEFAULT_SIZE_BANDS).map((band, i) => (
          <LegendSize key={band} radius={5 + i * 4} label={band} />
        ))}
        <span className="mx-1 h-4 w-px bg-[#DCE3E1]" aria-hidden />
        <LegendRing label="Moved account" />
      </div>

      {usesRegionalSample && (
        <p className="px-4 pb-3 text-xs text-[#8EA79F]">
          No exact state records in the compact synthetic dataset — showing the{" "}
          {region} regional sample.
        </p>
      )}

      {zip3Mode && (
        <p className="px-4 pb-3 text-xs text-[#8EA79F]">
          Illustrative — ZIP3 shown as clustered accounts (label = the 3 ZIP
          digits, size = account count).
        </p>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function LegendSize({ radius, label }: { radius: number; label: string }) {
  const d = radius; // px diameter proxy for the small legend glyph
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex h-6 w-6 items-center justify-center">
        <i
          className="inline-block rounded-full bg-[#17201C]"
          style={{ width: d, height: d, opacity: 0.85 }}
        />
      </span>
      {label}
    </span>
  );
}

function LegendDma({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i
        className="inline-block h-3 w-3 rounded-full"
        style={{
          border: "1px dashed #17201C",
          background: "rgba(23,32,28,0.05)",
        }}
      />
      {label}
    </span>
  );
}

function LegendRing({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i
        className="inline-block h-2.5 w-2.5 rounded-full bg-white"
        style={{ border: "2px solid #C7F522" }}
      />
      {label}
    </span>
  );
}
