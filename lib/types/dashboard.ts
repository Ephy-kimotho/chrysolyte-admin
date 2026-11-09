export type ProjectPhase = "Design" | "Construction"

export type ProjectStatus = {
  id: string
  name: string
  phase: ProjectPhase
  location: string
  /** Completion percentage, 0–100. */
  progress: number
  /** ISO date (yyyy-MM-dd). */
  dueDate: string
}

export type DashboardSummary = {
  visibleProjects: number
  overdueActivities: number
  lowStockNotices: number
  /** Amount in Kenyan shillings. */
  weeklyWagesDue: number
  openSiteInstructions: number
  /** Staff with no activity for more than two days. */
  inactiveStaff: number
  projects: ProjectStatus[]
}
