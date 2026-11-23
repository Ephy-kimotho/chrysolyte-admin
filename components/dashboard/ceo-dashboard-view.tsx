"use client"

import { AttentionCard } from "@/components/dashboard/attention-card"
import { InactiveStaffCard } from "@/components/dashboard/inactive-staff-card"
import { ProjectStatusCard } from "@/components/dashboard/project-status-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { LoadError } from "@/components/load-error"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCeoDashboard } from "@/hooks/use-ceo-dashboard"
import { useProjects } from "@/hooks/use-projects"

export function CeoDashboardView() {
  const dashboardQuery = useCeoDashboard()
  const projectsQuery = useProjects()

  if (dashboardQuery.isPending) return <CeoDashboardSkeleton />

  if (dashboardQuery.isError) {
    return (
      <LoadError
        error={dashboardQuery.error}
        fallback="We couldn't load the dashboard."
        onRetry={() => dashboardQuery.refetch()}
        isRetrying={dashboardQuery.isFetching}
      />
    )
  }

  const dashboard = dashboardQuery.data

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-label="Key figures"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard value={dashboard.lateMilestones} label="Late milestones" />
        <StatCard value={dashboard.overdueInvoices} label="Overdue invoices" />
        <StatCard value={dashboard.lowStockItems} label="Low-stock items" />
        <StatCard
          value={dashboard.inactiveStaff.length}
          label="Inactive staff"
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          {projectsQuery.isPending ? (
            <Card className="gap-4 rounded-2xl p-5">
              <Skeleton className="h-6 w-36" />
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex flex-col gap-2 py-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </Card>
          ) : projectsQuery.isError ? (
            <LoadError
              error={projectsQuery.error}
              fallback="We couldn't load the projects."
              onRetry={() => projectsQuery.refetch()}
              isRetrying={projectsQuery.isFetching}
            />
          ) : (
            <ProjectStatusCard projects={projectsQuery.data} />
          )}
        </div>
        <div className="xl:col-span-2">
          <AttentionCard
            title="CEO attention"
            items={[
              {
                count: dashboard.lateMilestones,
                one: "milestone is running late.",
                other: "milestones are running late.",
              },
              {
                count: dashboard.overdueInstructions,
                one: "site instruction is overdue.",
                other: "site instructions are overdue.",
              },
              {
                count: dashboard.overdueInvoices,
                one: "invoice is overdue.",
                other: "invoices are overdue.",
              },
              {
                count: dashboard.unpaidWages,
                one: "wage payment is outstanding.",
                other: "wage payments are outstanding.",
              },
              {
                count: dashboard.lowStockItems,
                one: "stock item is below minimum.",
                other: "stock items are below minimum.",
              },
              {
                count: dashboard.inactiveStaff.length,
                one: "staff member has been inactive.",
                other: "staff members have been inactive.",
              },
              {
                count: dashboard.openIncidents,
                one: "incident is still open.",
                other: "incidents are still open.",
              },
              {
                count: dashboard.openInstructions,
                one: "site instruction remains open.",
                other: "site instructions remain open.",
              },
            ]}
          />
        </div>
      </div>

      <InactiveStaffCard staff={dashboard.inactiveStaff} />
    </div>
  )
}

function CeoDashboardSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <p role="status" className="sr-only">
        Loading the dashboard…
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <Card key={card} className="gap-3 rounded-2xl px-5 py-6">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-28" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-5">
        <Card className="gap-4 rounded-2xl p-5 xl:col-span-3">
          <Skeleton className="h-6 w-36" />
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex flex-col gap-2 py-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </Card>
        <Card className="gap-3 rounded-2xl p-5 xl:col-span-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </Card>
      </div>
    </div>
  )
}
