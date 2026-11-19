import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffProfileQueryKey } from "@/hooks/use-staff-profile"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"

interface DeleteEmergencyContactOptions {
  id: string
  /** The staff member whose profile lists the contact, to refresh it. */
  staffId: string
  /** The contact's name, for the toasts. */
  name: string
}

/** Deletes an emergency contact from a staff member's profile. */
export function useDeleteEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteEmergencyContactOptions) =>
      staffApi.deleteEmergencyContact(id),
    onSuccess: (_, { staffId, name }) => {
      notifySuccess(
        "Emergency contact deleted",
        `${name} is no longer an emergency contact.`
      )
      return queryClient.invalidateQueries({
        queryKey: staffProfileQueryKey(staffId),
      })
    },
    onError: (error, { name }) => notifyError(`Couldn't delete ${name}`, error),
  })
}
