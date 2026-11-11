import { useMutation, useQueryClient } from "@tanstack/react-query"

import { staffQueryKey } from "@/hooks/use-staff"
import * as staffApi from "@/lib/mock/staff"
import type { CreateStaffMemberFormValues } from "@/lib/types/staff"

interface CreateStaffMemberOptions {
  data: CreateStaffMemberFormValues
}

/** Adds a staff member. */
export function useCreateStaffMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data }: CreateStaffMemberOptions) =>
      staffApi.createStaffMember(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: staffQueryKey }),
  })
}
