'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_GROUPS, type NavItem } from '@/lib/recommendations'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all duration-150',
        'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        collapsed && 'justify-center px-2',
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_6px_18px_rgba(1,239,108,0.16)]'
          : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {!collapsed && <span className="text-pretty leading-tight">{item.label}</span>}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={link} />
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }
  return link
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-5" aria-label="Primary">
      {NAV_GROUPS.map((group, i) => (
        <div key={group.eyebrow ?? `group-${i}`} className="flex flex-col gap-1">
          {group.eyebrow && !collapsed && (
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sidebar-foreground/45">
              {group.eyebrow}
            </p>
          )}
          {group.eyebrow && collapsed && (
            <div className="mx-auto my-1 h-px w-6 bg-sidebar-border" aria-hidden />
          )}
          {group.items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  )
}
