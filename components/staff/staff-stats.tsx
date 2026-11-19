"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useStaffDashboard } from "@/hooks/use-staff-dashboard"
import { getErrorMessage } from "@/lib/api/errors"
import type { StaffDashboard } from "@/lib/types/staff"

const gridClassName =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5"

const stats: { key: keyof StaffDashboard; label: string }[] = [
  { key: "totalStaff", label: "Total staff" },
  { key: "activeStaff", label: "Active staff" },
  { key: "presentToday", label: "Present today" },
  { key: "absentToday", label: "Absent today" },
  { key: "healthRestrictions", label: "Health restrictions" },
]

/** Headcounts shown above the staff table. */
export function StaffStats() {
  const dashboard = useStaffDashboard()

  return (
    <section aria-label="Staff summary">
      {dashboard.isPending ? (
        <StaffStatsSkeleton />
      ) : dashboard.isError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center"
        >
          <p className="text-sm text-destructive">
            {getErrorMessage(
              dashboard.error,
              "We couldn't load the staff summary."
            )}
          </p>
          <Button
            variant="outline"
            onClick={() => dashboard.refetch()}
            disabled={dashboard.isFetching}
            className="h-10 rounded-full px-5"
          >
            {dashboard.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      ) : (
        <ul className={gridClassName}>
          {stats.map(({ key, label }) => (
            <li key={key}>
              <StatCard value={dashboard.data[key]} label={label} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function StaffStatsSkeleton() {
  return (
    <div className={gridClassName} aria-hidden="true">
      {stats.map(({ key }) => (
        <Card key={key} className="rounded-2xl">
          <CardContent className="flex flex-col gap-2.5 px-5 py-1">
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
