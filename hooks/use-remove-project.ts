import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/mock/projects"

interface RemoveProjectOptions {
  id: string
}

/** Removes a project from the portfolio. */
export function useRemoveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: RemoveProjectOptions) => projectsApi.removeProject(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  })
}
