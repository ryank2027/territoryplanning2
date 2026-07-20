import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Official Cvent wordmark. Uses the provided brand logo asset.
 * When the wordmark is hidden (collapsed sidebar) a compact green
 * monogram tile is shown instead.
 */
export function BrandMark({
  showWordmark = true,
  className,
}: {
  showWordmark?: boolean
  className?: string
  /** kept for API compatibility; the green logo works on light and dark */
  onDark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      {showWordmark ? (
        <Image
          src="/cvent-logo-green.png"
          alt="Cvent"
          width={104}
          height={26}
          priority
          className="h-6 w-auto"
        />
      ) : (
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-md bg-brand-green text-ink"
        >
          <span className="text-base font-bold leading-none tracking-tight">c</span>
        </span>
      )}
      <span className="sr-only">Cvent</span>
    </span>
  )
}
