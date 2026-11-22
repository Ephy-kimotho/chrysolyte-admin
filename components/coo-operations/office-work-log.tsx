"use client"

import { useMemo, useState } from "react"

import { AddOfficeTaskDialog } from "@/components/coo-operations/add-office-task-dialog"
import { OfficeTaskActions } from "@/components/coo-operations/office-task-actions"
import { OfficeTaskFilters } from "@/components/coo-operations/office-task-filters"
import { OfficeTaskProgress } from "@/components/coo-operations/office-task-progress"
import { OfficeTaskStatusBadge } from "@/components/coo-operations/office-task-status-badge"
import { LoadError } from "@/components/load-error"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOfficeTasks } from "@/hooks/use-office-tasks"
import { useProjects } from "@/hooks/use-projects"
import { formatDate } from "@/lib/format"
import type { OfficeTaskFilters as Filters } from "@/lib/types/coo-operations"
import { cn } from "@/lib/utils"

const headClassName =
  "h-10 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"

export function OfficeWorkLog() {
  const [filters, setFilters] = useState<Filters>({})
  const tasksQuery = useOfficeTasks(filters)
  const tasks = tasksQuery.data ?? []
  const hasFilters = Object.values(filters).some(Boolean)

  // The API only sends the project's code, so look its name up.
  const { data: projects } = useProjects()
  const projectNames = useMemo(
    () => new Map(projects?.map((project) => [project.id, project.name])),
    [projects]
  )

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

      <OfficeTaskFilters filters={filters} onChange={setFilters} />

      {tasksQuery.isPending ? (
        <OfficeWorkLogSkeleton />
      ) : tasksQuery.isError ? (
        <LoadError
          error={tasksQuery.error}
          fallback="We couldn't load the office work log."
          onRetry={() => tasksQuery.refetch()}
          isRetrying={tasksQuery.isFetching}
        />
      ) : tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          {hasFilters
            ? "No office tasks match these filters."
            : "No office tasks yet. Add one to start tracking it here."}
        </p>
      ) : (
        // Dimmed while a new filter loads over the previous results.
        <div
          aria-busy={tasksQuery.isPlaceholderData}
          className={cn(
            "transition-opacity",
            tasksQuery.isPlaceholderData && "opacity-60"
          )}
        >
          {/* Wide screens: a table. */}
          <Card className="hidden rounded-2xl px-2 py-1 lg:flex">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={headClassName}>Project</TableHead>
                  <TableHead className={headClassName}>Category</TableHead>
                  <TableHead className={headClassName}>Task</TableHead>
                  <TableHead className={headClassName}>Owner</TableHead>
                  <TableHead className={headClassName}>Deadline</TableHead>
                  <TableHead className={`${headClassName} w-44`}>
                    Progress
                  </TableHead>
                  <TableHead className={headClassName}>Status</TableHead>
                  <TableHead className={`${headClassName} w-12`}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="max-w-48 px-3 py-3.5 whitespace-normal">
                      {projectNames.get(task.projectId) ?? task.projectId}
                    </TableCell>
                    <TableCell className="px-3 py-3.5 text-muted-foreground">
                      {task.category}
                    </TableCell>
                    <TableCell className="min-w-56 px-3 py-3.5 whitespace-normal">
                      <p className="font-medium">{task.task}</p>
                      {task.notes && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {task.notes}
                        </p>
                      )}
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
                      <OfficeTaskStatusBadge task={task} />
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right">
                      <OfficeTaskActions task={task} />
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
                      {projectNames.get(task.projectId) ?? task.projectId} ·{" "}
                      {task.category}
                    </p>
                    <div className="-my-1.5 -mr-2 flex shrink-0 items-center gap-1">
                      <OfficeTaskStatusBadge task={task} />
                      <OfficeTaskActions task={task} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-balance">{task.task}</h3>
                    {task.notes && (
                      <p className="text-xs text-muted-foreground">
                        {task.notes}
                      </p>
                    )}
                  </div>
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
        </div>
      )}
    </section>
  )
}

function OfficeWorkLogSkeleton() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">
        Loading office tasks…
      </p>
      <Card className="gap-0 rounded-2xl p-4">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="flex flex-col gap-2 border-b py-3.5 last:border-b-0 lg:flex-row lg:items-center lg:gap-6"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-40 rounded-full lg:ml-auto" />
          </div>
        ))}
      </Card>
    </div>
  )
}
