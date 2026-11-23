/** Portfolio totals as `GET /firmcontrol/board` returns them. Amounts in KES. */
export type BoardPortfolioResponse = {
  total_projects: number
  total_contract_value: number
  total_collected: number
  total_costs: number
  /** Contract value minus collected; negative when more was collected. */
  total_outstanding: number
  /** Collected minus costs. */
  total_margin: number
}

/** A project as `GET /firmcontrol/board` returns it. Amounts in KES. */
export type BoardProjectResponse = {
  project_id: string
  name: string
  /** e.g. `Design` or `Construction`. */
  division: string
  /** e.g. `Active`. */
  status: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  contract_value: number
  collected: number
  costs: number
}

/** Response from `GET /firmcontrol/board`. */
export type BoardAnalysisResponse = {
  portfolio: BoardPortfolioResponse
  projects: BoardProjectResponse[]
}

/** Portfolio totals in Kenyan shillings. */
export type BoardPortfolio = {
  projectCount: number
  contractValue: number
  collected: number
  costs: number
  /** Contract value minus collected; negative when more was collected. */
  outstanding: number
  /** Collected minus costs. */
  margin: number
}

/** Amounts in Kenyan shillings. */
export type BoardProjectSummary = {
  /** The project's reference code, which is also its id. */
  id: string
  name: string
  /** As the API sends it, e.g. `Construction`. */
  division: string
  /** As the API sends it, e.g. `Active`. */
  status: string
  /** ISO date (yyyy-MM-dd). */
  deadline: string
  contractValue: number
  collected: number
  costs: number
}

export type BoardAnalysis = {
  portfolio: BoardPortfolio
  projects: BoardProjectSummary[]
}
