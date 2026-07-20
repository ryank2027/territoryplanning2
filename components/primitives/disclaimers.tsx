import { Info, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

const DISCLAIMER_COPY = {
  guardrails:
    'Illustrative guardrails. Thresholds and findings support design discussion; they do not represent approved Cvent policy.',
  architecture:
    'Architecture approval required. Final Salesforce architecture requires CRM, data, security, and governance approval.',
  weights:
    'Weights in the Account Score, Workload Index, and Rep Skill Score are an illustrative starting point, pending validation with Sales Ops and Finance.',
} as const

export type DisclaimerKind = keyof typeof DISCLAIMER_COPY

/** Inline disclaimer note. Place in footers of validation/coverage sections and near any formula. */
export function Disclaimer({
  kind,
  className,
}: {
  kind: DisclaimerKind
  className?: string
}) {
  const Icon = kind === 'architecture' ? ShieldAlert : Info
  return (
    <p
      className={cn(
        'flex items-start gap-2 text-xs leading-relaxed text-sage-2',
        className,
      )}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{DISCLAIMER_COPY[kind]}</span>
    </p>
  )
}
