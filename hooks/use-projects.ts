import { useQuery } from "@tanstack/react-query"

import * as projectsApi from "@/lib/api/projects"
import type { ProjectFilters } from "@/lib/types/projects"

/** Prefix shared by every project list query, filtered or not. */
export const projectsQueryKey = ["projects"] as const

/** The query for the full project list; shared so `useProject` reads the same cache. */
export const projectsQueryOptions = {
  queryKey: projectsQueryKey,
  queryFn: () => projectsApi.listProjects(),
}

/**
 * Lists the projects in the portfolio, or only those matching `filters`, e.g.
 * `useProjects({ division: "Construction" })`.
 */
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    // The unfiltered list keeps the shared key, so `useProject` reads its cache.
    queryKey: filters ? [...projectsQueryKey, filters] : projectsQueryKey,
    queryFn: () => projectsApi.listProjects(filters),
  })
}
