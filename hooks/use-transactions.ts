import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as financialsApi from "@/lib/api/financials"
import type { TransactionFilters } from "@/lib/types/financials"

/** Prefix shared by every transactions query, filtered or not. */
export const transactionsQueryKey = ["transactions"] as const

/** Lists transactions, oldest first, narrowed by `filters`. */
export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: [...transactionsQueryKey, filters],
    queryFn: () => financialsApi.listTransactions(filters),
    // Keep showing the last results while a new filter loads.
    placeholderData: keepPreviousData,
  })
}
