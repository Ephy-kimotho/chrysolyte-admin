import { useMutation, useQueryClient } from "@tanstack/react-query"

import { clientsQueryKey } from "@/hooks/use-clients"
import { projectsQueryKey } from "@/hooks/use-projects"
import * as projectsApi from "@/lib/api/projects"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateProjectFormValues } from "@/lib/types/projects"

interface CreateProjectOptions {
  data: CreateProjectFormValues
}

/**
 * Adds a project, then uploads its cover photo if one was chosen. The upload
 * needs the project to exist, so it goes in a second request. If only the
 * upload fails, the project still exists, so the mutation still succeeds and
 * returns the upload error as `photoError`.
 */
async function createProjectWithPhoto({ data }: CreateProjectOptions) {
  const project = await projectsApi.createProject(data)
  if (!data.coverPhoto) return { project, photoError: null }

  try {
    // The API identifies the project by the reference code it was sent.
    await projectsApi.uploadProjectPhoto(data.projectCode, data.coverPhoto)
    return { project, photoError: null }
  } catch (photoError) {
    return { project, photoError }
  }
}

/** Adds a project to the portfolio, with its cover photo when one is given. */
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProjectWithPhoto,
    onSuccess: ({ photoError }, { data }) => {
      if (photoError) {
        notifyError(
          `${data.name} was added, but its cover photo didn't upload`,
          photoError
        )
      } else {
        notifySuccess("Project added", `${data.name} is now in the portfolio.`)
      }
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
        // The client's project count changes too.
        queryClient.invalidateQueries({ queryKey: clientsQueryKey }),
      ])
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.name}`, error),
  })
}
