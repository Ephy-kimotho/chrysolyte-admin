import { useMutation, useQueryClient } from "@tanstack/react-query"

import { programmeActivitiesQueryKey } from "@/hooks/use-programme-activities"
import * as programmeApi from "@/lib/api/programme"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateProgrammeActivityFormValues } from "@/lib/types/programme"

interface CreateProgrammeActivityOptions {
  projectId: string
  data: CreateProgrammeActivityFormValues
}

/** Adds an activity to a project's work programme. */
export function useCreateProgrammeActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: CreateProgrammeActivityOptions) =>
      programmeApi.createProgrammeActivity(projectId, data),
    onSuccess: (_, { projectId, data }) => {
      notifySuccess(
        "Activity added",
        `${data.activity} is now in the work programme.`
      )
      return queryClient.invalidateQueries({
        queryKey: programmeActivitiesQueryKey(projectId),
      })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.activity}`, error),
  })
}
