import { useQuery } from "@tanstack/react-query"

import * as programmeApi from "@/lib/mock/programme"

/** Prefix shared by every project's work programme query. */
export const programmeActivitiesQueryKey = ["programme-activities"] as const

/** A project's work programme activities, earliest deadline first. */
export function useProgrammeActivities(projectId: string) {
  return useQuery({
    queryKey: [...programmeActivitiesQueryKey, projectId],
    queryFn: () => programmeApi.listProgrammeActivities(projectId),
  })
}
