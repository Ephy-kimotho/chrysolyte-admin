import { Badge } from "@/components/ui/badge"
import type { StaffHealthStatus } from "@/lib/types/staff"

const healthVariants: Record<
  StaffHealthStatus,
  "secondary" | "warning" | "destructive"
> = {
  Fit: "secondary",
  "Restricted duty": "warning",
  Unfit: "destructive",
}

/** A health status badge. A status the app doesn't know gets a plain one. */
export function StaffHealthBadge({ health }: { health: string }) {
  const variant =
    health in healthVariants
      ? healthVariants[health as StaffHealthStatus]
      : "outline"

  return (
    <Badge variant={variant} className="h-6 font-semibold">
      {health}
    </Badge>
  )
}
