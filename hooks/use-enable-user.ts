import { useMutation, useQueryClient } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"

interface EnableUserOptions {
  userId: string
}

/** Re-enables a disabled user so they can sign in again. */
export function useEnableUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: EnableUserOptions) => usersApi.enableUser(userId),
    // The users list and the active/inactive stats both change.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}
