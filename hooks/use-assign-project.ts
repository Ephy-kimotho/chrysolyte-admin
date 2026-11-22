import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { AssignProjectFormValues } from "@/lib/types/staff"

interface AssignProjectOptions {
  staffId: string
  data: AssignProjectFormValues
  /** For the notifications only. */
  staffName: string
  /** For the notifications only. */
  projectName: string
}

/** Assigns a staff member to a project for a date range. */
export function useAssignProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: AssignProjectOptions) =>
      staffApi.assignProject(staffId, data),
    onSuccess: (_, { staffName, projectName }) => {
      notifySuccess(
        "Project assigned",
        `${staffName} is now assigned to ${projectName}.`
      )
      // The list and the profile both show assignments.
      return queryClient.invalidateQueries({ queryKey: staffQueryKey })
    },
    onError: (error, { staffName }) =>
      notifyError(`Couldn't assign ${staffName} to the project`, error),
  })
}
