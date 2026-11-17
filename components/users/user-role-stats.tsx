"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserStats } from "@/hooks/use-user-stats"
import { getErrorMessage } from "@/lib/api/errors"
import { formatRole } from "@/lib/format"

const gridClassName =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4"

/** One card per role with the number of users who hold it. */
export function UserRoleStats() {
  const stats = useUserStats()

  return (
    <section aria-label="Users by role">
      {stats.isPending ? (
        <RoleStatsSkeleton />
      ) : stats.isError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center"
        >
          <p className="text-sm text-destructive">
            {getErrorMessage(stats.error, "We couldn't load the user stats.")}
          </p>
          <Button
            variant="outline"
            onClick={() => stats.refetch()}
            disabled={stats.isFetching}
            className="h-10 rounded-full px-5"
          >
            {stats.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      ) : stats.data.byRole.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-5 py-10 text-center text-sm text-muted-foreground">
          No users have a role yet.
        </p>
      ) : (
        <ul className={gridClassName}>
          {stats.data.byRole.map(({ role, count }) => (
            <li key={role}>
              <StatCard value={count} label={formatRole(role)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function RoleStatsSkeleton() {
  return (
    <div className={gridClassName} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <Card key={index} className="rounded-2xl">
          <CardContent className="flex flex-col gap-2.5 px-5 py-1">
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
