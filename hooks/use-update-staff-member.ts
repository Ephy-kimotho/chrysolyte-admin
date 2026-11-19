import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { UpdateStaffMemberFormValues } from "@/lib/types/staff"

interface UpdateStaffMemberOptions {
  staffId: string
  data: UpdateStaffMemberFormValues
}

/** Updates a staff member's details. */
export function useUpdateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: UpdateStaffMemberOptions) =>
      staffApi.updateStaffMember(staffId, data),
    onSuccess: (_, { data }) => {
      notifySuccess(
        "Staff member updated",
        `${data.fullName}'s details were saved.`
      )
      // The list, the profile and the summary counts can all change.
      return queryClient.invalidateQueries({ queryKey: staffQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't update ${data.fullName}`, error),
  })
}
