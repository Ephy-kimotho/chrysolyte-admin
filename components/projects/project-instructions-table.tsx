"use client"

import { LoadError } from "@/components/load-error"
import { AddProjectInstructionDialog } from "@/components/projects/add-project-instruction-dialog"
import { ProjectInstructionActions } from "@/components/projects/project-instruction-actions"
import {
  TableCard,
  tableCellClassName,
  tableHeadClassName,
} from "@/components/table-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProjectInstructions } from "@/hooks/use-project-instructions"
import { useStaffNames } from "@/hooks/use-staff-names"

const columnCount = 7

type ProjectInstructionsTableProps = {
  projectId: string
  titleId?: string
  title?: string
  /** Shown before the add button, e.g. a project picker. */
  controls?: React.ReactNode
}

/** A project's instructions, with the actions to add, edit, close and delete them. */
export function ProjectInstructionsTable({
  projectId,
  titleId = "project-instructions-heading",
  title = "Trackable site instructions",
  controls,
}: ProjectInstructionsTableProps) {
  const instructionsQuery = useProjectInstructions(projectId)
  const instructions = instructionsQuery.data ?? []
  const staffNames = useStaffNames()

  return (
    <TableCard
      titleId={titleId}
      title={title}
      titleClassName="text-xl text-heading"
      action={
        controls ? (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            {controls}
            <AddProjectInstructionDialog projectId={projectId} />
          </div>
        ) : (
          <AddProjectInstructionDialog projectId={projectId} />
        )
      }
    >
      {instructionsQuery.isError ? (
        <LoadError
          error={instructionsQuery.error}
          fallback="We couldn't load the instructions."
          onRetry={() => instructionsQuery.refetch()}
          isRetrying={instructionsQuery.isFetching}
        />
      ) : (
        <Table className="min-w-[48rem]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClassName}>Date issued</TableHead>
              <TableHead className={tableHeadClassName}>Discipline</TableHead>
              <TableHead className={tableHeadClassName}>Instruction</TableHead>
              <TableHead className={tableHeadClassName}>Responsible</TableHead>
              <TableHead className={tableHeadClassName}>Deadline</TableHead>
              <TableHead className={tableHeadClassName}>Status</TableHead>
              <TableHead className={`${tableHeadClassName} w-12`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {instructionsQuery.isPending ? (
              [0, 1].map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={tableCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : instructions.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  No instructions for this project yet.
                </TableCell>
              </TableRow>
            ) : (
              instructions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={item.issueDate}>{item.issueDate}</time>
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {item.discipline}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} min-w-72`}>
                    {item.instruction}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {staffNames.get(item.responsibleId) ?? "—"}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={item.deadline}>{item.deadline}</time>
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {item.status}
                  </TableCell>
                  <TableCell
                    className={`${tableCellClassName} py-2 text-right`}
                  >
                    <ProjectInstructionActions instruction={item} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </TableCard>
  )
}
