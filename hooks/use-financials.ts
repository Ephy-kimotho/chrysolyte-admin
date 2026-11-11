import { useQuery } from "@tanstack/react-query"

import * as financialsApi from "@/lib/mock/financials"

export const financialsQueryKey = ["financials"] as const

/** Per-project financial totals and the transaction history. */
export function useFinancials() {
  return useQuery({
    queryKey: financialsQueryKey,
    queryFn: financialsApi.getFinancials,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: financialsApi.getFinancialsSnapshot,
  })
}
