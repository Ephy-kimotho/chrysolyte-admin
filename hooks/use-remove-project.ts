import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { Project } from "@/lib/types/projects"

interface RemoveProjectOptions {
  project: Pick<Project, "id" | "name">
}

/** Deletes a project and everything recorded against it. */
export function useRemoveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ project }: RemoveProjectOptions) =>
      projectsApi.deleteProject(project.id),
    onSuccess: (_, { project }) => {
      notifySuccess(
        "Project removed",
        `${project.name} and its data have been deleted.`
      )
      return queryClient.invalidateQueries({ queryKey: projectsQueryKey })
    },
    onError: (error, { project }) =>
      notifyError(`Couldn't remove ${project.name}`, error),
  })
}
