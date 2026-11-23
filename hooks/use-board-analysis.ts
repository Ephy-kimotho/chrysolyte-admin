import { useQuery } from "@tanstack/react-query"

import * as boardAnalysisApi from "@/lib/api/board-analysis"

export const boardAnalysisQueryKey = ["board-analysis"] as const

/** Portfolio totals and a financial summary of each project. */
export function useBoardAnalysis() {
  return useQuery({
    queryKey: boardAnalysisQueryKey,
    queryFn: boardAnalysisApi.getBoardAnalysis,
  })
}
