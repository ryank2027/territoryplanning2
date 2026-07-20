import { cn } from '@/lib/utils'

/** 11–12px uppercase label with wide tracking, sage-2 / teal. */
export function Eyebrow({
  children,
  className,
  tone = 'sage',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'sage' | 'teal'
}) {
  return (
    <p
      className={cn(
        'text-[11px] font-bold uppercase tracking-[0.14em]',
        tone === 'teal' ? 'text-brand-teal' : 'text-sage-2',
        className,
      )}
    >
      {children}
    </p>
  )
}
