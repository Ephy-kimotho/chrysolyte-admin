import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import { notifyError, notifySuccess } from "@/lib/notify"
// No delete endpoint yet; swap this for `@/lib/api/staff` once there is one.
import * as staffApi from "@/lib/mock/staff"

interface DeleteStaffMemberOptions {
  staffId: string
  /** The staff member's name, for the toasts. */
  name: string
}

/** Deletes a staff member. */
export function useDeleteStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId }: DeleteStaffMemberOptions) =>
      staffApi.deleteStaffMember(staffId),
    onSuccess: (_, { name }) => {
      notifySuccess("Staff member deleted", `${name} was removed from staff.`)
      return queryClient.invalidateQueries({ queryKey: staffQueryKey })
    },
    onError: (error, { name }) => notifyError(`Couldn't delete ${name}`, error),
  })
}
