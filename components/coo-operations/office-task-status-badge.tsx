import { Badge } from "@/components/ui/badge"
import type { OfficeTaskStatus } from "@/lib/types/coo-operations"

const statusVariants = {
  Active: "secondary",
  Overdue: "destructive",
  Completed: "default",
} as const satisfies Record<OfficeTaskStatus, string>

export function OfficeTaskStatusBadge({
  status,
}: {
  status: OfficeTaskStatus
}) {
  return (
    <Badge variant={statusVariants[status]} className="h-6 font-semibold">
      {status}
    </Badge>
  )
}
