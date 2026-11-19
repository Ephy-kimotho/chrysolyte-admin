import { useQuery } from "@tanstack/react-query"

import * as programmeApi from "@/lib/api/programme"

/** Prefix shared by every project's work programme query. */
export const allProgrammeActivitiesQueryKey = ["programme-activities"] as const

export function programmeActivitiesQueryKey(projectId: string) {
  return [...allProgrammeActivitiesQueryKey, projectId] as const
}

/** A project's work programme activities, earliest deadline first. */
export function useProgrammeActivities(projectId: string) {
  return useQuery({
    queryKey: programmeActivitiesQueryKey(projectId),
    queryFn: () => programmeApi.listProgrammeActivities(projectId),
  })
}
