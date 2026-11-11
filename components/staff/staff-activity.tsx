import { Badge } from "@/components/ui/badge"
import { formatDate, pluralize } from "@/lib/format"
import { inactiveAfterDays, type StaffMember } from "@/lib/types/staff"

type StaffActivityProps = Pick<StaffMember, "lastActiveOn" | "daysSinceActive">

export function StaffActivity({
  lastActiveOn,
  daysSinceActive,
}: StaffActivityProps) {
  const isInactive = daysSinceActive > inactiveAfterDays

  return (
    <div className="flex flex-col items-start gap-1.5">
      <time dateTime={lastActiveOn} className="tabular-nums">
        {daysSinceActive === 0 ? "Today" : formatDate(lastActiveOn)}
      </time>
      {isInactive && (
        <Badge variant="destructive" className="h-6 font-semibold">
          {daysSinceActive} {pluralize(daysSinceActive, "day", "days")} inactive
        </Badge>
      )}
    </div>
  )
}
