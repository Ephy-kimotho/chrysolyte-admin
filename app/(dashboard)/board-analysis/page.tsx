import type { Metadata } from "next"

import { ManagementSummaryCard } from "@/components/board-analysis/management-summary-card"
import { PrintSummaryButton } from "@/components/board-analysis/print-summary-button"
import { ProjectSummariesCard } from "@/components/board-analysis/project-summaries-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { formatCompactCurrency } from "@/lib/format"
import { boardAnalysis as analysis } from "@/lib/mock/board-analysis"

export const metadata: Metadata = {
  title: "Board Analysis · Chrysolyte FirmControl",
}

export default function BoardAnalysisPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-bold text-heading">
          Board meeting analysis
        </h2>
        <PrintSummaryButton />
      </div>

      <section
        aria-label="Portfolio figures"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          value={`${analysis.averageProgress}%`}
          label="Portfolio progress"
        />
        <StatCard
          value={formatCompactCurrency(analysis.contractValue)}
          label="Contract value"
        />
        <StatCard
          value={formatCompactCurrency(analysis.receipts)}
          label="Receipts"
        />
        <StatCard
          value={formatCompactCurrency(analysis.costs)}
          label="Recorded costs"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ManagementSummaryCard analysis={analysis} />
        </div>
        <div className="xl:col-span-2">
          <ProjectSummariesCard projects={analysis.projects} />
        </div>
      </div>
    </div>
  )
}
