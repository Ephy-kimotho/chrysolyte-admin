import { useQuery } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/mock/projects"

/**
 * One project, or null if there's none with that id. It reads from the same
 * cached list as `useProjects`, so changes to a project update both.
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: projectsQueryKey,
    queryFn: projectsApi.listProjects,
    // The mock data is in memory, so render it straight away without a loading state.
    initialData: projectsApi.getProjectsSnapshot,
    select: (projects) => projects.find((project) => project.id === id) ?? null,
  })
}
