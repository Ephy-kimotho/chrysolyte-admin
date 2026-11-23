import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, percentOf, pluralize } from "@/lib/format"
import type { BoardPortfolio } from "@/lib/types/board-analysis"

type ManagementSummaryCardProps = {
  portfolio: BoardPortfolio
  /** Average milestone-derived completion, or null when no project has one. */
  averageProgress: number | null
}

function Figure({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-bold text-heading tabular-nums">{children}</strong>
  )
}

export function ManagementSummaryCard({
  portfolio,
  averageProgress,
}: ManagementSummaryCardProps) {
  const { projectCount, contractValue, collected, costs, outstanding, margin } =
    portfolio

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
          {pluralize(projectCount, "project", "projects")}
          {averageProgress === null ? (
            "."
          ) : (
            <>
              {" "}
              with an average milestone-derived completion of{" "}
              <Figure>{averageProgress}%</Figure>.
            </>
          )}
        </p>
        <p>
          {contractValue > 0 ? (
            <>
              Client receipts of <Figure>{formatCurrency(collected)}</Figure>{" "}
              represent <Figure>{percentOf(collected, contractValue)}%</Figure>{" "}
              of the <Figure>{formatCurrency(contractValue)}</Figure> total
              contract value,{" "}
              {outstanding >= 0 ? (
                <>
                  leaving <Figure>{formatCurrency(outstanding)}</Figure>{" "}
                  outstanding.
                </>
              ) : (
                <>
                  <Figure>{formatCurrency(-outstanding)}</Figure> more than the
                  contract value.
                </>
              )}
            </>
          ) : (
            <>
              Client receipts total <Figure>{formatCurrency(collected)}</Figure>
              . No contract value is recorded yet, so there&apos;s no
              outstanding balance to report.
            </>
          )}
        </p>
        <p>
          Recorded direct project costs are{" "}
          <Figure>{formatCurrency(costs)}</Figure>, for a{" "}
          {margin >= 0 ? "margin" : "shortfall"} of{" "}
          <Figure>{formatCurrency(Math.abs(margin))}</Figure> against receipts.
        </p>
      </CardContent>
    </Card>
  )
}
