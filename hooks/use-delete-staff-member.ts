import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import { staffProfileQueryKey } from "@/hooks/use-staff-profile"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"

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
    onSuccess: (_, { staffId, name }) => {
      notifySuccess("Staff member deleted", `${name} was removed from staff.`)
      // Drop their profile first, so the refresh below doesn't refetch it
      // and hit a 404 while the profile page is still open.
      queryClient.removeQueries({ queryKey: staffProfileQueryKey(staffId) })
      // Refreshes the staff lists and the dashboard headcounts.
      return queryClient.invalidateQueries({ queryKey: staffQueryKey })
    },
    onError: (error, { name }) => notifyError(`Couldn't delete ${name}`, error),
  })
}
