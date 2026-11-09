import { AttentionCard } from "@/components/dashboard/attention-card"
import { ProjectStatusCard } from "@/components/dashboard/project-status-card"
import { StatCard } from "@/components/dashboard/stat-card"
import { formatCurrency } from "@/lib/format"
import { dashboardSummary as summary } from "@/lib/mock/dashboard"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <section
        aria-label="Key figures"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard value={summary.visibleProjects} label="Visible projects" />
        <StatCard
          value={summary.overdueActivities}
          label="Overdue activities"
        />
        <StatCard value={summary.lowStockNotices} label="Low-stock notices" />
        <StatCard
          value={formatCurrency(summary.weeklyWagesDue)}
          label="Weekly wages due"
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ProjectStatusCard projects={summary.projects} />
        </div>
        <div className="xl:col-span-2">
          <AttentionCard
            title="CEO attention"
            items={[
              {
                count: summary.lowStockNotices,
                one: "stock item is below minimum.",
                other: "stock items are below minimum.",
              },
              {
                count: summary.overdueActivities,
                one: "activity is overdue.",
                other: "activities are overdue.",
              },
              {
                count: summary.openSiteInstructions,
                one: "site instruction remains open.",
                other: "site instructions remain open.",
              },
              {
                count: summary.inactiveStaff,
                one: "staff member has been inactive for more than two days.",
                other:
                  "staff members have been inactive for more than two days.",
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
