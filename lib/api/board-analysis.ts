import { axiosInstance } from "@/lib/axios"
import type {
  BoardAnalysis,
  BoardAnalysisResponse,
} from "@/lib/types/board-analysis"

/** Portfolio totals and a financial summary of each project. */
export async function getBoardAnalysis(): Promise<BoardAnalysis> {
  const response =
    await axiosInstance.get<BoardAnalysisResponse>("/firmcontrol/board")
  const { portfolio, projects } = response.data

  return {
    portfolio: {
      projectCount: portfolio.total_projects,
      contractValue: portfolio.total_contract_value,
      collected: portfolio.total_collected,
      costs: portfolio.total_costs,
      outstanding: portfolio.total_outstanding,
      margin: portfolio.total_margin,
    },
    projects: projects.map((project) => ({
      id: project.project_id,
      name: project.name,
      division: project.division,
      status: project.status,
      deadline: project.deadline,
      contractValue: project.contract_value,
      collected: project.collected,
      costs: project.costs,
    })),
  }
}
