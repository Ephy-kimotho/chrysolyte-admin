import { AddDeliverableDialog } from "@/components/design/add-deliverable-dialog"
import {
  TableCard,
  tableCellClassName,
  tableHeadClassName,
} from "@/components/table-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DesignDeliverable } from "@/lib/types/design"

type DesignDeliverablesTableProps = {
  deliverables: DesignDeliverable[]
}

export function DesignDeliverablesTable({
  deliverables,
}: DesignDeliverablesTableProps) {
  return (
    <TableCard
      titleId="design-controls-heading"
      title="Design project controls"
      titleClassName="text-xl text-heading"
      action={<AddDeliverableDialog />}
    >
      <Table className="min-w-[56rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={tableHeadClassName}>Project</TableHead>
            <TableHead className={tableHeadClassName}>Discipline</TableHead>
            <TableHead className={tableHeadClassName}>Stage</TableHead>
            <TableHead className={tableHeadClassName}>Deliverable</TableHead>
            <TableHead className={tableHeadClassName}>Lead</TableHead>
            <TableHead className={tableHeadClassName}>Deadline</TableHead>
            <TableHead className={tableHeadClassName}>Progress</TableHead>
            <TableHead className={tableHeadClassName}>
              Client approval
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {deliverables.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={8}
                className="px-2.5 py-8 text-center text-muted-foreground"
              >
                No design deliverables yet.
              </TableCell>
            </TableRow>
          ) : (
            deliverables.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={tableCellClassName}>
                  {item.projectName}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.discipline}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.stage}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.deliverable}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.lead}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  <time dateTime={item.deadline}>{item.deadline}</time>
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {item.progress}%
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.clientApproval}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  )
}
