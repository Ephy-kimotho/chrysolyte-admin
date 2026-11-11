import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, percentOf, pluralize } from "@/lib/format"
import type { BoardAnalysis } from "@/lib/types/board-analysis"

type ManagementSummaryCardProps = {
  analysis: BoardAnalysis
}

function Figure({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-bold text-heading tabular-nums">{children}</strong>
  )
}

export function ManagementSummaryCard({
  analysis,
}: ManagementSummaryCardProps) {
  const projectCount = analysis.projects.length
  const outstanding = analysis.contractValue - analysis.receipts

  return (
    <Card className="h-full break-inside-avoid rounded-2xl">
      <CardHeader className="px-5">
        <CardTitle className="text-base font-bold text-heading">
          Automated management summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex max-w-prose flex-col gap-3 px-5 text-sm leading-relaxed">
        <p>
          The portfolio has <Figure>{projectCount}</Figure>{" "}
          {pluralize(projectCount, "project", "projects")} with an average
          milestone-derived completion of{" "}
          <Figure>{analysis.averageProgress}%</Figure>. There{" "}
          {pluralize(analysis.lowStockNotices, "is", "are")}{" "}
          <Figure>{analysis.lowStockNotices}</Figure> project material low-stock{" "}
          {pluralize(analysis.lowStockNotices, "notice", "notices")},{" "}
          <Figure>{analysis.openSiteInstructions}</Figure> open site{" "}
          {pluralize(
            analysis.openSiteInstructions,
            "instruction",
            "instructions"
          )}
          , and <Figure>{analysis.overdueActivities}</Figure> overdue{" "}
          {pluralize(analysis.overdueActivities, "activity", "activities")}.
        </p>
        <p>
          Client receipts represent{" "}
          <Figure>
            {percentOf(analysis.receipts, analysis.contractValue)}%
          </Figure>{" "}
          of total portfolio value, leaving{" "}
          <Figure>{formatCurrency(outstanding)}</Figure> outstanding. Recorded
          direct project costs are{" "}
          <Figure>{formatCurrency(analysis.costs)}</Figure>.
        </p>
      </CardContent>
    </Card>
  )
}
