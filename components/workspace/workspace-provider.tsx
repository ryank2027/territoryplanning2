'use client'

// In-memory session state for the whole workspace. NO localStorage or
// sessionStorage. Everything lives in React memory for the session.
// Config export/import is via JSON file download / upload only.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type WorkspaceMode = 'explore' | 'present'

export type DecisionStatus = 'required' | 'accepted' | 'challenged' | 'deferred'

export type BusinessUnit = 'commercial' | 'enterprise' | 'hospitality'

/** The four prerequisite elements gated before territory planning. */
export type PrereqKey = 'icp' | 'goals' | 'roles' | 'data'

export type PrereqReadiness = Record<PrereqKey, boolean>

/** Shape of the config we export / import as JSON. */
export interface WorkspaceConfig {
  version: 1
  period: string
  mode: WorkspaceMode
  businessUnit: BusinessUnit
  decisions: Record<string, DecisionStatus>
  readiness: PrereqReadiness
}

interface WorkspaceContextValue extends WorkspaceConfig {
  setMode: (mode: WorkspaceMode) => void
  toggleMode: () => void
  setBusinessUnit: (bu: BusinessUnit) => void
  setDecision: (id: string, status: DecisionStatus) => void
  setReadiness: (key: PrereqKey, documented: boolean) => void
  exportConfig: () => void
  importConfig: (file: File) => Promise<void>
  reset: () => void
}

const DEFAULT_READINESS: PrereqReadiness = {
  icp: false,
  goals: false,
  roles: false,
  data: false,
}

const DEFAULT_CONFIG: WorkspaceConfig = {
  version: 1,
  period: 'FY26',
  mode: 'explore',
  businessUnit: 'commercial',
  decisions: {},
  readiness: DEFAULT_READINESS,
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

const MAX_IMPORT_BYTES = 256 * 1024 // reject oversized files

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<WorkspaceConfig>(DEFAULT_CONFIG)

  const setMode = useCallback(
    (mode: WorkspaceMode) => setConfig((c) => ({ ...c, mode })),
    [],
  )
  const toggleMode = useCallback(
    () =>
      setConfig((c) => ({
        ...c,
        mode: c.mode === 'explore' ? 'present' : 'explore',
      })),
    [],
  )
  const setBusinessUnit = useCallback(
    (businessUnit: BusinessUnit) => setConfig((c) => ({ ...c, businessUnit })),
    [],
  )
  const setDecision = useCallback(
    (id: string, status: DecisionStatus) =>
      setConfig((c) => ({
        ...c,
        decisions: { ...c.decisions, [id]: status },
      })),
    [],
  )
  const setReadiness = useCallback(
    (key: PrereqKey, documented: boolean) =>
      setConfig((c) => ({
        ...c,
        readiness: { ...c.readiness, [key]: documented },
      })),
    [],
  )

  const exportConfig = useCallback(() => {
    if (typeof window === 'undefined') return
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cvent-territory-config-${config.period.toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [config])

  const importConfig = useCallback(async (file: File) => {
    if (file.size > MAX_IMPORT_BYTES) {
      throw new Error('File is too large (max 256 KB).')
    }
    const text = await file.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error('File is not valid JSON.')
    }
    if (!isWorkspaceConfig(parsed)) {
      throw new Error('File does not match the expected config schema.')
    }
    // Normalize readiness so older configs without the field stay valid.
    setConfig({
      ...DEFAULT_CONFIG,
      ...parsed,
      readiness: { ...DEFAULT_READINESS, ...(parsed.readiness ?? {}) },
    })
  }, [])

  const reset = useCallback(() => setConfig(DEFAULT_CONFIG), [])

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      ...config,
      setMode,
      toggleMode,
      setBusinessUnit,
      setDecision,
      setReadiness,
      exportConfig,
      importConfig,
      reset,
    }),
    [
      config,
      setMode,
      toggleMode,
      setBusinessUnit,
      setDecision,
      setReadiness,
      exportConfig,
      importConfig,
      reset,
    ],
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return ctx
}

// Minimal runtime validation for imported JSON.
function isWorkspaceConfig(value: unknown): value is WorkspaceConfig {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if (v.version !== 1) return false
  if (typeof v.period !== 'string') return false
  if (v.mode !== 'explore' && v.mode !== 'present') return false
  const validBu = ['commercial', 'enterprise', 'hospitality']
  if (typeof v.businessUnit !== 'string' || !validBu.includes(v.businessUnit)) {
    return false
  }
  if (
    typeof v.decisions !== 'object' ||
    v.decisions === null ||
    Array.isArray(v.decisions)
  ) {
    return false
  }
  return true
}
