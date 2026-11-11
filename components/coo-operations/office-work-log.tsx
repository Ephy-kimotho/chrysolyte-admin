"use client"

import { AddOfficeTaskDialog } from "@/components/coo-operations/add-office-task-dialog"
import { OfficeTaskProgress } from "@/components/coo-operations/office-task-progress"
import { OfficeTaskStatusBadge } from "@/components/coo-operations/office-task-status-badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOfficeTasks } from "@/hooks/use-office-tasks"
import { formatDate } from "@/lib/format"

const headClassName =
  "h-10 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"

export function OfficeWorkLog() {
  const { data: tasks } = useOfficeTasks()

  return (
    <section
      aria-labelledby="office-work-log-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="office-work-log-heading"
            className="font-heading text-xl font-bold text-heading"
          >
            Office work log
          </h2>
          <p className="text-sm text-muted-foreground">
            Administration, procurement, HR, compliance, communication and
            internal controls.
          </p>
        </div>
        <AddOfficeTaskDialog />
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No office tasks yet. Add one to start tracking it here.
        </p>
      ) : (
        <>
          {/* Wide screens: a table. */}
          <Card className="hidden rounded-2xl px-2 py-1 lg:flex">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={headClassName}>Category</TableHead>
                  <TableHead className={headClassName}>Task</TableHead>
                  <TableHead className={headClassName}>Owner</TableHead>
                  <TableHead className={headClassName}>Deadline</TableHead>
                  <TableHead className={`${headClassName} w-44`}>
                    Progress
                  </TableHead>
                  <TableHead className={headClassName}>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="px-3 py-3.5 text-muted-foreground">
                      {task.category}
                    </TableCell>
                    <TableCell className="min-w-56 px-3 py-3.5 font-medium whitespace-normal">
                      {task.task}
                    </TableCell>
                    <TableCell className="px-3 py-3.5">{task.owner}</TableCell>
                    <TableCell className="px-3 py-3.5 tabular-nums">
                      <time dateTime={task.deadline}>
                        {formatDate(task.deadline)}
                      </time>
                    </TableCell>
                    <TableCell className="px-3 py-3.5">
                      <OfficeTaskProgress
                        task={task.task}
                        progress={task.progress}
                      />
                    </TableCell>
                    <TableCell className="px-3 py-3.5">
                      <OfficeTaskStatusBadge status={task.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Smaller screens: one card per task. */}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {tasks.map((task) => (
              <li key={task.id}>
                <Card className="h-full gap-3 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {task.category}
                    </p>
                    <OfficeTaskStatusBadge status={task.status} />
                  </div>
                  <h3 className="font-semibold text-balance">{task.task}</h3>
                  <p className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{task.owner}</span>
                    <span>
                      Due{" "}
                      <time dateTime={task.deadline}>
                        {formatDate(task.deadline)}
                      </time>
                    </span>
                  </p>
                  <OfficeTaskProgress
                    task={task.task}
                    progress={task.progress}
                    className="mt-auto"
                  />
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
