"use client"

import { AddSiteInstructionDialog } from "@/components/consultants/add-site-instruction-dialog"
import {
  TableCard,
  tableCardActionClassName,
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
import { useSiteInstructions } from "@/hooks/use-site-instructions"

export function ProjectInstructionsTab({ projectId }: { projectId: string }) {
  // The same register as Project Consultants, narrowed to this project.
  const { data: allInstructions } = useSiteInstructions()
  const instructions = allInstructions.filter(
    (item) => item.projectId === projectId
  )

  return (
    <TableCard
      titleId="project-instructions-heading"
      title="Trackable site instructions"
      titleClassName="text-xl text-heading"
      action={
        <AddSiteInstructionDialog
          projectId={projectId}
          triggerLabel="Instruction"
          triggerClassName={tableCardActionClassName}
        />
      }
    >
      <Table className="min-w-[48rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={tableHeadClassName}>Date</TableHead>
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
                colSpan={6}
                className="px-2.5 py-8 text-center text-muted-foreground"
              >
                No site instructions for this project yet.
              </TableCell>
            </TableRow>
          ) : (
            instructions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  <time dateTime={item.date}>{item.date}</time>
                </TableCell>
                <TableCell className={tableCellClassName}>
                  <p>{item.issuer}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.discipline}
                  </p>
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
