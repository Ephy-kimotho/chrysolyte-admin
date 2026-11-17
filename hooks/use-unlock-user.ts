import { useMutation, useQueryClient } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"

interface UnlockUserOptions {
  userId: string
}

/** Lifts a lock from too many failed sign-in attempts. */
export function useUnlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: UnlockUserOptions) => usersApi.unlockUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}
