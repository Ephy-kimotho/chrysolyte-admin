import { useQuery } from "@tanstack/react-query"

import { portalQueryKey } from "@/hooks/use-portal"
import * as portalApi from "@/lib/api/portal"

/** One of the client's projects with its milestones and payments, or null if it isn't theirs. */
export function usePortalProject(projectId: string) {
  return useQuery({
    queryKey: [...portalQueryKey, "projects", projectId],
    queryFn: () => portalApi.getPortalProject(projectId),
  })
}
