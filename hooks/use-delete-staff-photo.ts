import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"

interface DeleteStaffPhotoOptions {
  staffId: string
  /** The staff member's name, for the toasts. */
  name: string
}

/** Deletes a staff member's profile photo, so their initials show instead. */
export function useDeleteStaffPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId }: DeleteStaffPhotoOptions) =>
      staffApi.deleteStaffPhoto(staffId),
    onSuccess: (_, { name }) => {
      notifySuccess("Photo deleted", `${name}'s initials show in its place.`)
      // The photo shows on the profile and in the staff list.
      return queryClient.invalidateQueries({ queryKey: staffQueryKey })
    },
    onError: (error, { name }) =>
      notifyError(`Couldn't delete ${name}'s photo`, error),
  })
}
