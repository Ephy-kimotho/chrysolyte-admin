import { Badge } from "@/components/ui/badge"

type StockNoticeBadgeProps = {
  /** True once the quantity drops below the minimum. */
  isLow: boolean
}

/** "LOW STOCK" for a low item, otherwise "OK". */
export function StockNoticeBadge({ isLow }: StockNoticeBadgeProps) {
  return (
    <Badge
      variant={isLow ? "destructive" : "success"}
      className="h-6 px-2.5 text-xs font-bold tracking-wide uppercase"
    >
      {isLow ? "Low stock" : "OK"}
    </Badge>
  )
}
