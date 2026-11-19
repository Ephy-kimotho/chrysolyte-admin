"use client"

import { LoadError } from "@/components/load-error"
import { ActivityProgressInput } from "@/components/projects/programme/activity-progress-input"
import { AddActivityDialog } from "@/components/projects/programme/add-activity-dialog"
import { DeleteActivityDialog } from "@/components/projects/programme/delete-activity-dialog"
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
import { useProgrammeActivities } from "@/hooks/use-programme-activities"
import { formatNumber } from "@/lib/format"

const columnCount = 6

export function WorkProgrammeCard({ projectId }: { projectId: string }) {
  const activitiesQuery = useProgrammeActivities(projectId)
  const activities = activitiesQuery.data ?? []

  return (
    <TableCard
      titleId="work-programme-heading"
      title="Work programme & forecasts"
      titleClassName="text-xl text-heading"
      action={<AddActivityDialog projectId={projectId} />}
    >
      {activitiesQuery.isError ? (
        <LoadError
          error={activitiesQuery.error}
          fallback="We couldn't load the work programme."
          onRetry={() => activitiesQuery.refetch()}
          isRetrying={activitiesQuery.isFetching}
        />
      ) : (
        <Table className="min-w-[44rem]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClassName}>Activity</TableHead>
              <TableHead className={tableHeadClassName}>Owner</TableHead>
              <TableHead className={tableHeadClassName}>Deadline</TableHead>
              <TableHead className={tableHeadClassName}>Progress</TableHead>
              <TableHead className={tableHeadClassName}>
                Material forecast
              </TableHead>
              <TableHead className={`${tableHeadClassName} w-12`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {activitiesQuery.isPending ? (
              [0, 1].map((row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }, (_, cell) => (
                    <TableCell key={cell} className={tableCellClassName}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : activities.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="px-2.5 py-8 text-center text-muted-foreground"
                >
                  No activities in the work programme yet.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className={tableCellClassName}>
                    {activity.activity}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {activity.owner}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={activity.deadline}>
                      {activity.deadline}
                    </time>
                  </TableCell>
                  <TableCell className={`${tableCellClassName} py-2.5`}>
                    <ActivityProgressInput activity={activity} />
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {activity.material && activity.forecastQuantity !== null
                      ? `${activity.material} ${formatNumber(activity.forecastQuantity)}`
                      : "—"}
                  </TableCell>
                  <TableCell
                    className={`${tableCellClassName} py-2 text-right`}
                  >
                    <DeleteActivityDialog activity={activity} />
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
