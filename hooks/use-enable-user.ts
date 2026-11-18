import { useMutation, useQueryClient } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"
import { notifyError, notifySuccess } from "@/lib/notify"

interface EnableUserOptions {
  userId: string
  /** The user's name, for the confirmation toast. */
  name: string
}

/** Re-enables a disabled user so they can sign in again. */
export function useEnableUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: EnableUserOptions) => usersApi.enableUser(userId),
    onSuccess: (_, { name }) => {
      notifySuccess("User enabled", `${name} can sign in again.`)
      // The users list and the active/inactive stats both change.
      return queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error, { name }) => notifyError(`Couldn't enable ${name}`, error),
  })
}
