import { useMutation, useQueryClient } from "@tanstack/react-query"

import * as usersApi from "@/lib/api/users"
import { notifyError, notifySuccess } from "@/lib/notify"

interface DisableUserOptions {
  userId: string
  /** The user's name, for the confirmation toast. */
  name: string
}

/** Disables a user so they can no longer sign in. */
export function useDisableUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: DisableUserOptions) =>
      usersApi.disableUser(userId),
    onSuccess: (_, { name }) => {
      notifySuccess(
        "User disabled",
        `${name} can't sign in until their account is enabled again.`
      )
      // The users list and the active/inactive stats both change.
      return queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error, { name }) =>
      notifyError(`Couldn't disable ${name}`, error),
  })
}
