import { useQuery } from "@tanstack/react-query"

import * as dashboardApi from "@/lib/api/dashboard"

export const ceoDashboardQueryKey = ["ceo-dashboard"] as const

/** What needs the CEO's attention across the firm. */
export function useCeoDashboard() {
  return useQuery({
    queryKey: ceoDashboardQueryKey,
    queryFn: dashboardApi.getCeoDashboard,
  })
}
