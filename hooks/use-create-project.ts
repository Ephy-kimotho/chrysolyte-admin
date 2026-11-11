import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/mock/projects"
import type { CreateProjectFormValues } from "@/lib/types/projects"

interface CreateProjectOptions {
  data: CreateProjectFormValues
}

/** Adds a project to the portfolio. */
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateProjectOptions) =>
      projectsApi.createProject(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  })
}
