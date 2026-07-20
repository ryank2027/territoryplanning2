import type { Metadata } from 'next'
import { PageHeader } from '@/components/primitives/page-header'
import { ReadinessGate } from '@/components/prerequisites/readiness-gate'

export const metadata: Metadata = {
  title: 'Readiness Gate | Prerequisites',
  description:
    'An interactive gate: mark each of the four prerequisites as documented to unlock territory planning.',
}

export default function ReadinessGatePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Prerequisites: Readiness Gate"
        title="Readiness Gate"
        lede="Mark each of the four prerequisites as documented. When all four are green, the workspace unlocks a Ready for territory planning state. If any is unset, it flags the missing element to RevOps."
      />

      <ReadinessGate />
    </div>
  )
}
