import { keepPreviousData, useQuery } from "@tanstack/react-query"

import * as storesApi from "@/lib/api/stores"
import type { WelfareItemFilters } from "@/lib/types/stores"

/** Prefix shared by every welfare items query, filtered or not. */
export const welfareItemsQueryKey = ["welfare-items"] as const

/** Lists welfare store items, low stock first, narrowed by `filters`. */
export function useWelfareItems(filters: WelfareItemFilters = {}) {
  return useQuery({
    queryKey: [...welfareItemsQueryKey, filters],
    queryFn: () => storesApi.listWelfareItems(filters),
    // Keep showing the last results while a new filter loads.
    placeholderData: keepPreviousData,
  })
}
