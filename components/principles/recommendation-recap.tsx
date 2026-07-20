import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FOCUS_AREAS } from '@/lib/recommendations'

export function RecommendationRecap() {
  return (
    <div className="flex flex-col gap-5">
      {FOCUS_AREAS.map((area, i) => (
        <div key={area.id} className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="flex size-6 items-center justify-center rounded-md bg-ink text-xs font-bold text-brand-green">
              {i + 1}
            </span>
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-ink">
              {area.title}
            </h3>
            <span className="text-xs text-sage-2">{area.subtitle}</span>
          </div>
          <ul className="grid gap-2.5 md:grid-cols-2">
            {area.recommendations.map((rec) => (
              <li key={rec.id}>
                <Link
                  href={rec.href}
                  className="group flex h-full items-start gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 outline-none transition-colors hover:border-brand-green hover:bg-brand-green/5 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {rec.ordinal && (
                    <span className="mt-0.5 font-mono text-xs font-bold text-brand-teal">
                      {rec.ordinal}
                    </span>
                  )}
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-semibold leading-tight text-ink">
                      {rec.label}
                    </span>
                    <span className="text-xs leading-relaxed text-sage-2">
                      {rec.blurb}
                    </span>
                  </span>
                  <ArrowRight
                    className="mt-0.5 size-4 shrink-0 text-sage-2 transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
