import { useMutation, useQueryClient } from "@tanstack/react-query"

import { programmeActivitiesQueryKey } from "@/hooks/use-programme-activities"
import * as programmeApi from "@/lib/api/programme"
import { notifyError, notifySuccess } from "@/lib/notify"
import type {
  ProgrammeActivity,
  ProgressUpdateFormValues,
} from "@/lib/types/programme"

interface UpdateActivityProgressOptions {
  /** The activity as saved; the API needs its other details too. */
  activity: ProgrammeActivity
  data: ProgressUpdateFormValues
}

/** Sets a work programme activity's completion. */
export function useUpdateActivityProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ activity, data }: UpdateActivityProgressOptions) =>
      programmeApi.updateActivityProgress(activity, data.progress),
    onSuccess: (_, { activity, data }) => {
      notifySuccess(
        "Progress saved",
        `${activity.activity} is ${data.progress}% complete.`
      )
      return queryClient.invalidateQueries({
        queryKey: programmeActivitiesQueryKey(activity.projectId),
      })
    },
    onError: (error, { activity }) =>
      notifyError(`Couldn't save ${activity.activity}'s progress`, error),
  })
}
