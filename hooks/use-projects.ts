import { useQuery } from "@tanstack/react-query"

import * as projectsApi from "@/lib/api/projects"

export const projectsQueryKey = ["projects"] as const

/** The query for the project list; shared so `useProject` reads the same cache. */
export const projectsQueryOptions = {
  queryKey: projectsQueryKey,
  queryFn: projectsApi.listProjects,
}

/** Lists every project in the portfolio. */
export function useProjects() {
  return useQuery(projectsQueryOptions)
}
