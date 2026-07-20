'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PAGER_ORDER } from '@/lib/recommendations'
import { Button } from '@/components/ui/button'

/** Bottom pager shown only in Present mode; steps through sections in reading order. */
export function PresentPager() {
  const pathname = usePathname()
  const index = PAGER_ORDER.findIndex((item) => item.href === pathname)
  const current = index === -1 ? 0 : index
  const prev = PAGER_ORDER[current - 1]
  const next = PAGER_ORDER[current + 1]

  return (
    <div className="no-print sticky bottom-0 z-20 border-t border-border/70 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Button
          variant="outline"
          size="sm"
          disabled={!prev}
          nativeButton={false}
          render={
            prev ? (
              <Link href={prev.href}>
                <ChevronLeft className="size-4" data-icon="inline-start" aria-hidden />
                Previous
              </Link>
            ) : (
              <span>
                <ChevronLeft className="size-4" data-icon="inline-start" aria-hidden />
                Previous
              </span>
            )
          }
        />

        <div className="flex min-w-0 flex-col items-center text-center">
          <span className="text-xs font-semibold text-sage-2">
            {current + 1} of {PAGER_ORDER.length}
          </span>
          <span className="truncate text-sm font-medium text-ink">
            {PAGER_ORDER[current]?.label}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!next}
          nativeButton={false}
          render={
            next ? (
              <Link href={next.href}>
                Next
                <ChevronRight className="size-4" data-icon="inline-end" aria-hidden />
              </Link>
            ) : (
              <span>
                Next
                <ChevronRight className="size-4" data-icon="inline-end" aria-hidden />
              </span>
            )
          }
        />
      </div>
    </div>
  )
}
