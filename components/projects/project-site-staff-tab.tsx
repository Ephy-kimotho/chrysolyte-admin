"use client"

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
import { useProjectWages } from "@/hooks/use-project-wages"
import { useStaff } from "@/hooks/use-staff"
import { formatCurrency } from "@/lib/format"

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
  const { data: staff } = useStaff()
  const { data: wages } = useProjectWages(projectId)
  const personnel = staff.filter((member) => member.projectId === projectId)

  return (
    <div className="flex flex-col gap-4">
      <TableCard
        titleId="assigned-personnel-heading"
        title="Assigned personnel"
        titleClassName="pt-2 text-lg"
      >
        <Table className="min-w-[40rem]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={tableHeadClassName}>Name</TableHead>
              <TableHead className={tableHeadClassName}>Role</TableHead>
              <TableHead className={tableHeadClassName}>Daily rate</TableHead>
              <TableHead className={tableHeadClassName}>Last active</TableHead>
              <TableHead className={tableHeadClassName}>KPI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {personnel.length === 0 ? (
              <EmptyRow colSpan={5}>
                No staff assigned to this project.
              </EmptyRow>
            ) : (
              personnel.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className={tableCellClassName}>
                    {member.fullName}
                  </TableCell>
                  <TableCell className={tableCellClassName}>
                    {member.role}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {formatCurrency(member.dailyRate)}
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    <time dateTime={member.lastActiveOn}>
                      {member.lastActiveOn}
                    </time>
                  </TableCell>
                  <TableCell className={`${tableCellClassName} tabular-nums`}>
                    {member.kpiEfficiency === null
                      ? "—"
                      : `${member.kpiEfficiency}%`}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
