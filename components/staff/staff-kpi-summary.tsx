import { Progress } from "@/components/ui/progress"
import type { StaffMember } from "@/lib/types/staff"

type StaffKpiSummaryProps = Pick<StaffMember, "fullName" | "kpiEfficiency">

/** The overall KPI efficiency as a percentage and a small bar. */
export function StaffKpiSummary({
  fullName,
  kpiEfficiency,
}: StaffKpiSummaryProps) {
  if (kpiEfficiency === null) {
    return <span className="text-muted-foreground">Not rated yet</span>
  }

  return (
    <div className="flex items-center gap-2.5">
      <span className="w-9 font-semibold tabular-nums">{kpiEfficiency}%</span>
      <Progress
        value={kpiEfficiency}
        aria-label={`${fullName} KPI efficiency`}
        className="h-1.5 w-16 [&>[data-slot=progress-indicator]]:bg-chart-1"
      />
    </div>
  )
}
