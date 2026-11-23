"use client"

import { AddDeliverableDialog } from "@/components/design/add-deliverable-dialog"
import { DeliverableActions } from "@/components/design/deliverable-actions"
import { LoadError } from "@/components/load-error"
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
import { useDesignDeliverables } from "@/hooks/use-design-deliverables"
import { useStaffNames } from "@/hooks/use-staff-names"
import { formatDate } from "@/lib/format"

const columnCount = 8

type DesignDeliverablesTableProps = {
  projectId: string
  /** Shown before the add button, e.g. a project picker. */
  controls?: React.ReactNode
}

/** A project's design deliverables, with the actions to add, update and delete them. */
export function DesignDeliverablesTable({
  projectId,
  controls,
}: DesignDeliverablesTableProps) {
  const deliverablesQuery = useDesignDeliverables(projectId)
  const deliverables = deliverablesQuery.data ?? []
  const staffNames = useStaffNames()

  return (
    <TableCard
      titleId="design-controls-heading"
      title="Design project controls"
      titleClassName="text-xl text-heading"
      action={
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {controls}
          <AddDeliverableDialog projectId={projectId} />
        </div>
      }
    >
      {deliverablesQuery.isError ? (
        <LoadError
          error={deliverablesQuery.error}
          fallback="We couldn't load the design deliverables."
          onRetry={() => deliverablesQuery.refetch()}
          isRetrying={deliverablesQuery.isFetching}
        />
      ) : (
        <Table className="min-w-[52rem]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClassName}>Discipline</TableHead>
              <TableHead className={tableHeadClassName}>Stage</TableHead>
              <TableHead className={tableHeadClassName}>Deliverable</TableHead>
              <TableHead className={tableHeadClassName}>Lead</TableHead>
              <TableHead className={tableHeadClassName}>Deadline</TableHead>
              <TableHead className={tableHeadClassName}>Progress</TableHead>
              <TableHead className={tableHeadClassName}>
                Client approval
              </TableHead>
              <TableHead className={`${tableHeadClassName} w-12`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {deliverablesQuery.isPending ? (
              [0, 1].map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={tableCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : deliverables.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  No design deliverables for this project yet.
                </TableCell>
              </TableRow>
            ) : (
              deliverables.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={tableCellClassName}>
                    {item.discipline}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {item.stage}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} min-w-56`}>
                    {item.deliverable}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {staffNames.get(item.leadId) ?? "—"}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={item.deadline}>
                      {formatDate(item.deadline)}
                    </time>
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {item.progress}%
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {item.clientApproval}
                  </TableCell>
                  <TableCell
                    className={`${tableCellClassName} py-2 text-right`}
                  >
                    <DeliverableActions deliverable={item} />
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
