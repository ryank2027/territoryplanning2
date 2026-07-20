import type { Metadata } from 'next'
import { FoundationPage } from '@/components/prerequisites/foundation-page'
import { FOUNDATION_BY_SLUG } from '@/lib/prerequisites'

const content = FOUNDATION_BY_SLUG['business-goals']

export const metadata: Metadata = {
  title: `${content.title} | Prerequisites`,
  description: content.lede,
}

export default function BusinessGoalsPage() {
  return <FoundationPage content={content} />
}
