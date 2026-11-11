import { AddSiteInstructionDialog } from "@/components/consultants/add-site-instruction-dialog"
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
import type { SiteInstruction } from "@/lib/types/consultants"

type SiteInstructionsTableProps = {
  instructions: SiteInstruction[]
}

export function SiteInstructionsTable({
  instructions,
}: SiteInstructionsTableProps) {
  return (
    <TableCard
      titleId="instructions-register-heading"
      title="Consultant instructions register"
      titleClassName="text-xl text-heading"
      action={<AddSiteInstructionDialog />}
    >
      <Table className="min-w-[60rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={tableHeadClassName}>Date</TableHead>
            <TableHead className={tableHeadClassName}>Project</TableHead>
            <TableHead className={tableHeadClassName}>Discipline</TableHead>
            <TableHead className={tableHeadClassName}>Issuer</TableHead>
            <TableHead className={tableHeadClassName}>Instruction</TableHead>
            <TableHead className={tableHeadClassName}>Responsible</TableHead>
            <TableHead className={tableHeadClassName}>Deadline</TableHead>
            <TableHead className={tableHeadClassName}>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {instructions.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={8}
                className="px-2.5 py-8 text-center text-muted-foreground"
              >
                No site instructions yet.
              </TableCell>
            </TableRow>
          ) : (
            instructions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  <time dateTime={item.date}>{item.date}</time>
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.projectName}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.discipline}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.issuer}
                </TableCell>
                <TableCell className={`${tableCellClassName} min-w-72`}>
                  {item.instruction}
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.responsibleName}
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  <time dateTime={item.deadline}>{item.deadline}</time>
                </TableCell>
                <TableCell className={tableCellClassName}>
                  {item.status}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  )
}
