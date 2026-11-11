import {
  FinancialsTableCard,
  financialsCellClassName,
  financialsHeadClassName,
} from "@/components/financials/financials-table"
import { RecordTransactionDialog } from "@/components/financials/record-transaction-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import type { ProjectFinancials } from "@/lib/types/financials"

function amountOrDash(amount: number | null) {
  return amount === null ? "—" : formatCurrency(amount)
}

type ProjectFinancialsTableProps = {
  projects: ProjectFinancials[]
}

export function ProjectFinancialsTable({
  projects,
}: ProjectFinancialsTableProps) {
  return (
    <FinancialsTableCard
      titleId="project-financials-heading"
      title="Project financials"
      titleClassName="text-xl text-heading"
      action={<RecordTransactionDialog />}
    >
      <p className="rounded-xl border-l-4 border-warning bg-warning-muted/50 px-4 py-3 text-sm leading-relaxed">
        Only the CEO and CFO can record financial activities. Partial client
        payments remain visible per project.
      </p>

      <Table className="min-w-[56rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={financialsHeadClassName}>Project</TableHead>
            <TableHead className={financialsHeadClassName}>Contract</TableHead>
            <TableHead className={financialsHeadClassName}>Budget</TableHead>
            <TableHead className={financialsHeadClassName}>
              Client paid
            </TableHead>
            <TableHead className={financialsHeadClassName}>
              Recorded costs
            </TableHead>
            <TableHead className={financialsHeadClassName}>
              Weekly wages due
            </TableHead>
            <TableHead className={financialsHeadClassName}>
              Budget remaining
            </TableHead>
            <TableHead className={financialsHeadClassName}>
              Client balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={8}
                className="px-2.5 py-8 text-center text-muted-foreground"
              >
                No projects yet.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.projectId}>
                <TableCell className={financialsCellClassName}>
                  <p className="tabular-nums">{project.code}</p>
                  <p className="font-bold">{project.name}</p>
                </TableCell>
                <TableCell className={financialsCellClassName}>
                  {project.contractType ?? "—"}
                </TableCell>
                <TableCell
                  className={`${financialsCellClassName} tabular-nums`}
                >
                  {amountOrDash(project.budget)}
                </TableCell>
                <TableCell
                  className={`${financialsCellClassName} tabular-nums`}
                >
                  {formatCurrency(project.clientPaid)}
                </TableCell>
                <TableCell
                  className={`${financialsCellClassName} tabular-nums`}
                >
                  {formatCurrency(project.recordedCosts)}
                </TableCell>
                <TableCell
                  className={`${financialsCellClassName} tabular-nums`}
                >
                  {formatCurrency(project.weeklyWagesDue)}
                </TableCell>
                <TableCell
                  className={`${financialsCellClassName} tabular-nums`}
                >
                  {amountOrDash(project.budgetRemaining)}
                </TableCell>
                <TableCell
                  className={`${financialsCellClassName} tabular-nums`}
                >
                  {amountOrDash(project.clientBalance)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </FinancialsTableCard>
  )
}
