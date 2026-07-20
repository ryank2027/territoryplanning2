'use client'

import { cn } from '@/lib/utils'

/**
 * Lightweight, dependency-free SVG/CSS chart primitives themed to the
 * dashboard palette. Categorical series colors are drawn from theme tokens;
 * red (#e5484d = --destructive) is reserved for critical states by callers.
 */
export const SERIES = [
  '#00b8c5', // brand teal
  '#12b866', // green (readable brand-green variant)
  '#33413b', // ink-2 (dark neutral)
  '#c7f522', // brand lime
  '#8ea79f', // sage
]

const AXIS = '#5f736d' // sage-2
const GRID = '#cfdcd6' // border

/* --------------------------------------------------------------- Legend */
export function Legend({
  items,
}: {
  items: { label: string; color: string }[]
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-xs text-sage-2">
          <span
            className="size-2.5 rounded-[3px]"
            style={{ background: it.color }}
            aria-hidden
          />
          {it.label}
        </span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- HBarChart */
export function HBarChart({
  data,
  reference,
  format = (n) => `${n}`,
  unit = '',
}: {
  data: { label: string; value: number; color?: string }[]
  reference?: { value: number; label: string }
  format?: (n: number) => string
  unit?: string
}) {
  const max = Math.max(1, ...data.map((d) => d.value), reference?.value ?? 0)
  const refPct = reference ? (reference.value / max) * 100 : 0
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-right text-xs text-ink-2" title={d.label}>
            {d.label}
          </span>
          <div className="relative h-5 flex-1 rounded bg-muted/50">
            {reference && (
              <span
                className="absolute inset-y-0 z-10 w-px bg-ink/50"
                style={{ left: `${refPct}%` }}
                aria-hidden
              />
            )}
            <div
              className="flex h-5 items-center justify-end rounded px-1.5"
              style={{
                width: `${Math.max(2, (d.value / max) * 100)}%`,
                background: d.color ?? SERIES[0],
              }}
            >
              <span className="text-[10px] font-semibold text-white/95">
                {format(d.value)}
                {unit}
              </span>
            </div>
          </div>
        </div>
      ))}
      {reference && (
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0" />
          <div className="relative flex-1">
            <span
              className="absolute -top-1 text-[10px] text-sage-2"
              style={{ left: `${refPct}%`, transform: 'translateX(-50%)' }}
            >
              {reference.label}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ----------------------------------------------------- vertical bar base */
function VBars({
  data,
  series,
  format,
  stacked,
}: {
  data: { label: string; values: number[] }[]
  series: { name: string; color: string }[]
  format: (n: number) => string
  stacked: boolean
}) {
  const W = 640
  const H = 240
  const padL = 8
  const padB = 28
  const chartH = H - padB
  const max = stacked
    ? Math.max(1, ...data.map((d) => d.values.reduce((a, b) => a + b, 0)))
    : Math.max(1, ...data.flatMap((d) => d.values))
  const groupW = (W - padL) / data.length
  const gridVals = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        {gridVals.map((g) => {
          const y = chartH - g * chartH
          return (
            <g key={g}>
              <line x1={padL} y1={y} x2={W} y2={y} stroke={GRID} strokeWidth={1} />
              <text x={0} y={y - 2} fontSize={9} fill={AXIS}>
                {format(max * g)}
              </text>
            </g>
          )
        })}
        {data.map((d, gi) => {
          const gx = padL + gi * groupW
          if (stacked) {
            let acc = 0
            return (
              <g key={d.label}>
                {d.values.map((v, si) => {
                  const h = (v / max) * chartH
                  const y = chartH - acc - h
                  acc += h
                  const bw = groupW * 0.6
                  return (
                    <rect
                      key={si}
                      x={gx + (groupW - bw) / 2}
                      y={y}
                      width={bw}
                      height={Math.max(0, h)}
                      fill={series[si]?.color ?? SERIES[si]}
                    />
                  )
                })}
                <text x={gx + groupW / 2} y={H - 10} fontSize={9} fill={AXIS} textAnchor="middle">
                  {d.label}
                </text>
              </g>
            )
          }
          const bw = (groupW * 0.72) / series.length
          const start = gx + groupW * 0.14
          return (
            <g key={d.label}>
              {d.values.map((v, si) => {
                const h = (v / max) * chartH
                return (
                  <rect
                    key={si}
                    x={start + si * bw}
                    y={chartH - h}
                    width={Math.max(1, bw - 2)}
                    height={Math.max(0, h)}
                    fill={series[si]?.color ?? SERIES[si]}
                    rx={1}
                  />
                )
              })}
              <text x={gx + groupW / 2} y={H - 10} fontSize={9} fill={AXIS} textAnchor="middle">
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
      <Legend items={series.map((s) => ({ label: s.name, color: s.color }))} />
    </div>
  )
}

export function GroupedBarChart({
  data,
  series,
  format = (n) => `${n}`,
}: {
  data: { label: string; values: number[] }[]
  series: { name: string; color: string }[]
  format?: (n: number) => string
}) {
  return <VBars data={data} series={series} format={format} stacked={false} />
}

export function StackedBarChart({
  data,
  series,
  format = (n) => `${n}`,
}: {
  data: { label: string; values: number[] }[]
  series: { name: string; color: string }[]
  format?: (n: number) => string
}) {
  return <VBars data={data} series={series} format={format} stacked />
}

/* ------------------------------------------------------------- LineChart */
export function LineChart({
  data,
  series,
  format = (n) => `${n}`,
}: {
  data: { label: string; values: number[] }[]
  series: { name: string; color: string; dashed?: boolean }[]
  format?: (n: number) => string
}) {
  const W = 640
  const H = 240
  const padL = 8
  const padB = 26
  const chartH = H - padB
  const max = Math.max(1, ...data.flatMap((d) => d.values))
  const n = data.length
  const x = (i: number) => padL + (i / Math.max(1, n - 1)) * (W - padL)
  const y = (v: number) => chartH - (v / max) * chartH
  const gridVals = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        {gridVals.map((g) => {
          const gy = chartH - g * chartH
          return (
            <g key={g}>
              <line x1={padL} y1={gy} x2={W} y2={gy} stroke={GRID} strokeWidth={1} />
              <text x={0} y={gy - 2} fontSize={9} fill={AXIS}>
                {format(max * g)}
              </text>
            </g>
          )
        })}
        {series.map((s, si) => {
          const pts = data.map((d, i) => `${x(i)},${y(d.values[si])}`).join(' ')
          return (
            <polyline
              key={s.name}
              points={pts}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? '5 4' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        })}
        {data.map((d, i) => (
          <text key={d.label} x={x(i)} y={H - 8} fontSize={9} fill={AXIS} textAnchor="middle">
            {d.label}
          </text>
        ))}
      </svg>
      <Legend items={series.map((s) => ({ label: s.name, color: s.color }))} />
    </div>
  )
}

/* ------------------------------------------------------------ DonutChart */
export function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[]
}) {
  const total = Math.max(1, data.reduce((a, d) => a + d.value, 0))
  const r = 60
  const circ = 2 * Math.PI * r
  let acc = 0
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 160 160" className="h-40 w-40" role="img">
        <g transform="rotate(-90 80 80)">
          <circle cx={80} cy={80} r={r} fill="none" stroke={GRID} strokeWidth={20} />
          {data.map((d) => {
            const len = (d.value / total) * circ
            const seg = (
              <circle
                key={d.label}
                cx={80}
                cy={80}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={20}
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-acc}
              />
            )
            acc += len
            return seg
          })}
        </g>
      </svg>
      <Legend
        items={data.map((d) => ({
          label: `${d.label} · ${Math.round((d.value / total) * 100)}%`,
          color: d.color,
        }))}
      />
    </div>
  )
}

/* --------------------------------------------------------------- Heatmap */
function lerpColor(a: number[], b: number[], t: number) {
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}
function mix(ratio: number) {
  // 0 -> destructive red, 0.5 -> lime, 1 -> teal
  const clamp = Math.max(0, Math.min(1, ratio))
  if (clamp < 0.5) {
    const t = clamp / 0.5
    return lerpColor([229, 72, 77], [199, 245, 34], t)
  }
  const t = (clamp - 0.5) / 0.5
  return lerpColor([199, 245, 34], [0, 184, 197], t)
}

export function Heatmap({
  rows,
  cols,
  cell,
}: {
  rows: string[]
  cols: string[]
  cell: (row: string, col: string) => { value: number | null; label: string }
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="text-left" />
            {cols.map((c) => (
              <th key={c} className="px-1 pb-1 text-center text-[10px] font-semibold text-sage-2">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="whitespace-nowrap pr-2 text-[11px] font-medium text-ink-2">{row}</td>
              {cols.map((col) => {
                const { value, label } = cell(row, col)
                const bg = value == null ? '#dbe7e2' : mix(value)
                const dark = value != null && value >= 0.42 && value < 0.9
                return (
                  <td key={col} className="p-0">
                    <div
                      className={cn(
                        'flex h-9 min-w-12 items-center justify-center rounded text-[11px] font-semibold',
                        value == null ? 'text-sage-2' : dark ? 'text-ink' : 'text-white',
                      )}
                      style={{ background: bg }}
                    >
                      {label}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------------------------------------------------------- BubbleScatter */
export function BubbleScatter({
  points,
  xLabel,
  yLabel,
  legend,
}: {
  points: { x: number; y: number; r: number; color: string; title: string }[]
  xLabel: string
  yLabel: string
  legend?: { label: string; color: string }[]
}) {
  const W = 640
  const H = 300
  const padL = 44
  const padB = 34
  const padT = 10
  const padR = 12
  const chartW = W - padL - padR
  const chartH = H - padB - padT

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const xMin = Math.min(...xs, 0)
  const xMax = Math.max(...xs, 1)
  const yMin = Math.min(...ys, 0)
  const yMax = Math.max(...ys, 1)
  const rMax = Math.max(1, ...points.map((p) => p.r))

  const px = (x: number) => padL + ((x - xMin) / (xMax - xMin || 1)) * chartW
  const py = (y: number) => padT + chartH - ((y - yMin) / (yMax - yMin || 1)) * chartH
  const pr = (r: number) => 5 + (Math.sqrt(r) / Math.sqrt(rMax)) * 16
  const grid = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="flex flex-col gap-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img">
        {grid.map((g) => {
          const gy = padT + chartH - g * chartH
          return (
            <g key={`h${g}`}>
              <line x1={padL} y1={gy} x2={W - padR} y2={gy} stroke={GRID} strokeWidth={1} />
              <text x={padL - 4} y={gy + 3} fontSize={9} fill={AXIS} textAnchor="end">
                {Math.round(yMin + (yMax - yMin) * g)}
              </text>
            </g>
          )
        })}
        {grid.map((g) => {
          const gx = padL + g * chartW
          return (
            <text key={`x${g}`} x={gx} y={H - padB + 14} fontSize={9} fill={AXIS} textAnchor="middle">
              {Math.round(xMin + (xMax - xMin) * g)}
            </text>
          )
        })}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={px(p.x)}
            cy={py(p.y)}
            r={pr(p.r)}
            fill={p.color}
            fillOpacity={0.6}
            stroke={p.color}
            strokeWidth={1}
          >
            <title>{p.title}</title>
          </circle>
        ))}
        <text x={padL + chartW / 2} y={H - 2} fontSize={10} fill={AXIS} textAnchor="middle">
          {xLabel}
        </text>
        <text
          x={12}
          y={padT + chartH / 2}
          fontSize={10}
          fill={AXIS}
          textAnchor="middle"
          transform={`rotate(-90 12 ${padT + chartH / 2})`}
        >
          {yLabel}
        </text>
      </svg>
      {legend && <Legend items={legend} />}
    </div>
  )
}

/* ------------------------------------------------------------ SegmentBar */
export function SegmentBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[]
}) {
  const total = Math.max(1, segments.reduce((a, s) => a + s.value, 0))
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-6 w-full overflow-hidden rounded-md">
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-center text-[10px] font-bold text-white"
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.label}: ${s.value}`}
          >
            {s.value / total > 0.08 ? s.value : ''}
          </div>
        ))}
      </div>
      <Legend items={segments.map((s) => ({ label: s.label, color: s.color }))} />
    </div>
  )
}
