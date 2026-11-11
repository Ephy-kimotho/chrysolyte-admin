import { useQuery } from "@tanstack/react-query"

import * as designApi from "@/lib/mock/design"

export const designDeliverablesQueryKey = ["design-deliverables"] as const

/** Design deliverables across all projects. */
export function useDesignDeliverables() {
  return useQuery({
    queryKey: designDeliverablesQueryKey,
    queryFn: designApi.listDesignDeliverables,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: designApi.getDesignDeliverablesSnapshot,
  })
}
