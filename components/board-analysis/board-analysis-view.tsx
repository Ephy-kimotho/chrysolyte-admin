"use client"

import { useMemo } from "react"

import { ManagementSummaryCard } from "@/components/board-analysis/management-summary-card"
import { PrintSummaryButton } from "@/components/board-analysis/print-summary-button"
import { ProjectSummariesCard } from "@/components/board-analysis/project-summaries-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { LoadError } from "@/components/load-error"
import { Skeleton } from "@/components/ui/skeleton"
import { useBoardAnalysis } from "@/hooks/use-board-analysis"
import { useProjects } from "@/hooks/use-projects"
import { formatCompactCurrency } from "@/lib/format"

export function BoardAnalysisView() {
  const analysisQuery = useBoardAnalysis()
  const analysis = analysisQuery.data

  // The board endpoint has no progress, so take it from the projects list.
  const { data: projects } = useProjects()
  const progressById = useMemo(
    () => new Map(projects?.map((project) => [project.id, project.progress])),
    [projects]
  )

  const averageProgress = useMemo(() => {
    const known = (analysis?.projects ?? [])
      .map((project) => progressById.get(project.id))
      .filter((progress) => progress !== undefined)
    if (known.length === 0) return null
    return Math.round(
      known.reduce((total, progress) => total + progress, 0) / known.length
    )
  }, [analysis, progressById])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-bold text-heading">
          Board meeting analysis
        </h2>
        {analysis && <PrintSummaryButton />}
      </div>

      {analysisQuery.isPending ? (
        <BoardAnalysisSkeleton />
      ) : analysisQuery.isError ? (
        <LoadError
          error={analysisQuery.error}
          fallback="We couldn't load the board analysis."
          onRetry={() => analysisQuery.refetch()}
          isRetrying={analysisQuery.isFetching}
        />
      ) : (
        <>
          <section
            aria-label="Portfolio figures"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              value={averageProgress === null ? "—" : `${averageProgress}%`}
              label="Portfolio progress"
            />
            <StatCard
              value={formatCompactCurrency(
                analysisQuery.data.portfolio.contractValue
              )}
              label="Contract value"
            />
            <StatCard
              value={formatCompactCurrency(
                analysisQuery.data.portfolio.collected
              )}
              label="Receipts"
            />
            <StatCard
              value={formatCompactCurrency(analysisQuery.data.portfolio.costs)}
              label="Recorded costs"
            />
          </section>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <ManagementSummaryCard
                portfolio={analysisQuery.data.portfolio}
                averageProgress={averageProgress}
              />
            </div>
            <div className="xl:col-span-2">
              <ProjectSummariesCard
                projects={analysisQuery.data.projects}
                progressById={progressById}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function BoardAnalysisSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <p role="status" className="sr-only">
        Loading the board analysis…
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Skeleton className="h-56 rounded-2xl xl:col-span-3" />
        <Skeleton className="h-56 rounded-2xl xl:col-span-2" />
      </div>
    </div>
  )
}
