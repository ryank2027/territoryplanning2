import type { Metadata } from 'next'
import { PageHeader } from '@/components/primitives/page-header'
import { HubGrid } from '@/components/prerequisites/hub-grid'

export const metadata: Metadata = {
  title: 'Prerequisites | Cvent Territory Design',
  description:
    'The four business foundations each BU defines before territory planning begins.',
}

export default function PrerequisitesHubPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Prerequisites"
        title="What we need from the business"
        lede="Before territory planning begins, each business unit defines four foundations: a documented ICP, business goals and route to market, roles and org structure, and clean, validated data. Together they form a readiness gate."
      />

      <HubGrid />
    </div>
  )
}
