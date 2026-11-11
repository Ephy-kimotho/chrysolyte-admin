import type { ProjectPhase } from "@/lib/types/projects"

export const projectHealthStatuses = ["On track", "At risk", "Behind"] as const

export type ProjectHealthStatus = (typeof projectHealthStatuses)[number]

export type BoardProjectSummary = {
  id: string
  name: string
  phase: ProjectPhase
  /** Milestone-derived completion percentage, 0–100. */
  progress: number
  status: ProjectHealthStatus
  /** Amounts in Kenyan shillings. */
  contractValue: number
  receipts: number
  costs: number
}

export type BoardAnalysis = {
  /** Average completion across the portfolio, 0–100. */
  averageProgress: number
  /** Portfolio totals in Kenyan shillings. */
  contractValue: number
  receipts: number
  costs: number
  lowStockNotices: number
  openSiteInstructions: number
  overdueActivities: number
  projects: BoardProjectSummary[]
}
