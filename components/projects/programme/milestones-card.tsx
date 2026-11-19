"use client"

import { LoadError } from "@/components/load-error"
import { Notice } from "@/components/notice"
import { AddMilestoneDialog } from "@/components/projects/programme/add-milestone-dialog"
import { DeleteMilestoneDialog } from "@/components/projects/programme/delete-milestone-dialog"
import { MilestoneProgressInput } from "@/components/projects/programme/milestone-progress-input"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useMilestones } from "@/hooks/use-milestones"

const columnCount = 7

export function MilestonesCard({ projectId }: { projectId: string }) {
  const milestonesQuery = useMilestones(projectId)
  const milestones = milestonesQuery.data ?? []
  const allocatedWeight = milestones.reduce(
    (total, item) => total + item.weight,
    0
  )

  return (
    <TableCard
      titleId="milestones-heading"
      title="Milestones"
      titleClassName="text-xl text-heading"
      action={
        // Waits for the list, so the weight left is known.
        milestonesQuery.isSuccess && (
          <AddMilestoneDialog
            projectId={projectId}
            remainingWeight={Math.max(0, 100 - allocatedWeight)}
          />
        )
      }
    >
      <Notice>
        Overall project progress is calculated automatically from milestone
        weight × milestone completion.
      </Notice>

      {milestonesQuery.isError ? (
        <LoadError
          error={milestonesQuery.error}
          fallback="We couldn't load the milestones."
          onRetry={() => milestonesQuery.refetch()}
          isRetrying={milestonesQuery.isFetching}
        />
      ) : (
        <Table className="min-w-[48rem]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClassName}>Milestone</TableHead>
              <TableHead className={tableHeadClassName}>Weight</TableHead>
              <TableHead className={tableHeadClassName}>Progress</TableHead>
              <TableHead className={tableHeadClassName}>Start</TableHead>
              <TableHead className={tableHeadClassName}>Deadline</TableHead>
              <TableHead className={tableHeadClassName}>Owner</TableHead>
              <TableHead className={`${tableHeadClassName} w-12`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {milestonesQuery.isPending ? (
              [0, 1, 2].map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={tableCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : milestones.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  No milestones yet.
                </TableCell>
              </TableRow>
            ) : (
              milestones.map((milestone) => (
                <TableRow key={milestone.id}>
                  <TableCell className={tableCellClassName}>
                    {milestone.name}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {milestone.weight}%
                  </TableCell>
                  <TableCell className={`${tableCellClassName} py-2.5`}>
                    <MilestoneProgressInput milestone={milestone} />
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={milestone.startDate}>
                      {milestone.startDate}
                    </time>
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={milestone.deadline}>
                      {milestone.deadline}
                    </time>
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {milestone.owner}
                  </TableCell>
                  <TableCell
                    className={`${tableCellClassName} py-2 text-right`}
                  >
                    <DeleteMilestoneDialog milestone={milestone} />
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
