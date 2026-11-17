import { useMutation, useQueryClient } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"

interface DisableUserOptions {
  userId: string
}

/** Disables a user so they can no longer sign in. */
export function useDisableUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: DisableUserOptions) =>
      usersApi.disableUser(userId),
    // The users list and the active/inactive stats both change.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}
