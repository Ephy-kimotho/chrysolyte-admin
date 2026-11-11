import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/mock/projects"
import type { AddProjectPhotosFormValues } from "@/lib/types/projects"

interface AddProjectPhotosOptions {
  id: string
  data: AddProjectPhotosFormValues
}

/** Uploads site photos to a project. */
export function useAddProjectPhotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: AddProjectPhotosOptions) =>
      projectsApi.addProjectPhotos(id, data.photos),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
  })
}
