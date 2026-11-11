import { useQuery } from "@tanstack/react-query"

import * as projectsApi from "@/lib/mock/projects"

export const projectsQueryKey = ["projects"] as const

/** Lists every project in the portfolio. */
export function useProjects() {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: projectsApi.listProjects,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: projectsApi.getProjectsSnapshot,
  })
}
