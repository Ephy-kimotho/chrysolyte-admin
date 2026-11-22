import { isBefore, parseISO, startOfToday } from "date-fns"

import { Badge } from "@/components/ui/badge"
import type { OfficeTask } from "@/lib/types/coo-operations"

/** The status to show: an active task past its deadline shows as Overdue. */
function getDisplayStatus({ status, deadline }: OfficeTask) {
  const isActive = status.toLowerCase() === "active"
  return isActive && isBefore(parseISO(deadline), startOfToday())
    ? "Overdue"
    : status
}

function getVariant(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "default"
    case "overdue":
      return "destructive"
    default:
      return "secondary"
  }
}

export function OfficeTaskStatusBadge({ task }: { task: OfficeTask }) {
  const status = getDisplayStatus(task)

  return (
    <Badge variant={getVariant(status)} className="h-6 font-semibold">
      {status}
    </Badge>
  )
}
