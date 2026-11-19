import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateStaffMemberFormValues } from "@/lib/types/staff"

interface CreateStaffMemberOptions {
  data: CreateStaffMemberFormValues
}

/**
 * Adds a staff member, then uploads their photo if one was chosen. The photo
 * needs the new staff ID, so it goes in a second request. If only the upload
 * fails, the staff member still exists, so the mutation still succeeds and
 * returns the upload error as `photoError`.
 */
async function createStaffMemberWithPhoto({ data }: CreateStaffMemberOptions) {
  const staffMember = await staffApi.createStaffMember(data)
  if (!data.photo) return { staffMember, photoError: null }

  try {
    const { photo_url } = await staffApi.uploadStaffPhoto(
      staffMember.staff_id,
      data.photo
    )
    return {
      staffMember: { ...staffMember, photo_url },
      photoError: null,
    }
  } catch (photoError) {
    return { staffMember, photoError }
  }
}

/** Adds a staff member, with their profile photo when one is given. */
export function useCreateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStaffMemberWithPhoto,
    onSuccess: ({ photoError }, { data }) => {
      if (photoError) {
        notifyError(
          `${data.fullName} was added, but their photo didn't upload`,
          photoError
        )
      } else {
        notifySuccess(
          "Staff member added",
          `${data.fullName} has been added to ${data.division}.`
        )
      }
      return queryClient.invalidateQueries({ queryKey: staffQueryKey })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.fullName}`, error),
  })
}
