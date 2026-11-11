import {
  TableCard,
  tableCellClassName,
  tableHeadClassName,
} from "@/components/table-card"
import { Notice } from "@/components/notice"
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

type ProjectFinancialsTableProps = {
  projects: ProjectFinancials[]
}

export function ProjectFinancialsTable({
  projects,
}: ProjectFinancialsTableProps) {
  return (
    <TableCard
      titleId="project-financials-heading"
      title="Project financials"
      titleClassName="text-xl text-heading"
      action={<RecordTransactionDialog />}
    >
      <Notice>
        Only the CEO and CFO can record financial activities. Partial client
        payments remain visible per project.
      </Notice>

      <Table className="min-w-[56rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={tableHeadClassName}>Project</TableHead>
            <TableHead className={tableHeadClassName}>Contract</TableHead>
            <TableHead className={tableHeadClassName}>Budget</TableHead>
            <TableHead className={tableHeadClassName}>Client paid</TableHead>
            <TableHead className={tableHeadClassName}>Recorded costs</TableHead>
            <TableHead className={tableHeadClassName}>
              Weekly wages due
            </TableHead>
            <TableHead className={tableHeadClassName}>
              Budget remaining
            </TableHead>
            <TableHead className={tableHeadClassName}>Client balance</TableHead>
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
                <TableCell className={tableCellClassName}>
                  <p className="tabular-nums">{project.code}</p>
                  <p className="font-bold">{project.name}</p>
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {project.contractType}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {formatCurrency(project.budget)}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {formatCurrency(project.clientPaid)}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {formatCurrency(project.recordedCosts)}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {formatCurrency(project.weeklyWagesDue)}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {formatCurrency(project.budgetRemaining)}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {formatCurrency(project.clientBalance)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  )
}
