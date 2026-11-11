import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/mock/projects"

interface UpdateProjectCoverOptions {
  id: string
  data: { file: File }
}

/** Replaces a project's cover photo. */
export function useUpdateProjectCover() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateProjectCoverOptions) =>
      projectsApi.updateProjectCover(id, data.file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  })
}
