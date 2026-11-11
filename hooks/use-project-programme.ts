import { useQuery } from "@tanstack/react-query"

import * as programmeApi from "@/lib/mock/programme"

/** Prefix shared by every project's programme query. */
export const programmeQueryKey = ["programme"] as const

/** A project's milestones and work programme. */
export function useProjectProgramme(projectId: string) {
  return useQuery({
    queryKey: [...programmeQueryKey, projectId],
    queryFn: () => programmeApi.getProjectProgramme(projectId),
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: () => programmeApi.getProjectProgrammeSnapshot(projectId),
  })
}
