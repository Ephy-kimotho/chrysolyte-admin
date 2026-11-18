import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolesQueryOptions } from "@/hooks/use-roles"
import * as usersApi from "@/lib/api/users"
import { notifyError, notifySuccess } from "@/lib/notify"

interface DeleteUserOptions {
  userId: string
  /** The user's name, for the confirmation toast. */
  name: string
}

/** Permanently deletes a user and their data. */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: DeleteUserOptions) => usersApi.deleteUser(userId),
    onSuccess: (_, { name }) => {
      notifySuccess(
        "User deleted",
        `${name}'s account and data were permanently deleted.`
      )
      // The users list, the role stats and each role's user count change.
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: rolesQueryOptions.queryKey }),
      ])
    },
    onError: (error, { name }) => notifyError(`Couldn't delete ${name}`, error),
  })
}
