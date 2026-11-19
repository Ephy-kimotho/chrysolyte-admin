import { useMutation, useQueryClient } from "@tanstack/react-query"

import { milestonesQueryKey } from "@/hooks/use-milestones"
import { projectsQueryKey } from "@/hooks/use-projects"
import * as programmeApi from "@/lib/api/programme"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateMilestoneFormValues } from "@/lib/types/programme"

interface CreateMilestoneOptions {
  projectId: string
  data: CreateMilestoneFormValues
}

/** Adds a milestone to a project. Project progress updates to match. */
export function useCreateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: CreateMilestoneOptions) =>
      programmeApi.createMilestone(projectId, data),
    onSuccess: (_, { projectId, data }) => {
      notifySuccess(
        "Milestone added",
        `${data.name} carries ${data.weight}% of the project.`
      )
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: milestonesQueryKey(projectId),
        }),
        // The project's overall progress comes from its milestones.
        queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
      ])
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.name}`, error),
  })
}
