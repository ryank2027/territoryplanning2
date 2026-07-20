'use client'

import { useState } from 'react'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WorkspaceProvider, useWorkspace } from './workspace-provider'
import { SidebarNav } from './sidebar-nav'
import { TopBar } from './top-bar'
import { PresentPager } from './present-pager'
import { BrandMark } from './brand-mark'

function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        'no-print sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[8px_0_32px_rgba(20,32,26,0.08)] transition-[width] duration-200 lg:flex',
        collapsed ? 'w-[76px]' : 'w-[272px]',
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          collapsed && 'justify-center px-2',
        )}
      >
        <BrandMark showWordmark={!collapsed} onDark />
      </div>

      <ScrollArea className="flex-1">
        <div className={cn('p-3', collapsed && 'px-2')}>
          <SidebarNav collapsed={collapsed} />
        </div>
      </ScrollArea>

      <div
        className={cn(
          'border-t border-sidebar-border p-3',
          collapsed && 'px-2',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'w-full text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            collapsed && 'w-auto',
          )}
        >
          {collapsed ? (
            <PanelLeft className="size-4" aria-hidden />
          ) : (
            <>
              <PanelLeftClose className="size-4" data-icon="inline-start" aria-hidden />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const { mode } = useWorkspace()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-surface"
      >
        Skip to content
      </a>

      <DesktopSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      {/* Mobile slide-over drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle className="text-left">
              <BrandMark onDark />
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100dvh-4rem)]">
            <div className="p-3">
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMenu={() => setMobileOpen(true)} />
        <main
          id="main-content"
          className={cn(
            'mx-auto w-full max-w-[1560px] flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-10 xl:px-10',
            mode === 'present' && 'md:py-12',
          )}
        >
          {children}
        </main>
        {mode === 'present' && <PresentPager />}
      </div>
    </div>
  )
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <ShellInner>{children}</ShellInner>
    </WorkspaceProvider>
  )
}
