import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffProfileQueryKey } from "@/hooks/use-staff-profile"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"
import type { CreateStaffSkillFormValues } from "@/lib/types/staff"

interface CreateStaffSkillOptions {
  staffId: string
  data: CreateStaffSkillFormValues
}

/** Adds a skill to a staff member's profile. */
export function useCreateStaffSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: CreateStaffSkillOptions) =>
      staffApi.createStaffSkill(staffId, data),
    onSuccess: (_, { staffId, data }) => {
      notifySuccess("Skill added", `${data.skill} is now on their profile.`)
      return queryClient.invalidateQueries({
        queryKey: staffProfileQueryKey(staffId),
      })
    },
    onError: (error, { data }) =>
      notifyError(`Couldn't add ${data.skill}`, error),
  })
}
