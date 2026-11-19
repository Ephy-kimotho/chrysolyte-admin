import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffProfileQueryKey } from "@/hooks/use-staff-profile"
import * as staffApi from "@/lib/api/staff"
import { notifyError, notifySuccess } from "@/lib/notify"

interface DeleteStaffSkillOptions {
  id: string
  /** The staff member whose profile lists the skill, to refresh it. */
  staffId: string
  /** The skill's name, for the toasts. */
  name: string
}

/** Deletes a skill from a staff member's profile. */
export function useDeleteStaffSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteStaffSkillOptions) =>
      staffApi.deleteStaffSkill(id),
    onSuccess: (_, { staffId, name }) => {
      notifySuccess("Skill deleted", `${name} is no longer on their profile.`)
      return queryClient.invalidateQueries({
        queryKey: staffProfileQueryKey(staffId),
      })
    },
    onError: (error, { name }) => notifyError(`Couldn't delete ${name}`, error),
  })
}
