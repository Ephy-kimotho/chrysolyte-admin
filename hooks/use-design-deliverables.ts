import { useQuery } from "@tanstack/react-query"

import * as designApi from "@/lib/api/design"

/** Prefix shared by every project's design deliverables query. */
export const allDesignDeliverablesQueryKey = ["design-deliverables"] as const

export function designDeliverablesQueryKey(projectId: string) {
  return [...allDesignDeliverablesQueryKey, projectId] as const
}

/** A project's design deliverables, soonest deadline first. */
export function useDesignDeliverables(projectId: string) {
  return useQuery({
    queryKey: designDeliverablesQueryKey(projectId),
    queryFn: () => designApi.listDesignDeliverables(projectId),
  })
}
