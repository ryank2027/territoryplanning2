import type { LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** White content card on the tint background with an optional icon + title. */
export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <Card
      className={cn(
        'overflow-hidden border-border/70 bg-card shadow-[0_1px_2px_rgba(20,32,26,0.04),0_14px_36px_rgba(20,32,26,0.04)]',
        className,
      )}
    >
      {(title || description || action) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/45 pb-4">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ink text-brand-green shadow-sm">
                <Icon className="size-5" aria-hidden />
              </span>
            )}
            <div className="flex flex-col gap-1">
              {title && (
                <CardTitle className="text-base font-bold text-ink">
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="leading-relaxed">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {action}
        </CardHeader>
      )}
      <CardContent className={cn('text-sm leading-relaxed text-ink-2', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
