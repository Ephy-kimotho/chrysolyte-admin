import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/mock/staff"

interface RemoveStaffMemberOptions {
  id: string
}

/** Removes a staff member. */
export function useRemoveStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: RemoveStaffMemberOptions) =>
      staffApi.removeStaffMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: staffQueryKey }),
  })
}
