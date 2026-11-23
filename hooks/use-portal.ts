import { useQuery } from "@tanstack/react-query"

import * as portalApi from "@/lib/api/portal"

export const portalQueryKey = ["portal", "me"] as const

/** The signed-in client and their projects. */
export function usePortal() {
  return useQuery({
    queryKey: portalQueryKey,
    queryFn: portalApi.getPortal,
  })
}
