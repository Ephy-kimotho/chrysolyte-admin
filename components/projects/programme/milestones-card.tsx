import { Notice } from "@/components/notice"
import { AddMilestoneDialog } from "@/components/projects/programme/add-milestone-dialog"
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
import type { Milestone } from "@/lib/types/programme"

type MilestonesCardProps = {
  projectId: string
  milestones: Milestone[]
}

export function MilestonesCard({ projectId, milestones }: MilestonesCardProps) {
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
        <AddMilestoneDialog
          projectId={projectId}
          remainingWeight={Math.max(0, 100 - allocatedWeight)}
        />
      }
    >
      <Notice>
        Overall project progress is calculated automatically from milestone
        weight × milestone completion.
      </Notice>

      <Table className="min-w-[48rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={tableHeadClassName}>Milestone</TableHead>
            <TableHead className={tableHeadClassName}>Weight</TableHead>
            <TableHead className={tableHeadClassName}>Progress</TableHead>
            <TableHead className={tableHeadClassName}>Start</TableHead>
            <TableHead className={tableHeadClassName}>Deadline</TableHead>
            <TableHead className={tableHeadClassName}>Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:last-child]:border-b">
          {milestones.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={6}
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  )
}
