import Link from "next/link"

import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, humanizeSlug, pluralize } from "@/lib/format"
import type { InactiveStaffMember } from "@/lib/types/dashboard"

function describeInactivity(member: InactiveStaffMember) {
  if (member.daysInactive !== null) {
    return `${member.daysInactive} ${pluralize(member.daysInactive, "day", "days")} inactive`
  }
  if (member.lastSeen) return `Last seen ${formatDate(member.lastSeen)}`
  return "No activity recorded"
}

type InactiveStaffCardProps = {
  staff: InactiveStaffMember[]
}

/** Staff with no recent activity, never active first. */
export function InactiveStaffCard({ staff }: InactiveStaffCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 px-5">
        <CardTitle className="text-xl font-bold text-heading">
          Inactive staff
        </CardTitle>
        <Button
          asChild
          variant="outline"
          className="h-8 rounded-xl px-3 text-xs font-semibold"
        >
          <Link href="/staff-kpi">View all staff</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-5">
        {staff.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">
            Everyone has been active recently.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
            {staff.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-3 border-b py-3 last:border-b-0 lg:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
              >
                <UserAvatar name={member.name} className="size-9 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/staff-kpi/${member.id}`}
                    className="truncate font-semibold underline-offset-4 hover:underline"
                  >
                    {member.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {humanizeSlug(member.role)} · {member.division}
                  </p>
                </div>
                <p className="shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                  {describeInactivity(member)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
