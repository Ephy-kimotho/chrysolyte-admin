"use client"

import { useMemo } from "react"

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
import { useProjectAssignments } from "@/hooks/use-project-assignments"
import { useProjectWages } from "@/hooks/use-project-wages"
import { useStaff } from "@/hooks/use-staff"
import { formatCurrency, formatDate } from "@/lib/format"

const personnelColumnCount = 5

function EmptyRow({
  colSpan,
  children,
}: {
  colSpan: number
  children: string
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="px-2.5 py-8 text-center text-muted-foreground"
      >
        {children}
      </TableCell>
    </TableRow>
  )
}

export function ProjectSiteStaffTab({ projectId }: { projectId: string }) {
  const assignmentsQuery = useProjectAssignments(projectId)
  const assignments = assignmentsQuery.data ?? []
  const { data: wages } = useProjectWages(projectId)

  // The assignments carry name and role; the rate, activity and KPI come
  // from the staff list.
  const { data: staff } = useStaff()
  const staffById = useMemo(
    () => new Map(staff?.map((member) => [member.id, member])),
    [staff]
  )

  return (
    <div className="flex flex-col gap-4">
      <TableCard
        titleId="assigned-personnel-heading"
        title="Assigned personnel"
        titleClassName="pt-2 text-lg"
      >
        {assignmentsQuery.isError ? (
          <LoadError
            error={assignmentsQuery.error}
            fallback="We couldn't load the assigned personnel."
            onRetry={() => assignmentsQuery.refetch()}
            isRetrying={assignmentsQuery.isFetching}
          />
        ) : (
          <Table className="min-w-[40rem]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={tableHeadClassName}>Name</TableHead>
                <TableHead className={tableHeadClassName}>Role</TableHead>
                <TableHead className={tableHeadClassName}>Daily rate</TableHead>
                <TableHead className={tableHeadClassName}>
                  Last active
                </TableHead>
                <TableHead className={tableHeadClassName}>KPI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-b">
              {assignmentsQuery.isPending ? (
                [0, 1].map((row) => (
                  <TableRow key={row} className="hover:bg-transparent">
                    {Array.from({ length: personnelColumnCount }, (_, cell) => (
                      <TableCell key={cell} className={tableCellClassName}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : assignments.length === 0 ? (
                <EmptyRow colSpan={personnelColumnCount}>
                  No staff assigned to this project.
                </EmptyRow>
              ) : (
                assignments.map((assignment) => {
                  const member = staffById.get(assignment.staffId)

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className={tableCellClassName}>
                        <p>{assignment.staffName}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          <time dateTime={assignment.assignedFrom}>
                            {formatDate(assignment.assignedFrom)}
                          </time>{" "}
                          –{" "}
                          <time dateTime={assignment.assignedTo}>
                            {formatDate(assignment.assignedTo)}
                          </time>
                        </p>
                      </TableCell>
                      <TableCell className={tableCellClassName}>
                        {assignment.staffRole}
                      </TableCell>
                      <TableCell
                        className={`${tableCellClassName} tabular-nums`}
                      >
                        {member ? formatCurrency(member.dailyRate) : "—"}
                      </TableCell>
                      <TableCell
                        className={`${tableCellClassName} tabular-nums`}
                      >
                        {member?.lastActiveOn ? (
                          <time dateTime={member.lastActiveOn}>
                            {formatDate(member.lastActiveOn)}
                          </time>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell
                        className={`${tableCellClassName} tabular-nums`}
                      >
                        {member?.kpiEfficiency == null
                          ? "—"
                          : `${member.kpiEfficiency}%`}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <TableCard
        titleId="wage-projection-heading"
        title="Weekly wage projection - Sunday to Friday"
        titleClassName="pt-2 text-lg"
      >
        <Table className="min-w-[44rem]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClassName}>Worker</TableHead>
              <TableHead className={tableHeadClassName}>Week</TableHead>
              <TableHead className={tableHeadClassName}>Days</TableHead>
              <TableHead className={tableHeadClassName}>Gross</TableHead>
              <TableHead className={tableHeadClassName}>Advance</TableHead>
              <TableHead className={tableHeadClassName}>Net</TableHead>
              <TableHead className={tableHeadClassName}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {wages.length === 0 ? (
              <EmptyRow colSpan={7}>No wages projected this week.</EmptyRow>
            ) : (
              wages.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className={tableCellClassName}>
                    {entry.workerName}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={entry.weekStart}>{entry.weekStart}</time>
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {entry.daysWorked}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {formatCurrency(entry.gross)}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {formatCurrency(entry.advance)}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {formatCurrency(entry.net)}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {entry.status}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  )
}
