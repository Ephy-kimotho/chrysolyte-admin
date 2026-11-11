import { useQuery } from "@tanstack/react-query"

import * as storesApi from "@/lib/mock/stores"

export const storesQueryKey = ["stores"] as const

/** Material, welfare and equipment stores. */
export function useStores() {
  return useQuery({
    queryKey: storesQueryKey,
    queryFn: storesApi.getStores,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: storesApi.getStoresSnapshot,
  })
}
