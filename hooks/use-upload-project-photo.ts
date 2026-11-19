import { useMutation, useQueryClient } from "@tanstack/react-query"

import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { UploadProjectPhotoFormValues } from "@/lib/types/projects"

interface UploadProjectPhotoOptions {
  projectId: string
  /** The project's name, for the toasts. */
  name: string
  data: UploadProjectPhotoFormValues
}

/** Uploads a project's cover photo. */
export function useUploadProjectPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: UploadProjectPhotoOptions) => {
      // The schema rejects a missing photo, so this is only for TypeScript.
      if (!data.photo) throw new Error("Choose a photo to upload")
      return projectsApi.uploadProjectPhoto(projectId, data.photo)
    },
    onSuccess: (_, { name }) => {
      notifySuccess("Photo uploaded", `${name}'s photo was updated.`)
      // The photo shows on the project page and its card in the list.
      return queryClient.invalidateQueries({ queryKey: projectsQueryKey })
    },
    onError: (error, { name }) =>
      notifyError(`Couldn't upload ${name}'s photo`, error),
  })
}
