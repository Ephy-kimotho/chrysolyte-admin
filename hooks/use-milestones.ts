import { useQuery } from "@tanstack/react-query"

import * as programmeApi from "@/lib/api/programme"

/** Prefix shared by every project's milestones query. */
export const allMilestonesQueryKey = ["milestones"] as const

export function milestonesQueryKey(projectId: string) {
  return [...allMilestonesQueryKey, projectId] as const
}

/** A project's milestones, earliest start first. */
export function useMilestones(projectId: string) {
  return useQuery({
    queryKey: milestonesQueryKey(projectId),
    queryFn: () => programmeApi.listMilestones(projectId),
  })
}
