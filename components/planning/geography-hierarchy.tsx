import { ChevronRight } from 'lucide-react'
import { GEO_HIERARCHY } from '@/lib/planning'
import { Eyebrow } from '@/components/primitives/eyebrow'

/** Five-level geography hierarchy: Global Region → Country → State Region → State → ZIP3. */
export function GeographyHierarchy() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Eyebrow tone="teal">Geography hierarchy</Eyebrow>
        <p className="text-sm leading-relaxed text-ink-2">
          Five shared levels form the backbone every business unit builds on.
        </p>
      </div>

      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {GEO_HIERARCHY.map((geo, i) => (
          <li
            key={geo.level}
            className="relative flex flex-col gap-2 rounded-xl border border-border/70 bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-7 items-center justify-center rounded-md bg-ink text-xs font-bold text-brand-green">
                {i + 1}
              </span>
              <Eyebrow tone="sage">{geo.level}</Eyebrow>
            </div>
            <p className="text-base font-bold text-ink">{geo.name}</p>
            <p className="text-sm leading-relaxed text-ink-2">{geo.detail}</p>
            <p className="mt-auto rounded-md bg-muted px-2 py-1 font-mono text-xs text-sage-2">
              e.g. {geo.example}
            </p>
            {i < GEO_HIERARCHY.length - 1 && (
              <ChevronRight
                className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-sage-2 xl:block"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
