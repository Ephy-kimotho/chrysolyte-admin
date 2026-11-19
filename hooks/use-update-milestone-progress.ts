import { useMutation, useQueryClient } from "@tanstack/react-query"

import { milestonesQueryKey } from "@/hooks/use-milestones"
import { projectsQueryKey } from "@/hooks/use-projects"
import * as programmeApi from "@/lib/api/programme"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { Milestone, ProgressUpdateFormValues } from "@/lib/types/programme"

interface UpdateMilestoneProgressOptions {
  /** The milestone as saved; the API needs its other details too. */
  milestone: Milestone
  data: ProgressUpdateFormValues
}

/** Sets a milestone's completion. Project progress updates to match. */
export function useUpdateMilestoneProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ milestone, data }: UpdateMilestoneProgressOptions) =>
      programmeApi.updateMilestoneProgress(milestone, data.progress),
    onSuccess: (_, { milestone, data }) => {
      notifySuccess(
        "Progress saved",
        `${milestone.name} is ${data.progress}% complete.`
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
      notifyError(`Couldn't save ${milestone.name}'s progress`, error),
  })
}
