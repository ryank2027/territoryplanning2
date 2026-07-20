import { cn } from '@/lib/utils'
import type { VizTone } from '@/lib/monitoring'

const STROKE: Record<VizTone, string> = {
  green: '#01ef6c',
  teal: '#00b8c5',
  lime: '#c7f522',
  purple: '#ab3eff',
  sage: '#5f736d',
}

/**
 * Compact area sparkline built from a numeric series. Pure SVG, no deps.
 * Coordinates are rounded so server and client renders match byte-for-byte.
 */
export function Sparkline({
  series,
  tone = 'teal',
  className,
  width = 120,
  height = 36,
}: {
  series: number[]
  tone?: VizTone
  className?: string
  width?: number
  height?: number
}) {
  if (series.length < 2) return null

  const min = Math.min(...series)
  const max = Math.max(...series)
  const span = max - min || 1
  const pad = 3
  const stepX = (width - pad * 2) / (series.length - 1)

  const round = (v: number) => Math.round(v * 100) / 100
  const points = series.map((v, i) => {
    const x = pad + i * stepX
    const y = pad + (height - pad * 2) * (1 - (v - min) / span)
    return [round(x), round(y)] as const
  })

  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const areaPath =
    `M ${points[0][0]},${height - pad} ` +
    points.map(([x, y]) => `L ${x},${y}`).join(' ') +
    ` L ${points[points.length - 1][0]},${height - pad} Z`

  const color = STROKE[tone]
  const gradId = `spark-${tone}`
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-9 w-full', className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={2.4} fill={color} />
    </svg>
  )
}
