import { Badge } from "@/components/ui/badge"

const statusVariants: Record<string, "success" | "warning" | "secondary"> = {
  completed: "success",
  "on hold": "warning",
}

export function PortalProjectStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={statusVariants[status.toLowerCase()] ?? "secondary"}
      className="h-6 font-semibold"
    >
      {status}
    </Badge>
  )
}
