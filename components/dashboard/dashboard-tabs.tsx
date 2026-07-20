"use client"

import { useState } from "react"
import { BarChart3, Map, Activity, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { REPS } from "@/lib/territory-data"
import { RevenueView } from "./revenue-view"
import { CoverageView } from "./coverage-view"
import { ProductivityView } from "./productivity-view"
import { BalanceView } from "./balance-view"

const TABS = [
  { id: "revenue", label: "Revenue & Quota", icon: BarChart3 },
  { id: "coverage", label: "Coverage & Penetration", icon: Map },
  { id: "productivity", label: "Productivity & Activity", icon: Activity },
  { id: "balance", label: "Balance & Fairness", icon: Scale },
] as const

type TabId = (typeof TABS)[number]["id"]

export function DashboardTabs() {
  const [active, setActive] = useState<TabId>("revenue")

  return (
    <div className="flex flex-col gap-5">
      {/* Dashboard switcher */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div
          role="tablist"
          aria-label="Territory dashboards"
          className="flex min-w-[640px] gap-1.5 rounded-xl border border-border/70 bg-surface p-1.5 shadow-sm sm:min-w-0"
        >
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-ink text-brand-green shadow-sm"
                  : "text-sage-2 hover:bg-muted/60 hover:text-ink",
              )}
            >
              <Icon className="size-4" aria-hidden />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          )
          })}
        </div>
      </div>

      {active === "revenue" && <RevenueView reps={REPS} />}
      {active === "coverage" && <CoverageView reps={REPS} />}
      {active === "productivity" && <ProductivityView reps={REPS} />}
      {active === "balance" && <BalanceView reps={REPS} />}
    </div>
  )
}
