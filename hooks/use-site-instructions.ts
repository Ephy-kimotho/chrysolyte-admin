import { useQuery } from "@tanstack/react-query"

import * as consultantsApi from "@/lib/mock/consultants"

export const siteInstructionsQueryKey = ["site-instructions"] as const

/** The consultant instructions register, oldest first. */
export function useSiteInstructions() {
  return useQuery({
    queryKey: siteInstructionsQueryKey,
    queryFn: consultantsApi.listSiteInstructions,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: consultantsApi.getSiteInstructionsSnapshot,
  })
}
