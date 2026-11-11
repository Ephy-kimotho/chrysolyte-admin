import { useQuery } from "@tanstack/react-query"

import * as wagesApi from "@/lib/mock/wages"

/** Prefix shared by every project's wages query. */
export const wagesQueryKey = ["wages"] as const

/** A project's Sunday-to-Friday wage projection. */
export function useProjectWages(projectId: string) {
  return useQuery({
    queryKey: [...wagesQueryKey, projectId],
    queryFn: () => wagesApi.listProjectWages(projectId),
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: () => wagesApi.getProjectWagesSnapshot(projectId),
  })
}
