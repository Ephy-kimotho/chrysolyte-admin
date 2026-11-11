"use client"

import Link from "next/link"

import { AddStaffDialog } from "@/components/staff/add-staff-dialog"
import { RemoveStaffDialog } from "@/components/staff/remove-staff-dialog"
import { StaffActivity } from "@/components/staff/staff-activity"
import { StaffKpiSummary } from "@/components/staff/staff-kpi-summary"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProjects } from "@/hooks/use-projects"
import { useStaff } from "@/hooks/use-staff"
import type { StaffMember } from "@/lib/types/staff"

const headClassName =
  "h-10 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
const cellClassName = "px-3 py-3.5 align-middle whitespace-normal"

function profileHref(member: StaffMember) {
  return `/staff-kpi/${member.id}`
}

function StaffIdentity({ member }: { member: StaffMember }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar
        name={member.fullName}
        src={member.photoUrl}
        className="size-10 text-xs"
      />
      <div className="flex min-w-0 flex-col">
        <Link
          href={profileHref(member)}
          className="truncate rounded-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {member.fullName}
        </Link>
        <span className="text-xs text-muted-foreground tabular-nums">
          {member.staffNumber}
        </span>
      </div>
    </div>
  )
}

export function StaffView() {
  const { data: staff } = useStaff()
  const { data: projects } = useProjects()

  function assignmentName(projectId: string | null) {
    const project = projects.find((item) => item.id === projectId)
    return project?.name ?? "Unassigned"
  }

  return (
    <section aria-labelledby="staff-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="staff-heading"
            className="font-heading text-xl font-bold text-heading"
          >
            Staff profiles & performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Open a profile for contact details, credentials and the full KPI
            breakdown.
          </p>
        </div>
        <AddStaffDialog />
      </div>

      {staff.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No staff yet. Add someone to start tracking their performance.
        </p>
      ) : (
        <>
          {/* Wide screens: a table. */}
          <Card className="hidden rounded-2xl px-2 py-1 lg:flex">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={headClassName}>Staff member</TableHead>
                  <TableHead className={headClassName}>Role</TableHead>
                  <TableHead className={headClassName}>Assignment</TableHead>
                  <TableHead className={headClassName}>
                    KPI efficiency
                  </TableHead>
                  <TableHead className={headClassName}>Last active</TableHead>
                  <TableHead className={headClassName}>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className={`${cellClassName} min-w-52`}>
                      <StaffIdentity member={member} />
                    </TableCell>
                    <TableCell className={cellClassName}>
                      <p>{member.role}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.division}
                      </p>
                    </TableCell>
                    <TableCell className={cellClassName}>
                      {assignmentName(member.projectId)}
                    </TableCell>
                    <TableCell className={cellClassName}>
                      <StaffKpiSummary
                        fullName={member.fullName}
                        kpiEfficiency={member.kpiEfficiency}
                      />
                    </TableCell>
                    <TableCell className={cellClassName}>
                      <StaffActivity
                        lastActiveOn={member.lastActiveOn}
                        daysSinceActive={member.daysSinceActive}
                      />
                    </TableCell>
                    <TableCell className={`${cellClassName} py-2.5`}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          variant="outline"
                          className="h-9 rounded-full px-4"
                        >
                          <Link
                            href={profileHref(member)}
                            aria-label={`View ${member.fullName}'s profile`}
                          >
                            View
                          </Link>
                        </Button>
                        <RemoveStaffDialog member={member} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Smaller screens: one card per staff member. */}
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
            {staff.map((member) => (
              <li key={member.id}>
                <Card className="h-full gap-4 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <StaffIdentity member={member} />
                    <div className="-mt-1 -mr-1 shrink-0">
                      <RemoveStaffDialog member={member} />
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">Role</dt>
                      <dd>
                        {member.role}{" "}
                        <span className="text-muted-foreground">
                          · {member.division}
                        </span>
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">
                        Assignment
                      </dt>
                      <dd>{assignmentName(member.projectId)}</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">
                        KPI efficiency
                      </dt>
                      <dd>
                        <StaffKpiSummary
                          fullName={member.fullName}
                          kpiEfficiency={member.kpiEfficiency}
                        />
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs text-muted-foreground">
                        Last active
                      </dt>
                      <dd>
                        <StaffActivity
                          lastActiveOn={member.lastActiveOn}
                          daysSinceActive={member.daysSinceActive}
                        />
                      </dd>
                    </div>
                  </dl>

                  <Button
                    asChild
                    variant="outline"
                    className="mt-auto h-10 rounded-full"
                  >
                    <Link href={profileHref(member)}>View profile</Link>
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
