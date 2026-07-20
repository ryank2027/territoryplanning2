import { CONTAINER_RULES } from '@/lib/planning'
import { cn } from '@/lib/utils'

/** Trigger → system logic table for TBH / vacant territory containers. */
export function ContainerRulesTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="px-4 py-3 font-semibold text-ink">Trigger</th>
            <th className="px-4 py-3 font-semibold text-ink">System logic</th>
            <th className="px-4 py-3 font-semibold text-ink whitespace-nowrap">
              Boundary change
            </th>
          </tr>
        </thead>
        <tbody>
          {CONTAINER_RULES.map((rule, i) => (
            <tr
              key={rule.trigger}
              className={cn(
                'align-top',
                i % 2 === 0 ? 'bg-surface' : 'bg-card',
              )}
            >
              <td className="px-4 py-3 font-semibold text-ink">{rule.trigger}</td>
              <td className="px-4 py-3 leading-relaxed text-ink-2">{rule.logic}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                    rule.permanent
                      ? 'bg-brand-purple/10 text-brand-purple'
                      : 'bg-muted text-sage-2',
                  )}
                >
                  {rule.permanent ? 'Permanent' : 'No change'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
