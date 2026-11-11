import { Badge } from "@/components/ui/badge"

type StockNoticeBadgeProps = {
  quantity: number
  minimum: number
}

/** "LOW STOCK" once the quantity drops below the minimum, otherwise "OK". */
export function StockNoticeBadge({ quantity, minimum }: StockNoticeBadgeProps) {
  const isLow = quantity < minimum

  return (
    <Badge
      variant={isLow ? "destructive" : "success"}
      className="h-6 px-2.5 text-xs font-bold tracking-wide uppercase"
    >
      {isLow ? "Low stock" : "OK"}
    </Badge>
  )
}
