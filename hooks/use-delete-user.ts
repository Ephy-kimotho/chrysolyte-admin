import { useMutation, useQueryClient } from "@tanstack/react-query"

import { rolesQueryOptions } from "@/hooks/use-roles"
import * as usersApi from "@/lib/api/users"

interface DeleteUserOptions {
  userId: string
}

/** Permanently deletes a user and their data. */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId }: DeleteUserOptions) => usersApi.deleteUser(userId),
    // The users list, the role stats and each role's user count change.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: rolesQueryOptions.queryKey }),
      ]),
  })
}
