import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { UploadStaffPhotoFormValues } from "@/lib/types/staff"

interface UploadStaffPhotoOptions {
  staffId: string
  /** The staff member's name, for the toasts. */
  name: string
  data: UploadStaffPhotoFormValues
}

/** Uploads a staff member's profile photo. */
export function useUploadStaffPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: UploadStaffPhotoOptions) => {
      // The schema rejects a missing photo, so this is only for TypeScript.
      if (!data.photo) throw new Error("Choose a photo to upload")
      return staffApi.uploadStaffPhoto(staffId, data.photo)
    },
    onSuccess: (_, { name }) => {
      notifySuccess("Photo uploaded", `${name}'s profile photo was updated.`)
      // The photo shows on the profile and in the staff list.
      return queryClient.invalidateQueries({ queryKey: staffQueryKey })
    },
    onError: (error, { name }) =>
      notifyError(`Couldn't upload ${name}'s photo`, error),
  })
}
