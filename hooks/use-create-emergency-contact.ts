import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffProfileQueryKey } from "@/hooks/use-staff-profile"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateEmergencyContactFormValues } from "@/lib/types/staff"

interface CreateEmergencyContactOptions {
  staffId: string
  data: CreateEmergencyContactFormValues
}

/** Adds an emergency contact to a staff member's profile. */
export function useCreateEmergencyContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: CreateEmergencyContactOptions) =>
      staffApi.createEmergencyContact(staffId, data),
    onSuccess: (_, { staffId, data }) => {
      notifySuccess(
        "Emergency contact added",
        `${data.name} is now on record as an emergency contact.`
      )
      return queryClient.invalidateQueries({
        queryKey: staffProfileQueryKey(staffId),
      })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.name}`, error),
  })
}
