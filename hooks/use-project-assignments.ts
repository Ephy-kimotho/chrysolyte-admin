import { useQuery } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"

// Under the staff key, so assigning someone to a project refreshes this too.
export function projectAssignmentsQueryKey(projectId: string) {
  return [...staffQueryKey, "project-assignments", projectId] as const
}

/** Everyone assigned to a project, earliest start first. */
export function useProjectAssignments(projectId: string) {
  return useQuery({
    queryKey: projectAssignmentsQueryKey(projectId),
    queryFn: () => staffApi.listProjectAssignments(projectId),
  })
}
