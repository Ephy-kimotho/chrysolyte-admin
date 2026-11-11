import type {
  BoardAnalysis,
  BoardProjectSummary,
} from "@/lib/types/board-analysis"

// Placeholder data until the board analysis API is wired up.
const projects: BoardProjectSummary[] = [
  {
    id: "kilimani-residence",
    name: "Kilimani Residence",
    phase: "Construction",
    progress: 35,
    status: "On track",
    contractValue: 12_500_000,
    receipts: 4_200_000,
    costs: 1_670_000,
  },
  {
    id: "malaba-suites",
    name: "Malaba Suites",
    phase: "Construction",
    progress: 0,
    status: "At risk",
    contractValue: 18_000_000,
    receipts: 2_700_000,
    costs: 0,
  },
]

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

// Totals are derived from the projects so the figures always agree.
export const boardAnalysis: BoardAnalysis = {
  averageProgress:
    projects.length === 0
      ? 0
      : Math.round(sum(projects.map((p) => p.progress)) / projects.length),
  contractValue: sum(projects.map((p) => p.contractValue)),
  receipts: sum(projects.map((p) => p.receipts)),
  costs: sum(projects.map((p) => p.costs)),
  lowStockNotices: 1,
  openSiteInstructions: 4,
  overdueActivities: 2,
  projects,
}
