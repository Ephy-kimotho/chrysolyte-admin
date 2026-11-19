import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"

interface DeleteProjectPhotoOptions {
  projectId: string
  /** The project's name, for the toasts. */
  name: string
}

/** Deletes a project's cover photo, so its division placeholder shows instead. */
export function useDeleteProjectPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId }: DeleteProjectPhotoOptions) =>
      projectsApi.deleteProjectPhoto(projectId),
    onSuccess: (_, { name }) => {
      notifySuccess("Photo deleted", `${name} no longer has a photo.`)
      // The photo shows on the project page and its card in the list.
      return queryClient.invalidateQueries({ queryKey: projectsQueryKey })
    },
    onError: (error, { name }) =>
      notifyError(`Couldn't delete ${name}'s photo`, error),
  })
}
