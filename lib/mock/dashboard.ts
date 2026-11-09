import type { DashboardSummary } from "@/lib/types/dashboard"

// Placeholder data until the dashboard API is wired up.
export const dashboardSummary: DashboardSummary = {
  visibleProjects: 3,
  overdueActivities: 2,
  lowStockNotices: 1,
  weeklyWagesDue: 26200,
  openSiteInstructions: 1,
  inactiveStaff: 4,
  projects: [
    {
      id: "kilimani-residence",
      name: "Kilimani Residence",
      phase: "Construction",
      location: "Nairobi",
      progress: 35,
      dueDate: "2026-12-18",
    },
    {
      id: "westlands-corporate-office",
      name: "Westlands Corporate Office",
      phase: "Design",
      location: "Westlands",
      progress: 39,
      dueDate: "2026-10-30",
    },
    {
      id: "malaba-suites",
      name: "Malaba Suites",
      phase: "Construction",
      location: "Witeithie",
      progress: 0,
      dueDate: "2026-11-13",
    },
  ],
}
