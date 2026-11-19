import { useMutation, useQueryClient } from "@tanstack/react-query"

import { programmeActivitiesQueryKey } from "@/hooks/use-programme-activities"
import * as programmeApi from "@/lib/api/programme"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { ProgrammeActivity } from "@/lib/types/programme"

interface DeleteActivityOptions {
  activity: Pick<ProgrammeActivity, "id" | "projectId" | "activity">
}

/** Deletes an activity from a project's work programme. */
export function useDeleteActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ activity }: DeleteActivityOptions) =>
      programmeApi.deleteActivity(activity.id),
    onSuccess: (_, { activity }) => {
      notifySuccess(
        "Activity deleted",
        `${activity.activity} is no longer in the work programme.`
      )
      return queryClient.invalidateQueries({
        queryKey: programmeActivitiesQueryKey(activity.projectId),
      })
    },
    onError: (error, { activity }) =>
      notifyError(`Couldn't delete ${activity.activity}`, error),
  })
}
