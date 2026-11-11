import { AddActivityDialog } from "@/components/projects/programme/add-activity-dialog"
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
import { formatNumber } from "@/lib/format"
import type { ProgrammeActivity } from "@/lib/types/programme"

type WorkProgrammeCardProps = {
  projectId: string
  activities: ProgrammeActivity[]
}

export function WorkProgrammeCard({
  projectId,
  activities,
}: WorkProgrammeCardProps) {
  return (
    <TableCard
      titleId="work-programme-heading"
      title="Work programme & forecasts"
      titleClassName="text-xl text-heading"
      action={<AddActivityDialog projectId={projectId} />}
    >
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
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {activities.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
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
                  <time dateTime={activity.deadline}>{activity.deadline}</time>
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {activity.progress}%
                </TableCell>
                <TableCell className={`${tableCellClassName} tabular-nums`}>
                  {activity.material && activity.forecastQuantity !== null
                    ? `${activity.material} ${formatNumber(activity.forecastQuantity)}`
                    : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  )
}
