import { useQuery } from "@tanstack/react-query"

import * as projectsApi from "@/lib/api/projects"

/** Prefix shared by every project's instructions query. */
export const allProjectInstructionsQueryKey = ["project-instructions"] as const

export function projectInstructionsQueryKey(projectId: string) {
  return [...allProjectInstructionsQueryKey, projectId] as const
}

/** A project's instructions, oldest issued first. */
export function useProjectInstructions(projectId: string) {
  return useQuery({
    queryKey: projectInstructionsQueryKey(projectId),
    queryFn: () => projectsApi.listProjectInstructions(projectId),
  })
}
