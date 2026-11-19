import { useMutation, useQueryClient } from "@tanstack/react-query"

import { milestonesQueryKey } from "@/hooks/use-milestones"
import { projectsQueryKey } from "@/hooks/use-projects"
import * as programmeApi from "@/lib/api/programme"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { Milestone } from "@/lib/types/programme"

interface DeleteMilestoneOptions {
  milestone: Pick<Milestone, "id" | "projectId" | "name" | "weight">
}

/** Deletes a milestone. Project progress updates to match. */
export function useDeleteMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ milestone }: DeleteMilestoneOptions) =>
      programmeApi.deleteMilestone(milestone.id),
    onSuccess: (_, { milestone }) => {
      notifySuccess(
        "Milestone deleted",
        `${milestone.weight}% of the project's weight is free again.`
      )
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: milestonesQueryKey(milestone.projectId),
        }),
        // The project's overall progress comes from its milestones.
        queryClient.invalidateQueries({ queryKey: projectsQueryKey }),
      ])
    },
    onError: (error, { milestone }) =>
      notifyError(`Couldn't delete ${milestone.name}`, error),
  })
}
