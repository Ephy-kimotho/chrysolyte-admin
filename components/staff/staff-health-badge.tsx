import { Badge } from "@/components/ui/badge"
import type { StaffHealthStatus } from "@/lib/types/staff"

const healthVariants = {
  Fit: "secondary",
  "Restricted duty": "warning",
  Unfit: "destructive",
} as const satisfies Record<StaffHealthStatus, string>

export function StaffHealthBadge({ health }: { health: StaffHealthStatus }) {
  return (
    <Badge variant={healthVariants[health]} className="h-6 font-semibold">
      {health}
    </Badge>
  )
}
