import { useQuery } from "@tanstack/react-query"

import { projectsQueryOptions } from "@/hooks/use-projects"

/**
 * One project, or null if there's none with that id. It reads from the same
 * cached list as `useProjects`, so changes to a project update both.
 */
export function useProject(id: string) {
  return useQuery({
    ...projectsQueryOptions,
    select: (projects) => projects.find((project) => project.id === id) ?? null,
  })
}
