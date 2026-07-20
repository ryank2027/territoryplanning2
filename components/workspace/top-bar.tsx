'use client'

import { useRef, useState } from 'react'
import {
  Download,
  Menu,
  Monitor,
  Presentation,
  Printer,
  RotateCcw,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useWorkspace } from './workspace-provider'
import { cn } from '@/lib/utils'

function IconAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: typeof Download
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            aria-label={label}
            className="text-ink-2 hover:text-ink"
          >
            <Icon className="size-4" aria-hidden />
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { period, mode, setMode, exportConfig, importConfig, reset } =
    useWorkspace()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-importing the same file
    if (!file) return
    try {
      await importConfig(file)
      setImportError(null)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.')
    }
  }

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-surface/95 shadow-[0_1px_8px_rgba(20,32,26,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" aria-hidden />
        </Button>

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-bold tracking-tight text-ink">
            <span className="sm:hidden">Territory workspace</span>
            <span className="hidden sm:inline">Territory Design Workspace</span>
          </span>
          <span className="hidden text-xs text-sage-2 md:block">
            Cvent · end-to-end territory design recommendation
          </span>
        </div>

        <span className="shrink-0 rounded-full border border-brand-green/40 bg-brand-green/10 px-2 py-1 text-[11px] font-bold tracking-wide text-ink sm:px-2.5 sm:text-xs">
          {period}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {/* Present / Explore mode toggle */}
          <div
            className="flex items-center rounded-lg border border-border bg-muted/60 p-0.5"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              onClick={() => setMode('explore')}
              aria-pressed={mode === 'explore'}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors sm:px-2.5',
                mode === 'explore'
                  ? 'bg-card text-ink shadow-sm'
                  : 'text-sage-2 hover:text-ink',
              )}
            >
              <Monitor className="size-3.5" aria-hidden />
              Explore
            </button>
            <button
              type="button"
              onClick={() => setMode('present')}
              aria-pressed={mode === 'present'}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors sm:px-2.5',
                mode === 'present'
                  ? 'bg-card text-ink shadow-sm'
                  : 'text-sage-2 hover:text-ink',
              )}
            >
              <Presentation className="size-3.5" aria-hidden />
              Present
            </button>
          </div>

          <div className="hidden items-center gap-0.5 sm:flex">
            <IconAction label="Export config (JSON)" icon={Download} onClick={exportConfig} />
            <IconAction
              label="Import config (JSON)"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
            />
            <IconAction label="Print / PDF" icon={Printer} onClick={() => window.print()} />
            <IconAction label="Reset workspace" icon={RotateCcw} onClick={reset} />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={handleImportFile}
            aria-hidden
          />
        </div>
      </div>

      {importError && (
        <div
          role="status"
          className="border-t border-destructive/30 bg-destructive/10 px-6 py-1.5 text-xs font-medium text-destructive"
        >
          Import failed: {importError}
        </div>
      )}
    </header>
  )
}
